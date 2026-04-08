const bgm = document.getElementById("bgm");
const homeBtn = document.getElementById("homeBtn");
const homeFooter = document.getElementById("homeFooter");
const musicBtn = document.getElementById("musicBtn");
const storySelect = document.getElementById("storySelect");
const startBtn = document.getElementById("startBtn");
const sceneArea = document.getElementById("sceneArea");
const sceneImg = document.getElementById("sceneImg");
const sceneIndexBadge = document.getElementById("sceneIndexBadge");
const wordBankEl = document.getElementById("wordBank");
const dropArea = document.getElementById("dropArea");
const hintBtn = document.getElementById("hintBtn");
const clearBtn = document.getElementById("clearBtn");
const nextBtn = document.getElementById("nextBtn");
const feedback = document.getElementById("feedback");
const starBtn = document.getElementById("starBtn");

try {
  localStorage.setItem("lastVisitedFull", "menu ceritaku/menu ceritaku.html");
} catch (error) {
  /* noop */
}

const CHEER_SRC = "https://www.myinstants.com/media/sounds/kids_cheering.mp3";
const AWW_SRC = "https://www.myinstants.com/media/sounds/studio-audience-awwww-sound-fx.mp3";

const yeayAudio = new Audio(CHEER_SRC);
yeayAudio.preload = "auto";
yeayAudio.volume = 1;

const wrongAudio = new Audio(AWW_SRC);
wrongAudio.preload = "auto";
wrongAudio.volume = 1;

const stories = {
  andi: {
    id: "andi",
    title: "Andi Pergi ke Sekolah",
    scenes: [
      { img: "Andi 1.jpeg", sentence: "Andi bangun pagi dan meregangkan tubuhnya." },
      { img: "Andi 2.jpeg", sentence: "Andi mandi dengan sabun dan bermain busa." },
      { img: "Andi 3.jpeg", sentence: "Andi sarapan sehat agar kuat di sekolah." },
      { img: "Andi 4.jpeg", sentence: "Andi berjalan menuju sekolah sambil tersenyum." },
    ],
  },
  kancil: {
    id: "kancil",
    title: "Si Kancil dan Buaya",
    scenes: [
      { img: "Kancil 1.jpeg", sentence: "Kancil melihat buaya di tepi sungai." },
      { img: "Kancil 2.jpeg", sentence: "Buaya membuka mulutnya mendekati Kancil." },
      { img: "Kancil 3.jpeg", sentence: "Kancil melompat di atas punggung buaya dan menyeberang." },
      { img: "Kancil 4.jpeg", sentence: "Kancil sampai di seberang dan memetik apel." },
    ],
  },
};

let currentStory = null;
let currentSceneIndex = 0;
let hintLevel = 0;
let sceneSolved = false;
let touchStartElement = null;
let draggedWord = null;
const hintedSlots = new Set();
const playedYeay = {};
const progressKey = "cerita_progress";
let progress = JSON.parse(localStorage.getItem(progressKey) || "{}");

function sceneKey() {
  return `${currentStory.id}_${currentSceneIndex}`;
}

function playYeayOnce(key) {
  if (playedYeay[key]) return;
  wrongAudio.pause();
  wrongAudio.currentTime = 0;
  yeayAudio.pause();
  yeayAudio.currentTime = 0;
  yeayAudio.play().catch(() => {});
  playedYeay[key] = true;
}

function playWrong() {
  yeayAudio.pause();
  yeayAudio.currentTime = 0;
  wrongAudio.pause();
  wrongAudio.currentTime = 0;
  wrongAudio.play().catch(() => {});
}

function spawnStars(count = 10) {
  for (let i = 0; i < count; i += 1) {
    const star = document.createElement("div");
    star.className = "bintang";
    star.textContent = "⭐";
    star.style.left = `${Math.random() * 88 + 4}vw`;
    star.style.fontSize = `${16 + Math.random() * 30}px`;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 2600);
  }
}

function getSceneWords() {
  return currentStory.scenes[currentSceneIndex].sentence.split(/\s+/).filter(Boolean);
}

function syncMusicIcon() {
  if (!musicBtn) return;
  musicBtn.textContent = bgm.paused ? "🎵" : "🔊";
}

function initStoryOptions() {
  Object.values(stories).forEach((story) => {
    const option = document.createElement("option");
    option.value = story.id;
    option.textContent = story.title;
    storySelect.appendChild(option);
  });
}

