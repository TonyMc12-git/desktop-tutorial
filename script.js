const puzzle = {
  title: "RELATIONS",
  center: "A",
  letters: ["R", "E", "L", "T", "A", "I", "O", "N", "S"],
  acceptedWords: [
    "relations",
    "relation",
    "oriental",
    "retinals",
    "senorita",
    "elations",
    "treason",
    "senator",
    "tailors",
    "retails",
    "retains",
    "tail",
    "serial",
    "salient",
    "aileron",
    "retail",
    "retain",
    "retina",
    "reason",
    "ornate",
    "learn",
    "renal",
    "renail",
    "tailor",
    "talon",
    "tonal",
    "trail",
    "trial",
    "train",
    "arson",
    "snare",
    "saner",
    "reals",
    "rates",
    "stearin",
    "snail",
    "stain",
    "stair",
    "slate",
    "stale",
    "stare",
    "steal",
    "seal",
    "sale",
    "sail",
    "rail",
    "rain",
    "lane",
    "lean",
    "loan",
    "near",
    "earn",
    "real",
    "late",
    "tale",
    "teal",
    "rate",
    "tear",
    "tare",
    "later",
    "alert",
    "alter",
    "arise",
    "alone",
    "alien",
    "ratio",
    "solar",
    "sonar"
  ]
};

const acceptedWords = [...new Set(puzzle.acceptedWords)];
const storageKey = `nine-letters:${puzzle.title}`;
const acceptedSet = new Set(acceptedWords);
const allowedLetters = new Set(puzzle.letters.map((letter) => letter.toLowerCase()));
const letterInventory = buildLetterInventory(puzzle.letters);
const milestones = buildMilestones(acceptedWords.length);

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
  foundWords: loadSavedWords()
};

render();

submitButtonEl.addEventListener("click", submitWord);
clearButtonEl.addEventListener("click", () => {
  inputEl.value = "";
  syncLetterButtonsFromInput();
  inputEl.focus();
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

function render() {
  totalWordsEl.textContent = acceptedWords.length;
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
  unlockMilestones();
}

function validateWord(word) {
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

  const seenLetters = new Set();
  for (const letter of word) {
    if (!allowedLetters.has(letter)) {
      return { ok: false, message: `${word.toUpperCase()} uses a letter outside the board.` };
    }
    if (seenLetters.has(letter)) {
      return { ok: false, message: "You cannot reuse letters within a word." };
    }
    seenLetters.add(letter);
  }

  if (state.foundWords.includes(word)) {
    return { ok: false, message: "You already found that one." };
  }

  if (!acceptedSet.has(word)) {
    return { ok: false, message: "That is not in this puzzle's accepted word set." };
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

    tile.addEventListener("click", () => {
      const nextValue = sanitizeWordInput(`${inputEl.value}${letter}`);
      if (nextValue.length === inputEl.value.length) {
        setStatus(`You only have one ${letter} tile to use.`);
        return;
      }
      inputEl.value = nextValue.toUpperCase();
      syncLetterButtonsFromInput();
      inputEl.focus();
    });

    letterGridEl.appendChild(tile);
  });
}

function renderMilestones() {
  milestoneGridEl.innerHTML = "";

  milestones.forEach((milestone) => {
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
    empty.textContent = "No words found yet.";
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
  const totalCount = acceptedWords.length;
  const longest = state.foundWords.slice().sort((left, right) => right.length - left.length)[0];

  foundCountEl.textContent = foundCount;
  longestWordEl.textContent = longest ? longest.toUpperCase() : "-";
  progressCopyEl.textContent = `${foundCount} / ${totalCount}`;
  progressFillEl.style.width = `${(foundCount / totalCount) * 100}%`;
  renderMilestones();

  if (foundCount === totalCount) {
    heroCard.classList.add("victory");
    playCard.classList.add("victory");
  }
}

function unlockMilestones() {
  const newlyUnlocked = milestones.filter((milestone) => {
    return state.foundWords.length === milestone.target;
  });

  if (newlyUnlocked.length === 0) {
    return;
  }

  const milestone = newlyUnlocked[0];
  const finalMilestone = milestone.target === acceptedWords.length;
  showCelebration(milestone.celebration, finalMilestone);
  renderMilestones();
}

function showCelebration(message, finalMilestone = false) {
  celebrationBannerEl.textContent = message;
  celebrationBannerEl.classList.add("show");
  celebrationBannerEl.classList.toggle("final", finalMilestone);

  window.clearTimeout(showCelebration.timeoutId);
  showCelebration.timeoutId = window.setTimeout(() => {
    celebrationBannerEl.classList.remove("show");
  }, 3200);
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
      `Milestone reached: ${target} words. The board is warming up.`,
      `Milestone reached: ${target} words. You are in a real groove now.`,
      `Milestone reached: ${target} words. This is turning into a sweep.`,
      `Puzzle complete. Every accepted word is yours.`
    ];

    return {
      target,
      label: labels[index],
      description: descriptions[index],
      celebration: celebrations[index]
    };
  });
}

function loadSavedWords() {
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
  const remainingCounts = { ...letterInventory };

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

    if (remainingCounts[character]) {
      remainingCounts[character] -= 1;
    }
  }
}

function buildLetterInventory(letters) {
  return letters.reduce((inventory, letter) => {
    const key = letter.toLowerCase();
    inventory[key] = (inventory[key] || 0) + 1;
    return inventory;
  }, {});
}
