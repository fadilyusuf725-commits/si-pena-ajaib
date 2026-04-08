const MENU_TARGETS = {
  huruf: "menu hurufku/a/a.html",
  kata: "menu kataku/kataku.html",
  cerita: "menu ceritaku/menu ceritaku.html",
};

function rememberLastVisited(path) {
  try {
    localStorage.setItem("lastVisitedFull", path);
  } catch (error) {
    /* noop */
  }
}

function getResumeTarget() {
  try {
    return localStorage.getItem("lastVisitedFull") || MENU_TARGETS.huruf;
  } catch (error) {
    return MENU_TARGETS.huruf;
  }
}

document.querySelectorAll("[data-menu-target]").forEach((link) => {
  link.addEventListener("click", () => {
    rememberLastVisited(link.getAttribute("data-menu-target"));
  });

  link.addEventListener("keydown", (event) => {
    if (event.key !== " ") return;
    event.preventDefault();
    link.click();
  });
});

const resumeBtn = document.getElementById("resumeBtn");

function syncResumeButton() {
  if (!resumeBtn) return;
  resumeBtn.setAttribute("href", getResumeTarget());
}

if (resumeBtn) {
  syncResumeButton();

  resumeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const target = getResumeTarget();
    rememberLastVisited(target);
    window.location.href = target;
  });

  resumeBtn.addEventListener("keydown", (event) => {
    if (event.key !== " ") return;
    event.preventDefault();
    resumeBtn.click();
  });
}

const bgm =
  window.bgm ||
  new Audio(
    "https://cdn.pixabay.com/download/audio/2025/03/30/audio_3d2ec07913.mp3?filename=spring-in-my-step-copyright-free-music-for-youtube-320726.mp3"
  );
window.bgm = bgm;
bgm.loop = true;

const musicBtn = document.getElementById("musicBtn");
const kurikulumBtn = document.getElementById("kurikulumBtn");
const kurikulumModal = document.getElementById("kurikulumModal");
const closeKurikulumBtn = document.getElementById("closeKurikulumBtn");

let audioNyala = (function () {
  try {
    if (typeof window !== "undefined" && window.__bgm_playing !== undefined) return !!window.__bgm_playing;
    return localStorage.getItem("bgmPlaying") === "1";
  } catch (error) {
    return false;
  }
})();

let modalLastFocus = null;

function syncMusicButton() {
  if (!musicBtn) return;
  musicBtn.textContent = bgm.paused ? "\uD83C\uDFB5" : "\uD83D\uDD0A";
}

function toggleAudio() {
  if (audioNyala) {
    bgm.pause();
  } else {
    bgm.play().catch(() => {});
  }
  audioNyala = !audioNyala;
  syncMusicButton();
}

function jatuhkanBintang() {
  for (let i = 0; i < 8; i += 1) {
    const bintang = document.createElement("div");
    bintang.classList.add("bintang");
    bintang.textContent = "\u2B50";
    bintang.style.left = `${Math.random() * 100}vw`;
    bintang.style.fontSize = `${20 + Math.random() * 20}px`;
    document.body.appendChild(bintang);

    setTimeout(() => bintang.remove(), 2000);
  }
}

function openKurikulumModal() {
  if (!kurikulumModal) return;
  modalLastFocus = document.activeElement;
  kurikulumModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  if (closeKurikulumBtn) {
    closeKurikulumBtn.focus();
  }
}

function closeKurikulumModal() {
  if (!kurikulumModal) return;
  kurikulumModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  if (modalLastFocus && typeof modalLastFocus.focus === "function") {
    modalLastFocus.focus();
  }
}

if (kurikulumBtn) {
  kurikulumBtn.addEventListener("click", openKurikulumModal);
}

if (closeKurikulumBtn) {
  closeKurikulumBtn.addEventListener("click", closeKurikulumModal);
}

if (kurikulumModal) {
  kurikulumModal.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute("data-close-modal")) {
      closeKurikulumModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && kurikulumModal && !kurikulumModal.classList.contains("hidden")) {
    closeKurikulumModal();
  }
});

window.addEventListener("storage", syncResumeButton);

syncMusicButton();