function renderSlots(count) {
  dropArea.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = String(i);
    slot.addEventListener("dragover", (event) => event.preventDefault());
    slot.addEventListener("drop", onDropToSlot);
    dropArea.appendChild(slot);
  }
}

function renderWordBank(words) {
  wordBankEl.innerHTML = "";
  words.forEach((word) => {
    const el = document.createElement("div");
    el.className = "word";
    el.textContent = word;
    el.draggable = true;
    el.dataset.word = word;
    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("dragend", onDragEnd);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    wordBankEl.appendChild(el);
  });
}

function loadScene() {
  const scene = currentStory.scenes[currentSceneIndex];
  const words = getSceneWords();

  sceneImg.src = scene.img;
  sceneImg.alt = `Gambar ${currentSceneIndex + 1}`;
  sceneImg.onerror = function onImageError() {
    this.src = "";
    feedback.textContent = "(Gambar tidak ditemukan)";
  };

  sceneIndexBadge.textContent = `${currentSceneIndex + 1}/${currentStory.scenes.length}`;
  renderSlots(words.length);
  renderWordBank(shuffleArray(words));
  hintLevel = 0;
  hintedSlots.clear();
  sceneSolved = !!progress[sceneKey()];
  nextBtn.classList.toggle("hidden", !sceneSolved);
  feedback.textContent = sceneSolved
    ? "Scene ini sudah selesai. Tekan Lanjut untuk melanjutkan cerita."
    : "Susun kata dari gambar menjadi sebuah kalimat.";
}

function openStory(id) {
  currentStory = stories[id];
  currentSceneIndex = 0;
  sceneArea.classList.remove("hidden");
  loadScene();
}

function setSlotWord(slot, wordEl) {
  if (slot.firstChild) {
    wordBankEl.appendChild(slot.firstChild);
  }
  slot.appendChild(wordEl);
  slot.classList.add("filled");
}

function onDragStart(event) {
  draggedWord = event.target;
  event.dataTransfer.setData("text/plain", event.target.dataset.word);
  event.target.classList.add("dragging");
}

function onDragEnd(event) {
  event.target.classList.remove("dragging");
  draggedWord = null;
}

function onDropToSlot(event) {
  event.preventDefault();
  const slot = event.currentTarget;
  const word = event.dataTransfer.getData("text/plain");
  const draggedEl =
    draggedWord ||
    Array.from(document.querySelectorAll(".word")).find((candidate) => candidate.dataset.word === word);

  if (!draggedEl) return;

  setSlotWord(slot, draggedEl);
  checkAssembly();
}

wordBankEl.addEventListener("dragover", (event) => event.preventDefault());
wordBankEl.addEventListener("drop", (event) => {
  event.preventDefault();
  const word = event.dataTransfer.getData("text/plain");
  const slotWord = Array.from(document.querySelectorAll(".slot .word")).find((item) => item.dataset.word === word);
  if (!slotWord) return;
  const parentSlot = slotWord.parentElement;
  wordBankEl.appendChild(slotWord);
  parentSlot.classList.remove("filled");
  checkAssembly();
});

function onTouchStart(event) {
  touchStartElement = event.target.closest(".word");
  if (touchStartElement) touchStartElement.classList.add("dragging");
}

function onTouchMove(event) {
  if (!touchStartElement) return;
  event.preventDefault();
  const touch = event.touches[0];
  const hovered = document.elementFromPoint(touch.clientX, touch.clientY);

  document.querySelectorAll(".slot.drag-over").forEach((slot) => slot.classList.remove("drag-over"));
  if (hovered && hovered.classList.contains("slot")) {
    hovered.classList.add("drag-over");
  }
}

function onTouchEnd(event) {
  if (!touchStartElement) return;

  const touch = event.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);

  if (target && target.classList.contains("slot")) {
    setSlotWord(target, touchStartElement);
  } else if (target && target.closest("#wordBank")) {
    if (touchStartElement.parentElement.classList.contains("slot")) {
      touchStartElement.parentElement.classList.remove("filled");
    }
    wordBankEl.appendChild(touchStartElement);
  }

  touchStartElement.classList.remove("dragging");
  document.querySelectorAll(".slot.drag-over").forEach((slot) => slot.classList.remove("drag-over"));
  touchStartElement = null;
  checkAssembly();
}

function updateSlotClasses() {
  dropArea.querySelectorAll(".slot").forEach((slot) => {
    slot.classList.toggle("filled", !!slot.firstChild);
  });
}

