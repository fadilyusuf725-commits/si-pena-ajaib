/* ========= WORD BANK ========= */
const wordBank = {
  A: [
    { word: "Ayam", icon: "🐓" },
    { word: "Apel", icon: "🍎" },
    { word: "Awan", icon: "☁️" },
  ],
  B: [
    { word: "Bola", icon: "⚽" },
    { word: "Buku", icon: "📘" },
    { word: "Bunga", icon: "🌸" },
  ],
  C: [
    { word: "Ceri", icon: "🍒" },
    { word: "Coklat", icon: "🍫" },
    { word: "Cermin", icon: "🪞" },
  ],
  D: [
    { word: "Dadu", icon: "🎲" },
    { word: "Donat", icon: "🍩" },
    { word: "Daun", icon: "🍃" },
  ],
  E: [
    { word: "Es", icon: "❄️" },
    { word: "Ember", icon: "🪣" },
    { word: "Elang", icon: "🦅" },
  ],
  F: [
    { word: "Foto", icon: "📷" },
    { word: "Fajar", icon: "🌅" },
    { word: "Flamingo", icon: "🦩" },
  ],
  G: [
    { word: "Gajah", icon: "🐘" },
    { word: "Gelas", icon: "🥛" },
    { word: "Gerhana", icon: "🌘" },
  ],
  H: [
    { word: "Hati", icon: "❤️" },
    { word: "Hujan", icon: "🌧️" },
    { word: "Helikopter", icon: "🚁" },
  ],
  I: [
    { word: "Ikan", icon: "🐟" },
    { word: "Itik", icon: "🦆" },
    { word: "Indonesia", icon: "🇮🇩" },
  ],
  J: [
    { word: "Jagung", icon: "🌽" },
    { word: "Jerapah", icon: "🦒" },
    { word: "Jam", icon: "⏰" },
  ],
  K: [
    { word: "Kuda", icon: "🐎" },
    { word: "Kucing", icon: "🐈" },
    { word: "Kue", icon: "🍰" },
  ],
  L: [
    { word: "Lampu", icon: "💡" },
    { word: "Lebah", icon: "🐝" },
    { word: "Lemon", icon: "🍋" },
  ],
  M: [
    { word: "Mobil", icon: "🚗" },
    { word: "Madu", icon: "🍯" },
    { word: "Mawar", icon: "🌹" },
  ],
  N: [
    { word: "Nanas", icon: "🍍" },
    { word: "Nasi", icon: "🍚" },
    { word: "Notebook", icon: "📓" },
  ],
  O: [
    { word: "Ombak", icon: "🌊" },
    { word: "Obat", icon: "💊" },
    { word: "Origami", icon: "🧧" },
  ],
  P: [
    { word: "Pisang", icon: "🍌" },
    { word: "Payung", icon: "☂️" },
    { word: "Planet", icon: "🪐" },
  ],
  Q: [
    { word: "Quran", icon: "📖" },
    { word: "Qatar", icon: "🇶🇦" },
  ],
  R: [
    { word: "Roti", icon: "🍞" },
    { word: "Rumah", icon: "🏠" },
    { word: "Roket", icon: "🚀" },
  ],
  S: [
    { word: "Sapi", icon: "🐄" },
    { word: "Sepeda", icon: "🚲" },
    { word: "Salju", icon: "❄️" },
  ],
  T: [
    { word: "Tas", icon: "👝" },
    { word: "Topi", icon: "🎩" },
    { word: "Taman", icon: "🏞️" },
  ],
  U: [
    { word: "Ular", icon: "🐍" },
    { word: "Udang", icon: "🦐" },
    { word: "Ulat", icon: "🐛" },
  ],
  V: [
    { word: "Vas", icon: "🏺" },
    { word: "Violin", icon: "🎻" },
    { word: "Video", icon: "🎥" },
  ],
  W: [
    { word: "Wortel", icon: "🥕" },
    { word: "Warna", icon: "🎨" },
    { word: "Wajah", icon: "🙂" },
  ],
  X: [
    { word: "Xylophone", icon: "🎶" },
    { word: "Xbox", icon: "🎮" },
    { word: "X-ray", icon: "💀" },
  ],
  Y: [
    { word: "Yoyo", icon: "🪀" },
    { word: "Yoga", icon: "🧘" },
    { word: "Yukata", icon: "👘" },
  ],
  Z: [
    { word: "Zebra", icon: "🦓" },
    { word: "Zombie", icon: "🧟" },
    { word: "Zaitun", icon: "🫒" },
  ],
};

