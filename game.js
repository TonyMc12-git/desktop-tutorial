const dictionaryTier = "50";
const minPuzzleWordCount = 18;
const maxPuzzleWordCount = 50;

const sourceConfig = {
  "35": {
    path: "data/scowl-british-oxford-size35-common-forms.txt?v=20260412-britishb",
    label: "SCOWL British Oxford size 35, filtered common forms"
  },
  "50": {
    path: "data/preserved/size50-filtered-4to9-v2.txt?v=20260412-britishb",
    label: "SCOWL British Oxford size 50, preserved filtered 4-9 list"
  }
};

let currentPuzzle = {
  title: "BIOGRAPHY",
  center: "A",
  letters: ["B", "I", "O", "G", "A", "P", "R", "H", "Y"],
  sourcePath: sourceConfig[dictionaryTier].path,
  sourceLabel: sourceConfig[dictionaryTier].label
};

const seenPuzzleStorageKey = `nine-letters:seen-puzzles:size${dictionaryTier}-preserved-v2`;

let sourceWordsCache = [];
let letterInventory = buildLetterInventory(currentPuzzle.letters);
let allowedLetters = new Set(Object.keys(letterInventory));

const heroCard = document.querySelector(".hero-card");
const playCard = document.querySelector(".play-card");
const progressCopyEl = document.getElementById("progress-copy");
const progressFillEl = document.getElementById("progress-fill");
const progressMarkersEl = document.getElementById("progress-markers");
const letterGridEl = document.getElementById("letter-grid");
const acceptedWordsEl = document.getElementById("accepted-words");
const statusLineEl = document.getElementById("status-line");
const celebrationBannerEl = document.getElementById("celebration-banner");
const acceptedToastEl = document.getElementById("accepted-toast");
const currentWordEl = document.getElementById("current-word");
const clearButtonEl = document.getElementById("clear-button");
const submitButtonEl = document.getElementById("submit-button");
const giveUpButtonEl = document.getElementById("give-up-button");
const newGameButtonEl = document.getElementById("new-game-button");
const feedbackModalEl = document.getElementById("feedback-modal");
const feedbackArtEl = document.getElementById("feedback-art");
const feedbackTitleEl = document.getElementById("feedback-title");
const feedbackCopyEl = document.getElementById("feedback-copy");
const feedbackCloseEl = document.getElementById("feedback-close");
const confirmModalEl = document.getElementById("confirm-modal");
const confirmCancelButtonEl = document.getElementById("confirm-cancel-button");
const confirmGiveUpButtonEl = document.getElementById("confirm-give-up-button");

const state = {
  acceptedWords: [],
  acceptedSet: new Set(),
  foundWords: [],
  missedWords: [],
  missedSet: new Set(),
  milestones: [],
  isReady: false,
  celebrationQueue: [],
  isCelebrationActive: false,
  currentGuess: "",
  selectedTileIds: [],
  isRevealed: false,
  displayedLetters: buildShuffledBoardLetters(currentPuzzle.letters)
};

render();
registerServiceWorker();
init();

submitButtonEl.addEventListener("click", submitWord);
clearButtonEl.addEventListener("click", () => {
  state.currentGuess = "";
  state.selectedTileIds = [];
  renderCurrentGuess();
  syncLetterButtonsFromGuess();
  setStatus("");
});
giveUpButtonEl.addEventListener("click", openGiveUpConfirm);
newGameButtonEl.addEventListener("click", startNewGame);
feedbackCloseEl.addEventListener("click", hideFeedback);
feedbackModalEl.addEventListener("click", (event) => {
  if (event.target === feedbackModalEl) {
    hideFeedback();
  }
});
confirmCancelButtonEl.addEventListener("click", closeGiveUpConfirm);
confirmGiveUpButtonEl.addEventListener("click", revealAllWords);
confirmModalEl.addEventListener("click", (event) => {
  if (event.target === confirmModalEl) {
    closeGiveUpConfirm();
  }
});