function onSceneCorrect() {
  if (sceneSolved) return;

  sceneSolved = true;
  progress[sceneKey()] = true;
  localStorage.setItem(progressKey, JSON.stringify(progress));

  const rewardResult =
    window.rewardSystem && typeof window.rewardSystem.grantStorySceneReward === "function"
      ? window.rewardSystem.grantStorySceneReward(currentStory.id, currentSceneIndex, currentStory.scenes.length)
      : null;

  playYeayOnce(sceneKey());
  spawnStars(10);
  nextBtn.classList.remove("hidden");
  feedback.textContent =
    rewardResult && rewardResult.granted
      ? "Benar! Kamu mendapat 2 bintang baru. Tekan Lanjut."
      : "Benar! Cerita siap dilanjutkan. Tekan Lanjut.";
}

function checkAssembly() {
  updateSlotClasses();

  if (sceneSolved) return;

  const slots = Array.from(dropArea.querySelectorAll(".slot"));
  const assembled = slots.map((slot) => (slot.firstChild ? slot.firstChild.dataset.word : null));

  if (assembled.some((word) => word === null)) return;

  const correct = assembled.join(" ") === getSceneWords().join(" ");
  if (correct) {
    onSceneCorrect();
  } else {
    playWrong();
    feedback.textContent = "Urutan belum benar. Coba lagi.";
    dropArea.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 300 }
    );
  }
}

function fillSlotWithWord(index, wordText) {
  const slot = dropArea.querySelector(`.slot[data-index="${index}"]`);
  if (!slot) return false;

  if (slot.firstChild && slot.firstChild.dataset.word === wordText) return true;

  const existing = Array.from(document.querySelectorAll(".word")).find((item) => item.dataset.word === wordText);
  if (!existing) return false;

  setSlotWord(slot, existing);
  return true;
}

function applyHintLevel(level) {
  const words = getSceneWords();
  if (sceneSolved) {
    feedback.textContent = "Scene ini sudah selesai. Tekan Lanjut untuk melanjutkan cerita.";
    return;
  }

  if (level === 1 || level === 2) {
    for (let i = 0; i < level && i < words.length; i += 1) {
      if (fillSlotWithWord(i, words[i])) {
        hintedSlots.add(i);
      }
    }
    feedback.textContent = `Petunjuk level ${level}: ${Math.min(level, words.length)} kata terisi.`;
    checkAssembly();
    return;
  }

  hintedSlots.forEach((index) => {
    fillSlotWithWord(index, words[index]);
  });

  feedback.textContent = "Petunjuk level 3: dengarkan kalimatnya.";
  const utterance = new SpeechSynthesisUtterance(words.join(" "));
  utterance.lang = "id-ID";
  utterance.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function shuffleArray(values) {
  return values.slice().sort(() => Math.random() - 0.5);
}

musicBtn && musicBtn.addEventListener("click", () => {
  if (bgm.paused) {
    bgm.play().catch(() => {});
  } else {
    bgm.pause();
  }
  syncMusicIcon();
});

homeBtn && homeBtn.addEventListener("click", () => {
  location.href = "../main menu.html";
});

homeFooter && homeFooter.addEventListener("click", () => {
  location.href = "../main menu.html";
});

startBtn.addEventListener("click", () => {
  openStory(storySelect.value || "andi");
});

nextBtn.addEventListener("click", () => {
  if (!sceneSolved) {
    feedback.textContent = "Selesaikan scene ini dulu sebelum lanjut.";
    return;
  }

  if (currentSceneIndex < currentStory.scenes.length - 1) {
    currentSceneIndex += 1;
    loadScene();
  } else {
    feedback.textContent = "Selamat! Ceritanya selesai.";
    nextBtn.classList.add("hidden");
  }
});

clearBtn.addEventListener("click", () => {
  dropArea.querySelectorAll(".slot").forEach((slot) => {
    if (slot.firstChild) wordBankEl.appendChild(slot.firstChild);
    slot.classList.remove("filled");
  });
  hintLevel = 0;
  hintedSlots.clear();
  feedback.textContent = sceneSolved
    ? "Scene ini sudah selesai. Tekan Lanjut untuk melanjutkan cerita."
    : "Susunan dikosongkan.";
});

hintBtn.addEventListener("click", () => {
  if (!currentStory) return;
  if (hintLevel < 3) hintLevel += 1;
  applyHintLevel(hintLevel);
});

if (starBtn) {
  starBtn.addEventListener("click", () => spawnStars(12));
}

initStoryOptions();
storySelect.value = Object.keys(stories)[0];
syncMusicIcon();
startBtn.click();