try {
  localStorage.setItem("lastVisitedFull", "menu kataku/kataku.html");
} catch (error) {
  /* noop */
}

const gridEl = document.getElementById("grid");
const emojiEl = document.getElementById("emoji");
const wordEl = document.getElementById("word");
const speakBtn = document.getElementById("speakBtn");
const hintBtn = document.getElementById("hintBtn");
const clearBtn = document.getElementById("clearBtn");
const nextBtn = document.getElementById("nextBtn");
const templateCanvas = document.getElementById("templateCanvas");
const drawCanvas = document.getElementById("drawCanvas");
const statusText = document.getElementById("statusText");
const templateCtx = templateCanvas.getContext("2d");
const ctx = drawCanvas.getContext("2d", { willReadFrequently: true });

const homeBtn = document.getElementById("homeBtn");
const mulaiBtn = document.getElementById("mulaiBtn");
const audioBtn = document.getElementById("audioBtn");
const starBtn = document.getElementById("starBtn");
const bgm = document.getElementById("bgm");
const resetBtn = document.getElementById("resetBtn");

const maskCanvas = document.createElement("canvas");
maskCanvas.width = drawCanvas.width;
maskCanvas.height = drawCanvas.height;
const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });

const cheerSound = new Audio("https://www.myinstants.com/media/sounds/kids_cheering.mp3");

const SAMPLE_STEP = 2;
const COVERAGE_THRESHOLD = 24;
const OUTSIDE_THRESHOLD = 45;
const MIN_INK_SAMPLES = 160;
const DILATION_RADIUS = 5;

let currentLetter = "A";
let currentWord = null;
let showingGuide = true;
let drawing = false;
let progressLetters = JSON.parse(localStorage.getItem("progressLetters") || "{}");
let wordMaskPixels = new Uint8Array(drawCanvas.width * drawCanvas.height);
let wordMaskCount = 0;
let currentLayout = null;

function setStatus(message, isError = false) {
  if (!statusText) return;
  statusText.textContent = message;
  statusText.style.color = isError ? "#b42318" : "#164e86";
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getWordLayout(text) {
  const baseSize = 120;
  const minSize = 54;
  const maxWidth = drawCanvas.width - 70;
  let fontSize = baseSize;

  while (fontSize > minSize) {
    templateCtx.font = `900 ${fontSize}px Nunito`;
    if (templateCtx.measureText(text).width <= maxWidth) break;
    fontSize -= 2;
  }

  return {
    fontSize,
    font: `900 ${fontSize}px Nunito`,
    x: drawCanvas.width / 2,
    y: drawCanvas.height / 2 + fontSize * 0.07,
  };
}

function dilateMask(mask, width, height, radius) {
  const output = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (!mask[index]) continue;
      for (let yy = Math.max(0, y - radius); yy <= Math.min(height - 1, y + radius); yy += 1) {
        for (let xx = Math.max(0, x - radius); xx <= Math.min(width - 1, x + radius); xx += 1) {
          output[yy * width + xx] = 1;
        }
      }
    }
  }
  return output;
}

function buildWordMask(text) {
  currentLayout = getWordLayout(text);
  maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  maskCtx.fillStyle = "#fff";
  maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
  maskCtx.strokeStyle = "#000";
  maskCtx.lineWidth = 20;
  maskCtx.lineJoin = "round";
  maskCtx.lineCap = "round";
  maskCtx.textAlign = "center";
  maskCtx.textBaseline = "middle";
  maskCtx.font = currentLayout.font;
  maskCtx.strokeText(text, currentLayout.x, currentLayout.y);

  const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
  const rawMask = new Uint8Array(maskCanvas.width * maskCanvas.height);

  for (let y = 0; y < maskCanvas.height; y += 1) {
    for (let x = 0; x < maskCanvas.width; x += 1) {
      const flatIndex = y * maskCanvas.width + x;
      const dataIndex = flatIndex * 4;
      const dark = imageData[dataIndex + 3] > 10 && imageData[dataIndex] < 80;
      if (dark) rawMask[flatIndex] = 1;
    }
  }

  wordMaskPixels = dilateMask(rawMask, maskCanvas.width, maskCanvas.height, DILATION_RADIUS);
  wordMaskCount = 0;

  for (let y = 0; y < maskCanvas.height; y += SAMPLE_STEP) {
    for (let x = 0; x < maskCanvas.width; x += SAMPLE_STEP) {
      if (wordMaskPixels[y * maskCanvas.width + x]) wordMaskCount += 1;
    }
  }
}

