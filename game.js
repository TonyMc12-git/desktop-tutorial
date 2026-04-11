const dictionaryTier = "50";
const minPuzzleWordCount = 18;
const maxPuzzleWordCount = 50;

const sourceConfig = {
  "35": {
    path: "data/scowl-british-oxford-size35-common-forms.txt",
    label: "SCOWL British Oxford size 35, filtered common forms"
  },
  "50": {
    path: "data/scowl-british-oxford-size50-common-forms.txt",
    label: "SCOWL British Oxford size 50, filtered common forms"
  }
};

const puzzle = {
  title: "BLUEPRINT",
  center: "B",
  letters: ["L", "U", "E", "P", "B", "R", "I", "N", "T"],
  sourcePath: sourceConfig[dictionaryTier].path,
  sourceLabel: sourceConfig[dictionaryTier].label
};

const letterInventory = buildLetterInventory(puzzle.letters);
const allowedLetters = new Set(Object.keys(letterInventory));
const storageKey = `nine-letters:${puzzle.title}:scowl-british-oxford-size${dictionaryTier}-common-forms-v1`;

const heroCard = document.querySelector(".hero-card");
const playCard = document.querySelector(".play-card");
const totalWordsEl = document.getElementById("total-words");
const foundCountEl = document.getElementById("found-count");
const longestWordEl = document.getElementById("longest-word");
const progressCopyEl = document.getElementById("progress-copy");
const progressFillEl = document.getElementById("progress-fill");
const letterGridEl = document.getElementById("letter-grid");
const milestoneGridEl = document.getElementById("milestone-grid");
const acceptedWordsEl = document.getElementById("accepted-words");
const statusLineEl = document.getElementById("status-line");
const celebrationBannerEl = document.getElementById("celebration-banner");
const inputEl = document.getElementById("word-input");
const clearButtonEl = document.getElementById("clear-button");
const submitButtonEl = document.getElementById("submit-button");
const shuffleButtonEl = document.getElementById("shuffle-button");

const state = {
  acceptedWords: [],
  acceptedSet: new Set(),
  foundWords: [],
  milestones: [],
  isReady: false,
  celebrationQueue: [],
  isCelebrationActive: false
};

render();
init();

submitButtonEl.addEventListener("click", submitWord);
clearButtonEl.addEventListener("click", () => {
  inputEl.value = "";
  syncLetterButtonsFromInput();
  setStatus("Input cleared. Try another word.");
});
shuffleButtonEl.addEventListener("click", shuffleOuterLetters);
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitWord();
  }
});
inputEl.addEventListener("input", () => {
  const sanitized = sanitizeWordInput(inputEl.value);
  if (inputEl.value !== sanitized.toUpperCase()) {
    inputEl.value = sanitized.toUpperCase();
  }
  syncLetterButtonsFromInput();
});

async function init() {
  try {
    const response = await fetch(puzzle.sourcePath);
    if (!response.ok) {
      throw new Error(`Unable to load source list (${response.status})`);
    }

    const sourceWords = (await response.text())
      .split(/\r?\n/)
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean);

    state.acceptedWords = buildAcceptedWords(sourceWords);
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
    state.foundWords = loadSavedWords(state.acceptedSet);
    state.isReady = true;

    renderMilestones();
    renderAcceptedWords();
    updateStats();
    setStatus(`Loaded ${state.acceptedWords.length} valid words from ${puzzle.sourceLabel}.`);
  } catch (error) {
    setStatus(`Could not load the source word list. ${error.message}`);
  }
}

function render() {
  renderLetters(puzzle.letters);
  renderMilestones();
  renderAcceptedWords();
  updateStats();
  syncLetterButtonsFromInput();
}

function submitWord() {
  const rawWord = inputEl.value.trim().toLowerCase();
  const verdict = validateWord(rawWord);

  if (!verdict.ok) {
    setStatus(verdict.message);
    return;
  }

  state.foundWords.push(rawWord);
  saveWords();
  inputEl.value = "";
  syncLetterButtonsFromInput();
  setStatus(`Accepted: ${rawWord.toUpperCase()}`);
  renderAcceptedWords();
  updateStats();
  celebrateFoundWord(rawWord);
  unlockMilestones();
}