async function init() {
  try {
    const response = await fetch(currentPuzzle.sourcePath);
    if (!response.ok) {
      throw new Error(`Unable to load source list (${response.status})`);
    }

    sourceWordsCache = (await response.text())
      .split(/\r?\n/)
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean);
    const nextPuzzle = findNextUnseenPuzzle();
    if (!nextPuzzle) {
      throw new Error("Could not find a valid puzzle to load.");
    }
    startPuzzle(nextPuzzle, { resetProgress: true });
  } catch (error) {
    setStatus(`Could not load the source word list. ${error.message}`);
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

function render() {
  renderLetters(state.displayedLetters);
  renderMilestones();
  renderAcceptedWords();
  updateStats();
  renderCurrentGuess();
  syncLetterButtonsFromGuess();
  renderActionButtons();
}

function submitWord() {
  const rawWord = state.currentGuess.trim().toLowerCase();
  const verdict = validateWord(rawWord);

  if (!verdict.ok) {
    setStatus(verdict.message);
    state.currentGuess = "";
    state.selectedTileIds = [];
    renderCurrentGuess();
    syncLetterButtonsFromGuess();
    handleRejectedWord(rawWord, verdict);
    return;
  }

  state.foundWords.push(rawWord);
  saveWords();
  state.currentGuess = "";
  state.selectedTileIds = [];
  renderCurrentGuess();
  syncLetterButtonsFromGuess();
  setStatus("");
  showAcceptedToast(rawWord);
  renderAcceptedWords();
  updateStats();
  celebrateFoundWord(rawWord);
  unlockMilestones();
}

function validateWord(word) {
  if (!state.isReady) {
    return { ok: false, message: "The source dictionary is still loading." };
  }

  if (state.isRevealed) {
    return { ok: false, message: "This game has ended. Tap New game for a fresh board." };
  }

  if (!word) {
    return { ok: false, message: "Type a word before you submit." };
  }

  if (!/^[a-z]+$/.test(word)) {
    return { ok: false, message: "Use letters only for this puzzle." };
  }

  if (word.length < 4) {
    return { ok: false, message: "Words need to be at least four letters long." };
  }

  if (!word.includes(currentPuzzle.center.toLowerCase())) {
    return { ok: false, message: `Every word must include ${currentPuzzle.center}.` };
  }

  if (!canBuildWord(word, letterInventory)) {
    return { ok: false, code: "overuse", message: "That word uses a letter more times than the board allows." };
  }

  if (state.foundWords.includes(word)) {
    return { ok: false, code: "duplicate-good", message: "You already found that one." };
  }

  if (!state.acceptedSet.has(word)) {
    return { ok: false, code: "missing", message: "That word is not in this puzzle's source list." };
  }

  return { ok: true };
}

function renderLetters(letters) {
  letterGridEl.innerHTML = "";

  letters.forEach((letter, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "letter-tile";
    tile.textContent = letter;
    tile.dataset.letter = letter.toLowerCase();
    tile.dataset.tileId = String(index);

    if (index === 4) {
      tile.classList.add("center");
    }

    tile.addEventListener("pointerdown", (event) => {
      event.preventDefault();
    });

    tile.addEventListener("click", () => {
      if (state.isRevealed) {
        setStatus("This game has ended. Tap New game for a fresh board.");
        return;
      }

      if (state.selectedTileIds.includes(index)) {
        setStatus(`You already used that ${letter} tile.`);
        return;
      }

      const nextValue = `${state.currentGuess}${letter}`.toUpperCase();
      if (!canBuildWord(nextValue.toLowerCase(), letterInventory)) {
        setStatus(`You only have one ${letter} tile to use.`);
        return;
      }

      state.selectedTileIds.push(index);
      state.currentGuess = nextValue;
      renderCurrentGuess();
      syncLetterButtonsFromGuess();
    });

    letterGridEl.appendChild(tile);
  });
}

function renderMilestones() {
  progressMarkersEl.innerHTML = "";

  if (state.milestones.length === 0) {
    return;
  }

  state.milestones.slice(0, 3).forEach((milestone, index) => {
    const marker = document.createElement("span");
    const unlocked = state.foundWords.length >= milestone.target;
    const tones = ["bronze", "silver", "gold"];

    marker.className = `progress-marker tone-${tones[index]}${unlocked ? " unlocked" : ""}`;
    marker.style.left = `${(milestone.target / state.acceptedWords.length) * 100}%`;
    marker.title = milestone.label;
    progressMarkersEl.appendChild(marker);
  });
}

function renderAcceptedWords() {
  acceptedWordsEl.innerHTML = "";

  if (!state.isRevealed && state.foundWords.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = state.isReady ? "No words found yet." : "Loading the source list...";
    acceptedWordsEl.appendChild(empty);
    return;
  }

  const wordsToRender = state.isRevealed ? state.acceptedWords : state.foundWords;

  wordsToRender
    .slice()
    .sort((left, right) => left.localeCompare(right))
    .forEach((word) => {
      const pill = document.createElement("div");
      const isMissed = state.isRevealed && !state.foundWords.includes(word);
      pill.className = `word-pill${isMissed ? " missed" : ""}`;
      pill.textContent = word.toUpperCase();
      acceptedWordsEl.appendChild(pill);
    });
}

function updateStats() {
  const foundCount = state.foundWords.length;
  const totalCount = state.acceptedWords.length;
  progressCopyEl.textContent = totalCount ? `${foundCount} / ${totalCount}` : "Loading...";
  progressFillEl.style.width = totalCount ? `${(foundCount / totalCount) * 100}%` : "0";

  if (totalCount > 0 && foundCount === totalCount) {
    heroCard.classList.add("victory");
    playCard.classList.add("victory");
  } else {
    heroCard.classList.remove("victory");
    playCard.classList.remove("victory");
  }
}

function renderActionButtons() {
  const disabled = !state.isReady || state.isRevealed;
  clearButtonEl.disabled = disabled || !state.currentGuess;
  submitButtonEl.disabled = disabled || !state.currentGuess;
  giveUpButtonEl.disabled = disabled;
}

function unlockMilestones() {
  const milestone = state.milestones.find((entry) => state.foundWords.length === entry.target);

  if (!milestone) {
    return;
  }

  queueCelebration(milestone.celebration);
  renderMilestones();
}

function celebrateFoundWord(word) {
  if (word.length !== currentPuzzle.letters.length) {
    return;
  }

  queueCelebration({
    tone: "pangram",
    kicker: "Full Board Bonus",
    title: "Nine-Letter Word!",
    message: `${word.toUpperCase()} uses the whole board.`
  });
}

function queueCelebration(celebration) {
  state.celebrationQueue.push(celebration);
  if (!state.isCelebrationActive) {
    showNextCelebration();
  }
}

function showNextCelebration() {
  const celebration = state.celebrationQueue.shift();

  if (!celebration) {
    state.isCelebrationActive = false;
    return;
  }

  state.isCelebrationActive = true;
  const fireworksMarkup = celebration.tone === "final"
    ? `
      <div class="celebration-sky" aria-hidden="true">
        <span class="burst burst-left burst-a"></span>
        <span class="burst burst-left burst-b"></span>
        <span class="burst burst-right burst-a"></span>
        <span class="burst burst-right burst-b"></span>
        <span class="spark spark-1"></span>
        <span class="spark spark-2"></span>
        <span class="spark spark-3"></span>
        <span class="spark spark-4"></span>
        <span class="spark spark-5"></span>
        <span class="spark spark-6"></span>
      </div>
      <div class="celebration-confetti" aria-hidden="true">
        <span class="confetti confetti-1"></span>
        <span class="confetti confetti-2"></span>
        <span class="confetti confetti-3"></span>
        <span class="confetti confetti-4"></span>
        <span class="confetti confetti-5"></span>
        <span class="confetti confetti-6"></span>
        <span class="confetti confetti-7"></span>
        <span class="confetti confetti-8"></span>
        <span class="confetti confetti-9"></span>
        <span class="confetti confetti-10"></span>
      </div>
    `
    : "";
  celebrationBannerEl.innerHTML = `
    ${fireworksMarkup}
    <span class="celebration-kicker">${celebration.kicker || ""}</span>
    <strong class="celebration-title">${celebration.title}</strong>
    <span class="celebration-message">${celebration.message}</span>
  `;
  celebrationBannerEl.className = `celebration-banner show tone-${celebration.tone}`;

  window.clearTimeout(showNextCelebration.timeoutId);
  showNextCelebration.timeoutId = window.setTimeout(() => {
    celebrationBannerEl.classList.remove("show");

    window.setTimeout(() => {
      state.isCelebrationActive = false;
      showNextCelebration();
    }, 260);
  }, celebration.duration || 2600);
}

function buildAcceptedWords(sourceWords, puzzleConfig = currentPuzzle) {
  const center = puzzleConfig.center.toLowerCase();
  const maxLength = puzzleConfig.letters.length;
  const inventory = buildLetterInventory(puzzleConfig.letters);
  const allowed = new Set(Object.keys(inventory));

  return sourceWords.filter((word) => {
    return word.length >= 4
      && word.length <= maxLength
      && word.includes(center)
      && canBuildWord(word, inventory, allowed);
  });
}

function buildMilestones(total) {
  const targets = [
    Math.max(1, Math.floor(total * 0.25)),
    Math.max(1, Math.floor(total * 0.5)),
    Math.max(1, Math.floor(total * 0.75)),
    total
  ];

  return targets.map((target, index) => {
    const labels = ["Bronze Spark", "Silver Surge", "Golden Streak", "Perfect Finish"];
    const descriptions = [
      `${target} words found`,
      `${target} words found`,
      `${target} words found`,
      `All ${total} words found`
    ];
    const celebrations = [
      {
        tone: "bronze",
        kicker: "Bronze Spark",
        title: `${target} Words Found`,
        message: "The board is warming up.",
        duration: 2200
      },
      {
        tone: "silver",
        kicker: "Silver Surge",
        title: `${target} Words Found`,
        message: "You are in a real groove now.",
        duration: 2600
      },
      {
        tone: "gold",
        kicker: "Golden Streak",
        title: `${target} Words Found`,
        message: "This is turning into a sweep.",
        duration: 3200
      },
      {
        tone: "final",
        kicker: "Perfect Finish",
        title: "Puzzle Complete",
        message: "Every accepted word is yours.",
        duration: 4200
      }
    ];

    return {
      target,
      label: labels[index],
      description: descriptions[index],
      celebration: celebrations[index]
    };
  });
}

function renderCurrentGuess() {
  currentWordEl.textContent = state.currentGuess;
  renderActionButtons();
}

function syncLetterButtonsFromGuess() {
  const buttons = [...letterGridEl.querySelectorAll(".letter-tile")];
  const selectedIds = new Set(state.selectedTileIds.map(String));

  buttons.forEach((button) => {
    const isSelected = selectedIds.has(button.dataset.tileId);
    button.disabled = isSelected;
    button.classList.toggle("used", isSelected);
  });
}

function canBuildWord(word, inventory, allowed = allowedLetters) {
  const counts = {};

  for (const character of word) {
    if (!allowed.has(character)) {
      return false;
    }

    counts[character] = (counts[character] || 0) + 1;
    if (counts[character] > inventory[character]) {
      return false;
    }
  }

  return true;
}

function buildLetterInventory(letters) {
  return letters.reduce((inventory, letter) => {
    const key = letter.toLowerCase();
    inventory[key] = (inventory[key] || 0) + 1;
    return inventory;
  }, {});
}

function loadSavedWords(acceptedSet) {
  return loadSavedWordsForKey(acceptedSet, getStorageKey());
}

function loadSavedWordsForKey(acceptedSet, key) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) || "[]");
    if (acceptedSet.size === 0) {
      return [...new Set(saved.filter((word) => /^[a-z]+$/.test(word)))];
    }
    return [...new Set(saved.filter((word) => acceptedSet.has(word)))];
  } catch {
    return [];
  }
}