function renderGuide() {
  templateCtx.clearRect(0, 0, templateCanvas.width, templateCanvas.height);
  templateCtx.fillStyle = "#fff";
  templateCtx.fillRect(0, 0, templateCanvas.width, templateCanvas.height);
  templateCtx.textAlign = "center";
  templateCtx.textBaseline = "middle";
  templateCtx.lineWidth = 2;
  templateCtx.strokeStyle = "#6aa5ff";
  templateCtx.setLineDash([8, 5]);
  templateCtx.font = currentLayout.font;
  templateCtx.strokeText(cap(currentWord.word), currentLayout.x, currentLayout.y);
  templateCtx.setLineDash([]);
  templateCanvas.style.opacity = showingGuide ? "1" : "0";
}

function clearDrawingSurface(message = "Coretan dibersihkan.") {
  ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  if (message) setStatus(message);
  drawCanvas.style.boxShadow = "";
}

function highlight(letter) {
  document.querySelectorAll(".letter").forEach((el) => {
    const gridLetter = el.textContent;
    if (gridLetter === letter) {
      el.style.background = "#e7f4ff";
      el.style.transform = "scale(1.06)";
    } else {
      el.style.background = "#fff";
      el.style.transform = "none";
    }

    if (progressLetters[gridLetter]) el.classList.add("done");
    else el.classList.remove("done");
  });
}

function loadWord() {
  const list = wordBank[currentLetter];
  let nextWord = list[Math.floor(Math.random() * list.length)];

  if (currentWord && list.length > 1) {
    while (nextWord.word === currentWord.word) {
      nextWord = list[Math.floor(Math.random() * list.length)];
    }
  }

  currentWord = nextWord;
  emojiEl.textContent = nextWord.icon;
  wordEl.textContent = cap(nextWord.word);

  buildWordMask(cap(nextWord.word));
  renderGuide();
  clearDrawingSurface("Ikuti bentuk kata, lalu tekan tombol kata berikutnya saat selesai.");
}

function pickLetter(letter) {
  currentLetter = letter;
  highlight(letter);
  loadWord();
}

function getPointerPosition(event) {
  const rect = drawCanvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  return {
    x: (point.clientX - rect.left) * (drawCanvas.width / rect.width),
    y: (point.clientY - rect.top) * (drawCanvas.height / rect.height),
  };
}

function showInvalidState(message) {
  setStatus(message, true);
  drawCanvas.style.boxShadow = "0 0 0 5px rgba(228, 72, 72, 0.28)";
  setTimeout(() => {
    drawCanvas.style.boxShadow = "";
  }, 1200);
}

function evaluateWriting() {
  const imageData = ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height).data;
  let totalInkSamples = 0;
  let insideHits = 0;

  for (let y = 0; y < drawCanvas.height; y += SAMPLE_STEP) {
    for (let x = 0; x < drawCanvas.width; x += SAMPLE_STEP) {
      const flatIndex = y * drawCanvas.width + x;
      const dataIndex = flatIndex * 4;
      const r = imageData[dataIndex];
      const g = imageData[dataIndex + 1];
      const b = imageData[dataIndex + 2];
      const a = imageData[dataIndex + 3];
      const isInk = a > 20 && r + g + b < 700;

      if (!isInk) continue;
      totalInkSamples += 1;
      if (wordMaskPixels[flatIndex]) insideHits += 1;
    }
  }

  if (totalInkSamples < MIN_INK_SAMPLES) {
    return {
      success: false,
      message: "Coretanmu masih terlalu sedikit. Yuk tebalkan kata di garis bantu.",
    };
  }

  const outsideHits = Math.max(0, totalInkSamples - insideHits);
  const coverage = wordMaskCount ? Math.round((insideHits / wordMaskCount) * 100) : 0;
  const outsidePct = totalInkSamples ? Math.round((outsideHits / totalInkSamples) * 100) : 0;

  if (outsidePct >= OUTSIDE_THRESHOLD) {
    return {
      success: false,
      message: "Masih banyak coretan di luar bentuk kata. Coba ikuti garis birunya lebih dekat.",
    };
  }

  if (coverage < COVERAGE_THRESHOLD) {
    return {
      success: false,
      message: "Bentuk kata belum cukup terikuti. Lanjutkan tracing sampai lebih lengkap.",
    };
  }

  return { success: true };
}