function validateWord(word) {
  if (!state.isReady) {
    return { ok: false, message: "The source dictionary is still loading." };
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

  if (!word.includes(puzzle.center.toLowerCase())) {
    return { ok: false, message: `Every word must include ${puzzle.center}.` };
  }

  if (!canBuildWord(word, letterInventory)) {
    return { ok: false, message: "That word uses a letter more times than the board allows." };
  }

  if (state.foundWords.includes(word)) {
    return { ok: false, message: "You already found that one." };
  }

  if (!state.acceptedSet.has(word)) {
    return { ok: false, message: "That word is not in this puzzle's source list." };
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

    if (index === 4) {
      tile.classList.add("center");
    }

    tile.addEventListener("pointerdown", (event) => {
      event.preventDefault();
    });

    tile.addEventListener("click", () => {
      const nextValue = sanitizeWordInput(`${inputEl.value}${letter}`);
      if (nextValue.length === inputEl.value.length) {
        setStatus(`You only have one ${letter} tile to use.`);
        return;
      }
      inputEl.value = nextValue.toUpperCase();
      syncLetterButtonsFromInput();
    });

    letterGridEl.appendChild(tile);
  });
}

function renderMilestones() {
  milestoneGridEl.innerHTML = "";

  if (state.milestones.length === 0) {
    const card = document.createElement("article");
    card.className = "milestone-card";
    card.innerHTML = `
      <strong>Loading source</strong>
      <span>Milestones appear once the fixed word list is ready.</span>
    `;
    milestoneGridEl.appendChild(card);
    return;
  }

  state.milestones.forEach((milestone) => {
    const card = document.createElement("article");
    const unlocked = state.foundWords.length >= milestone.target;

    card.className = `milestone-card${unlocked ? " unlocked" : ""}`;
    card.innerHTML = `
      <strong>${milestone.label}</strong>
      <span>${milestone.description}</span>
    `;

    milestoneGridEl.appendChild(card);
  });
}

function renderAcceptedWords() {
  acceptedWordsEl.innerHTML = "";

  if (state.foundWords.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = state.isReady ? "No words found yet." : "Loading the source list...";
    acceptedWordsEl.appendChild(empty);
    return;
  }

  state.foundWords
    .slice()
    .sort((left, right) => right.length - left.length || left.localeCompare(right))
    .forEach((word) => {
      const pill = document.createElement("div");
      pill.className = "word-pill";
      pill.textContent = word.toUpperCase();
      acceptedWordsEl.appendChild(pill);
    });
}

function updateStats() {
  const foundCount = state.foundWords.length;
  const totalCount = state.acceptedWords.length;
  const longest = state.foundWords.slice().sort((left, right) => right.length - left.length)[0];

  totalWordsEl.textContent = totalCount || "...";
  foundCountEl.textContent = foundCount;
  longestWordEl.textContent = longest ? longest.toUpperCase() : "-";
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

function unlockMilestones() {
  const milestone = state.milestones.find((entry) => state.foundWords.length === entry.target);

  if (!milestone) {
    return;
  }

  queueCelebration(milestone.celebration);
  renderMilestones();
}

function celebrateFoundWord(word) {
  if (word.length !== puzzle.letters.length) {
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
  celebrationBannerEl.innerHTML = `
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

function shuffleOuterLetters() {
  const outer = puzzle.letters.filter((_, index) => index !== 4);

  for (let index = outer.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [outer[index], outer[swapIndex]] = [outer[swapIndex], outer[index]];
  }

  const shuffled = [outer[0], outer[1], outer[2], outer[3], puzzle.center, outer[4], outer[5], outer[6], outer[7]];
  renderLetters(shuffled);
  syncLetterButtonsFromInput();
}

function buildAcceptedWords(sourceWords) {
  const center = puzzle.center.toLowerCase();
  const maxLength = puzzle.letters.length;

  return sourceWords.filter((word) => {
    return word.length >= 4
      && word.length <= maxLength
      && word.includes(center)
      && canBuildWord(word, letterInventory);
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

function sanitizeWordInput(rawValue) {
  const nextCounts = {};
  let sanitized = "";

  for (const character of rawValue.toLowerCase()) {
    if (!allowedLetters.has(character)) {
      continue;
    }

    const usedCount = nextCounts[character] || 0;
    const allowedCount = letterInventory[character] || 0;

    if (usedCount >= allowedCount) {
      continue;
    }

    nextCounts[character] = usedCount + 1;
    sanitized += character;
  }

  return sanitized;
}

function syncLetterButtonsFromInput() {
  const buttons = [...letterGridEl.querySelectorAll(".letter-tile")];

  buttons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("used");
  });

  for (const character of inputEl.value.toLowerCase()) {
    const matchingButton = buttons.find((button) => {
      return !button.disabled && button.dataset.letter === character;
    });

    if (matchingButton) {
      matchingButton.disabled = true;
      matchingButton.classList.add("used");
    }
  }
}

function canBuildWord(word, inventory) {
  const counts = {};

  for (const character of word) {
    if (!allowedLetters.has(character)) {
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
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    return [...new Set(saved.filter((word) => acceptedSet.has(word)))];
  } catch {
    return [];
  }
}

function saveWords() {
  window.localStorage.setItem(storageKey, JSON.stringify(state.foundWords));
}

function setStatus(message) {
  statusLineEl.textContent = message;
}