function saveWords() {
  window.localStorage.setItem(getStorageKey(), JSON.stringify(state.foundWords));
}

function saveMissedWords() {
  window.localStorage.setItem(getMissStorageKey(), JSON.stringify(state.missedWords));
}

function handleRejectedWord(word, verdict) {
  if (!word) {
    return;
  }

  if (verdict.code === "duplicate-good") {
    showFeedback("fish", "Dory Check-In", "You already found that one.");
    return;
  }

  if (verdict.code === "missing" && state.missedSet.has(word)) {
    showFeedback("clown", "", "Lol you keep trying that same word - still no 😂");
    return;
  }

  if (verdict.code === "missing") {
    state.missedSet.add(word);
    state.missedWords.push(word);
    saveMissedWords();
  }

  showFeedback("duck", "Nope", verdict.message);
}

function showFeedback(theme, title, copy) {
  setStatus("");
  feedbackModalEl.className = `feedback-modal show theme-${theme}`;
  feedbackModalEl.setAttribute("aria-hidden", "false");
  feedbackArtEl.innerHTML = buildFeedbackArt(theme);
  feedbackTitleEl.textContent = title;
  feedbackCopyEl.textContent = copy;

  if (theme === "duck") {
    playDuckQuack();
  }
}

function buildFeedbackArt(theme) {
  if (theme === "fish") {
    return `
      <svg class="character-fish" viewBox="0 0 220 120" aria-hidden="true">
        <defs>
          <linearGradient id="fishBody" x1="0" x2="1">
            <stop offset="0%" stop-color="#47b7f1"></stop>
            <stop offset="100%" stop-color="#1d67b0"></stop>
          </linearGradient>
        </defs>
        <path d="M40 61C40 36 61 22 99 22C135 22 163 36 178 60C163 84 135 98 99 98C61 98 40 84 40 61Z" fill="url(#fishBody)"></path>
        <path d="M168 60L207 35V85L168 60Z" fill="#ffd44e"></path>
        <path d="M65 26C74 14 88 11 103 18L94 33C82 28 74 30 65 26Z" fill="#1a4d92"></path>
        <path d="M99 24C113 27 125 35 133 47L121 54C113 43 103 36 89 32Z" fill="#163f7d" opacity="0.9"></path>
        <ellipse cx="95" cy="61" rx="45" ry="34" fill="none" stroke="#113f78" stroke-opacity="0.2" stroke-width="4"></ellipse>
        <path d="M67 40C71 31 79 29 88 33L83 45C76 42 71 42 67 40Z" fill="#ffd44e"></path>
        <path d="M151 41C155 33 162 31 169 35L162 46C157 43 154 42 151 41Z" fill="#ffd44e"></path>
        <circle cx="84" cy="56" r="10" fill="#fff"></circle>
        <circle cx="108" cy="58" r="9" fill="#fff"></circle>
        <circle cx="86" cy="57" r="4.5" fill="#102132"></circle>
        <circle cx="109" cy="59" r="4" fill="#102132"></circle>
        <path d="M85 76C92 81 103 80 109 72" fill="none" stroke="#0f3c73" stroke-width="4" stroke-linecap="round"></path>
      </svg>
    `;
  }

  const art = {
    duck: "🦆",
    clown: "🤡"
  };

  return `<span class="feedback-emoji">${art[theme] || "🙂"}</span>`;
}

