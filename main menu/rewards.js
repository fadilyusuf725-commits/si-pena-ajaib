(function () {
  const STARS_KEY = "rewardStars";
  const BADGES_KEY = "badgesUnlocked";
  const CLAIMS_KEY = "rewardClaims";

  const BADGES = {
    "huruf-pemula": {
      id: "huruf-pemula",
      name: "Huruf Pemula",
      description: "Selesaikan 5 huruf di Hurufku.",
    },
    "penjelajah-kata": {
      id: "penjelajah-kata",
      name: "Penjelajah Kata",
      description: "Selesaikan 10 huruf di Kataku.",
    },
    "penyusun-cerita": {
      id: "penyusun-cerita",
      name: "Penyusun Cerita",
      description: "Tamatkan satu cerita penuh di Ceritaku.",
    },
    "abjad-master": {
      id: "abjad-master",
      name: "Abjad Master",
      description: "Selesaikan semua 26 huruf di Hurufku.",
    },
  };

  function safeGet(key, fallback) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch (error) {
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      /* noop */
    }
  }

  function readJson(key, fallback) {
    try {
      const value = safeGet(key, null);
      if (value === null) return fallback;
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function normalizeClaims(rawClaims) {
    if (!rawClaims || typeof rawClaims !== "object" || Array.isArray(rawClaims)) {
      return {};
    }
    return rawClaims;
  }

  function normalizeBadges(rawBadges) {
    if (!Array.isArray(rawBadges)) return [];
    return rawBadges.filter((badgeId, index) => typeof badgeId === "string" && rawBadges.indexOf(badgeId) === index);
  }

  function getClaims() {
    return normalizeClaims(readJson(CLAIMS_KEY, {}));
  }

  function setClaims(claims) {
    safeSet(CLAIMS_KEY, JSON.stringify(claims));
  }

  function getBadges() {
    return normalizeBadges(readJson(BADGES_KEY, []));
  }

  function setBadges(badges) {
    safeSet(BADGES_KEY, JSON.stringify(badges));
  }

  function getStars() {
    const parsed = Number.parseInt(safeGet(STARS_KEY, "0"), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function setStars(stars) {
    safeSet(STARS_KEY, String(Math.max(0, Math.floor(stars))));
  }

  function countClaimsByPrefix(claims, prefix) {
    return Object.keys(claims).filter((key) => key.startsWith(prefix)).length;
  }

  function countStoryClaims(claims, storyId) {
    return Object.keys(claims).filter((key) => key.startsWith(`cerita:${storyId}_`)).length;
  }

  function ensureBadge(badges, badgeId, unlockedNow) {
    if (!BADGES[badgeId] || badges.includes(badgeId)) return false;
    badges.push(badgeId);
    unlockedNow.push(badgeId);
    return true;
  }

  function refreshBadges(options) {
    const badges = [...getBadges()];
    const claims = getClaims();
    const unlockedNow = [];
    const hurufDone = countClaimsByPrefix(claims, "huruf:");
    const katakuDone = countClaimsByPrefix(claims, "kataku:");

    if (hurufDone >= 5) ensureBadge(badges, "huruf-pemula", unlockedNow);
    if (katakuDone >= 10) ensureBadge(badges, "penjelajah-kata", unlockedNow);
    if (hurufDone >= 26) ensureBadge(badges, "abjad-master", unlockedNow);

    if (options && options.storyId && options.storySceneTotal) {
      if (countStoryClaims(claims, options.storyId) >= options.storySceneTotal) {
        ensureBadge(badges, "penyusun-cerita", unlockedNow);
      }
    }

    setBadges(badges);
    return {
      badges,
      unlockedNow: unlockedNow.map((badgeId) => BADGES[badgeId]),
    };
  }

  function dispatchRewardChange(detail) {
    window.dispatchEvent(
      new CustomEvent("rewards:updated", {
        detail,
      })
    );
  }

  function grantOnce(claimKey, starValue, badgeContext) {
    const claims = getClaims();
    const alreadyClaimed = Object.prototype.hasOwnProperty.call(claims, claimKey);
    let stars = getStars();
    const newlyClaimed = !alreadyClaimed;

    if (newlyClaimed) {
      claims[claimKey] = Date.now();
      stars += starValue;
      setClaims(claims);
      setStars(stars);
    }

    const badgeResult = refreshBadges(badgeContext);
    const detail = {
      claimKey,
      granted: newlyClaimed,
      stars,
      badges: badgeResult.badges.map((badgeId) => BADGES[badgeId]).filter(Boolean),
      unlockedNow: badgeResult.unlockedNow,
    };

    dispatchRewardChange(detail);
    return detail;
  }

  function getSummary() {
    const claims = getClaims();
    const badges = getBadges();
    return {
      stars: getStars(),
      badges: badges.map((badgeId) => BADGES[badgeId]).filter(Boolean),
      hurufDone: countClaimsByPrefix(claims, "huruf:"),
      katakuDone: countClaimsByPrefix(claims, "kataku:"),
      ceritaDone: countClaimsByPrefix(claims, "cerita:"),
    };
  }

  function getNextGoals(summary) {
    const goals = [];
    if (!summary.badges.find((badge) => badge.id === "huruf-pemula")) {
      goals.push(`Huruf Pemula ${summary.hurufDone}/5`);
    }
    if (!summary.badges.find((badge) => badge.id === "penjelajah-kata")) {
      goals.push(`Penjelajah Kata ${summary.katakuDone}/10`);
    }
    if (!summary.badges.find((badge) => badge.id === "abjad-master")) {
      goals.push(`Abjad Master ${summary.hurufDone}/26`);
    }
    return goals;
  }

  function renderSummary() {
    const root = document.querySelector("[data-reward-summary]");
    if (!root) return;

    const starsEl = root.querySelector("[data-reward-stars]");
    const badgeListEl = root.querySelector("[data-reward-badges]");
    const messageEl = root.querySelector("[data-reward-message]");
    const summary = getSummary();
    const nextGoals = getNextGoals(summary);

    if (starsEl) {
      starsEl.textContent = `${summary.stars} bintang`;
    }

    if (badgeListEl) {
      badgeListEl.innerHTML = "";
      if (summary.badges.length === 0) {
        const empty = document.createElement("li");
        empty.className = "badge-empty";
        empty.textContent = "Belum ada badge. Terus latihan untuk membuka hadiah pertamamu.";
        badgeListEl.appendChild(empty);
      } else {
        summary.badges.forEach((badge) => {
          const item = document.createElement("li");
          item.className = "badge-chip";
          item.title = badge.description;
          item.textContent = badge.name;
          badgeListEl.appendChild(item);
        });
      }
    }

    if (messageEl) {
      if (nextGoals.length > 0) {
        messageEl.textContent = `Target berikutnya: ${nextGoals[0]}.`;
      } else {
        messageEl.textContent = "Semua badge utama sudah terbuka. Hebat!";
      }
    }
  }

  window.rewardSystem = {
    getSummary,
    renderSummary,
    grantLetterReward(letter) {
      return grantOnce(`huruf:${String(letter).toUpperCase()}`, 1);
    },
    grantKatakuReward(letter) {
      return grantOnce(`kataku:${String(letter).toUpperCase()}`, 1);
    },
    grantStorySceneReward(storyId, sceneIndex, totalScenes) {
      return grantOnce(`cerita:${storyId}_${sceneIndex}`, 2, {
        storyId,
        storySceneTotal: totalScenes,
      });
    },
  };

  window.addEventListener("storage", renderSummary);
  window.addEventListener("rewards:updated", renderSummary);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderSummary, { once: true });
  } else {
    renderSummary();
  }
})();