function spawnStars(count = 10) {
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement("div");
    el.className = "bintang";
    el.textContent = "⭐";
    el.style.left = `${Math.random() * 88 + 4}vw`;
    el.style.fontSize = `${16 + Math.random() * 30}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }
}

function resetProgress() {
  localStorage.removeItem("progressLetters");
  progressLetters = {};
  document.querySelectorAll(".letter").forEach((el) => el.classList.remove("done"));
  highlight(currentLetter);
  setStatus("Progres huruf pada Kataku sudah direset.");
}

Object.keys(wordBank).forEach((letter) => {
  const tile = document.createElement("div");
  tile.className = "letter";
  tile.textContent = letter;
  tile.onclick = () => pickLetter(letter);
  gridEl.appendChild(tile);
});

drawCanvas.addEventListener("pointerdown", (event) => {
  drawing = true;
  const point = getPointerPosition(event);
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#134b78";
  event.preventDefault();
});

drawCanvas.addEventListener("pointermove", (event) => {
  if (!drawing) return;
  const point = getPointerPosition(event);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
});

["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
  drawCanvas.addEventListener(eventName, () => {
    drawing = false;
  });
});

nextBtn.onclick = () => {
  const result = evaluateWriting();

  if (!result.success) {
    showInvalidState(result.message);
    return;
  }

  cheerSound.currentTime = 0;
  cheerSound.play().catch(() => {});
  spawnStars(18);
  progressLetters[currentLetter] = true;
  localStorage.setItem("progressLetters", JSON.stringify(progressLetters));
  highlight(currentLetter);

  const rewardResult =
    window.rewardSystem && typeof window.rewardSystem.grantKatakuReward === "function"
      ? window.rewardSystem.grantKatakuReward(currentLetter)
      : null;

  loadWord();

  if (rewardResult && rewardResult.granted) {
    setStatus(`Hebat! Huruf ${currentLetter} mendapat 1 bintang baru.`);
  } else {
    setStatus("Bagus! Kata berikutnya sudah siap untuk ditulis.");
  }
};

speakBtn.onclick = () => {
  const utterance = new SpeechSynthesisUtterance(currentWord.word);
  utterance.lang = "id-ID";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

clearBtn.onclick = () => clearDrawingSurface();

hintBtn.onclick = () => {
  showingGuide = !showingGuide;
  hintBtn.textContent = showingGuide ? "📝 Sembunyikan Petunjuk" : "📝 Petunjuk";
  templateCanvas.style.opacity = showingGuide ? "1" : "0";
  setStatus(showingGuide ? "Petunjuk ditampilkan lagi." : "Petunjuk disembunyikan, coretanmu tetap aman.");
};

homeBtn.onclick = () => {
  window.location.href = "../main menu.html";
};

mulaiBtn.onclick = () => {
  const letters = Object.keys(wordBank);
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  pickLetter(randomLetter);
  document.querySelector(".latihan").scrollIntoView({ behavior: "smooth" });
};

let audioOn = (function () {
  try {
    if (typeof window !== "undefined" && window.__bgm_playing !== undefined) return !!window.__bgm_playing;
    const value = localStorage && localStorage.getItem ? localStorage.getItem("bgmPlaying") : null;
    return value === "1";
  } catch (error) {
    return false;
  }
})();

audioBtn.onclick = () => {
  if (audioOn) {
    bgm.pause();
    audioBtn.textContent = "🎵";
  } else {
    bgm.play().catch(() => {});
    audioBtn.textContent = "🔊";
  }
  audioOn = !audioOn;
};

if (starBtn) {
  starBtn.addEventListener("click", () => spawnStars(12));
}

function showResetModal() {
  const modal = document.createElement("div");
  modal.className = "reset-modal";
  modal.innerHTML = `
    <div class="reset-dialog">
      <h3>Reset Semua Progres?</h3>
      <p>Tindakan ini tidak bisa dibatalkan.</p>
      <div class="modal-buttons">
        <button class="btn-cancel">Batal</button>
        <button class="btn-confirm">Ya, Reset</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector(".btn-cancel").onclick = () => modal.remove();
  modal.querySelector(".btn-confirm").onclick = () => {
    resetProgress();
    modal.remove();
  };
}

resetBtn.onclick = () => showResetModal();

pickLetter("A");