function hideFeedback() {
  feedbackModalEl.classList.remove("show");
  feedbackModalEl.setAttribute("aria-hidden", "true");
}

function playDuckQuack() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  const master = ctx.createGain();

  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(0.55, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
  master.connect(ctx.destination);

  const quackTimes = [now, now + 0.16];
  quackTimes.forEach((startTime, index) => {
    createDuckBurst(ctx, master, startTime, index === 0 ? 1 : 0.82);
  });

  window.setTimeout(() => {
    ctx.close().catch(() => {});
  }, 900);
}

function createDuckBurst(ctx, destination, startTime, intensity) {
  const duration = 0.2;
  const bodyFilter = ctx.createBiquadFilter();
  const nasalFilter = ctx.createBiquadFilter();
  const bodyGain = ctx.createGain();
  const nasalGain = ctx.createGain();
  const oscLow = ctx.createOscillator();
  const oscHigh = ctx.createOscillator();
  const noiseSource = createNoiseSource(ctx, duration + 0.06);
  const noiseFilter = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();

  bodyFilter.type = "bandpass";
  bodyFilter.frequency.setValueAtTime(760, startTime);
  bodyFilter.Q.setValueAtTime(2.1, startTime);

  nasalFilter.type = "bandpass";
  nasalFilter.frequency.setValueAtTime(1320, startTime);
  nasalFilter.Q.setValueAtTime(3.4, startTime);

  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(1080, startTime);
  noiseFilter.Q.setValueAtTime(1.2, startTime);

  oscLow.type = "sawtooth";
  oscLow.frequency.setValueAtTime(620, startTime);
  oscLow.frequency.exponentialRampToValueAtTime(360, startTime + duration);

  oscHigh.type = "square";
  oscHigh.frequency.setValueAtTime(1180, startTime);
  oscHigh.frequency.exponentialRampToValueAtTime(720, startTime + duration * 0.9);

  bodyGain.gain.setValueAtTime(0.0001, startTime);
  bodyGain.gain.linearRampToValueAtTime(0.18 * intensity, startTime + 0.012);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  nasalGain.gain.setValueAtTime(0.0001, startTime);
  nasalGain.gain.linearRampToValueAtTime(0.1 * intensity, startTime + 0.009);
  nasalGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.88);

  noiseGain.gain.setValueAtTime(0.0001, startTime);
  noiseGain.gain.linearRampToValueAtTime(0.065 * intensity, startTime + 0.01);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.82);

  oscLow.connect(bodyFilter);
  bodyFilter.connect(bodyGain);
  bodyGain.connect(destination);

  oscHigh.connect(nasalFilter);
  nasalFilter.connect(nasalGain);
  nasalGain.connect(destination);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(destination);

  oscLow.start(startTime);
  oscHigh.start(startTime);
  noiseSource.start(startTime);

  oscLow.stop(startTime + duration + 0.03);
  oscHigh.stop(startTime + duration + 0.03);
  noiseSource.stop(startTime + duration + 0.06);
}

function createNoiseSource(ctx, duration) {
  const frameCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    channel[index] = (Math.random() * 2 - 1) * 0.7;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
}

function setStatus(message) {
  statusLineEl.textContent = message;
}

function showAcceptedToast(word) {
  acceptedToastEl.textContent = `${word.toUpperCase()} accepted`;
  acceptedToastEl.classList.add("show");
  window.clearTimeout(showAcceptedToast.timeoutId);
  showAcceptedToast.timeoutId = window.setTimeout(() => {
    acceptedToastEl.classList.remove("show");
  }, 1350);
}

function getStorageKey() {
  return `nine-letters:${getPuzzleKey(currentPuzzle)}:scowl-british-oxford-size${dictionaryTier}-preserved-v2`;
}

function getMissStorageKey() {
  return `${getStorageKey()}:misses`;
}

function startPuzzle(puzzleConfig, { resetProgress = true } = {}) {
  currentPuzzle = puzzleConfig;
  letterInventory = buildLetterInventory(currentPuzzle.letters);
  allowedLetters = new Set(Object.keys(letterInventory));
  state.acceptedWords = buildAcceptedWords(sourceWordsCache, currentPuzzle);

  if (
    state.acceptedWords.length < minPuzzleWordCount
    || state.acceptedWords.length > maxPuzzleWordCount
  ) {
    throw new Error(
      `Puzzle must have between ${minPuzzleWordCount} and ${maxPuzzleWordCount} accepted words; this one has ${state.acceptedWords.length}.`
    );
  }

  state.acceptedSet = new Set(state.acceptedWords);
  state.milestones = buildMilestones(state.acceptedWords.length);
  state.foundWords = resetProgress ? [] : loadSavedWords(state.acceptedSet);
  state.missedWords = resetProgress ? [] : loadSavedWordsForKey(new Set(), getMissStorageKey());
  state.missedSet = new Set(state.missedWords);
  state.currentGuess = "";
  state.selectedTileIds = [];
  state.isRevealed = false;
  state.displayedLetters = buildShuffledBoardLetters(currentPuzzle.letters);
  state.isReady = true;
  state.celebrationQueue = [];
  state.isCelebrationActive = false;
  rememberSeenPuzzle(currentPuzzle);

  celebrationBannerEl.className = "celebration-banner";
  render();
  setStatus("");
}

function openGiveUpConfirm() {
  if (!state.isReady || state.isRevealed) {
    return;
  }

  confirmModalEl.classList.add("show");
  confirmModalEl.setAttribute("aria-hidden", "false");
}

function closeGiveUpConfirm() {
  confirmModalEl.classList.remove("show");
  confirmModalEl.setAttribute("aria-hidden", "true");
}

function revealAllWords() {
  closeGiveUpConfirm();
  state.currentGuess = "";
  state.selectedTileIds = [];
  state.isRevealed = true;
  renderCurrentGuess();
  syncLetterButtonsFromGuess();
  renderAcceptedWords();
  updateStats();
  setStatus("Game ended. Missed words are now shown in red.");
}

function startNewGame() {
  if (!state.isReady || sourceWordsCache.length === 0) {
    return;
  }

  const nextPuzzle = findNextUnseenPuzzle(currentPuzzle);
  if (!nextPuzzle) {
    setStatus("You have already seen every available puzzle in this cycle.");
    return;
  }

  window.localStorage.removeItem(`nine-letters:${getPuzzleKey(nextPuzzle)}:scowl-british-oxford-size${dictionaryTier}-preserved-v2`);
  window.localStorage.removeItem(`nine-letters:${getPuzzleKey(nextPuzzle)}:scowl-british-oxford-size${dictionaryTier}-preserved-v2:misses`);
  startPuzzle(nextPuzzle, { resetProgress: true });
}

function pickRandomPuzzle(excludePuzzleKey, excludedPuzzleKeys = new Set()) {
  const candidates = sourceWordsCache.filter((word) => word.length === 9);
  const startIndex = Math.floor(Math.random() * Math.max(candidates.length, 1));

  for (let offset = 0; offset < candidates.length; offset += 1) {
    const candidateWord = candidates[(startIndex + offset) % candidates.length];

    const centers = [...new Set(candidateWord.toUpperCase().split(""))];
    for (const center of shuffleList(centers)) {
      const puzzleConfig = createPuzzle(candidateWord, center);
      const puzzleKey = getPuzzleKey(puzzleConfig);

      if (puzzleKey === excludePuzzleKey || excludedPuzzleKeys.has(puzzleKey)) {
        continue;
      }

      const acceptedWords = buildAcceptedWords(sourceWordsCache, puzzleConfig);

      if (
        acceptedWords.length >= minPuzzleWordCount
        && acceptedWords.length <= maxPuzzleWordCount
      ) {
        return puzzleConfig;
      }
    }
  }

  return null;
}

function findNextUnseenPuzzle(excludedPuzzle = null) {
  const seenPuzzleKeys = getSeenPuzzleKeys();
  const excludePuzzleKey = excludedPuzzle ? getPuzzleKey(excludedPuzzle) : null;
  let nextPuzzle = pickRandomPuzzle(excludePuzzleKey, seenPuzzleKeys);

  if (nextPuzzle) {
    return nextPuzzle;
  }

  if (seenPuzzleKeys.size > 0) {
    window.localStorage.removeItem(seenPuzzleStorageKey);
    nextPuzzle = pickRandomPuzzle(excludePuzzleKey, new Set());
  }

  return nextPuzzle;
}

function createPuzzle(word, center) {
  return {
    title: word.toUpperCase(),
    center: center.toUpperCase(),
    letters: word.toUpperCase().split(""),
    sourcePath: sourceConfig[dictionaryTier].path,
    sourceLabel: sourceConfig[dictionaryTier].label
  };
}

function shuffleList(items) {
  const copy = items.slice();

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function getPuzzleKey(puzzleConfig) {
  return `${puzzleConfig.title}:${puzzleConfig.center}`;
}

function getSeenPuzzleKeys() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(seenPuzzleStorageKey) || "[]");
    return new Set(saved.filter((entry) => typeof entry === "string" && entry.includes(":")));
  } catch {
    return new Set();
  }
}

function rememberSeenPuzzle(puzzleConfig) {
  const seenPuzzleKeys = getSeenPuzzleKeys();
  seenPuzzleKeys.add(getPuzzleKey(puzzleConfig));
  window.localStorage.setItem(seenPuzzleStorageKey, JSON.stringify([...seenPuzzleKeys]));
}

function buildShuffledBoardLetters(baseLetters) {
  const outer = buildOuterLetters(baseLetters, currentPuzzle.center);
  const originalOuter = outer.slice();
  let bestOuter = outer.slice();
  let bestMovedCount = -1;

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const candidate = shuffleList(outer);
    const movedCount = countMovedLetters(originalOuter, candidate);

    if (movedCount > bestMovedCount) {
      bestOuter = candidate.slice();
      bestMovedCount = movedCount;
    }

    if (movedCount >= 6 && !matchesEdgeRun(originalOuter, candidate)) {
      bestOuter = candidate.slice();
      break;
    }
  }

  return [
    bestOuter[0],
    bestOuter[1],
    bestOuter[2],
    bestOuter[3],
    currentPuzzle.center,
    bestOuter[4],
    bestOuter[5],
    bestOuter[6],
    bestOuter[7]
  ];
}

function buildOuterLetters(baseLetters, centerLetter) {
  const remaining = baseLetters.slice();
  const centerIndex = remaining.findIndex((letter) => letter === centerLetter);

  if (centerIndex >= 0) {
    remaining.splice(centerIndex, 1);
  }

  return remaining;
}

function countMovedLetters(originalOuter, candidateOuter) {
  let movedCount = 0;

  for (let index = 0; index < originalOuter.length; index += 1) {
    if (originalOuter[index] !== candidateOuter[index]) {
      movedCount += 1;
    }
  }

  return movedCount;
}

function matchesEdgeRun(originalOuter, candidateOuter) {
  const runs = [
    [0, 1, 2],
    [5, 6, 7],
    [0, 3, 5],
    [2, 4, 7]
  ];

  return runs.some((run) => {
    return run.every((index) => originalOuter[index] === candidateOuter[index]);
  });
}
