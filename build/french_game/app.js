const APP_VERSION = "20260423-french1";
const HIGH_SCORE_KEY = "frenchGameHighScore";

const rounds = [
  { prompt: "bonjour", answers: ["hello", "good morning"] },
  { prompt: "bonsoir", answers: ["good evening"] },
  { prompt: "bonne nuit", answers: ["good night"] },
  { prompt: "au revoir", answers: ["goodbye", "bye"] },
  { prompt: "a bientot", answers: ["see you soon"] },
  { prompt: "a demain", answers: ["see you tomorrow"] },
  { prompt: "a tout a l'heure", answers: ["see you later"] },
  { prompt: "a tout de suite", answers: ["see you in a moment"] },
  { prompt: "a la prochaine", answers: ["see you next time"] },
  { prompt: "merci", answers: ["thank you", "thanks"] },
  { prompt: "s'il vous plait", answers: ["please"] },
  { prompt: "oui", answers: ["yes"] },
  { prompt: "non", answers: ["no"] },
  { prompt: "excusez-moi", answers: ["excuse me"] },
  { prompt: "pardon", answers: ["sorry", "pardon me"] },
  { prompt: "comment ca va", answers: ["how are you"] },
  { prompt: "ca va", answers: ["i'm fine", "okay", "it's going well"] },
  { prompt: "je m'appelle", answers: ["my name is"] },
  { prompt: "je suis", answers: ["i am"] },
  { prompt: "tu t'appelles comment", answers: ["what's your name"] },
  { prompt: "j'ai faim", answers: ["i am hungry"] },
  { prompt: "j'ai soif", answers: ["i am thirsty"] },
  { prompt: "je suis fatigue", answers: ["i am tired"] },
  { prompt: "je suis content", answers: ["i am happy"] },
  { prompt: "je suis triste", answers: ["i am sad"] },
  { prompt: "je suis perdu", answers: ["i am lost"] },
  { prompt: "aide-moi", answers: ["help me"] },
  { prompt: "bien sur", answers: ["of course"] },
  { prompt: "peut-etre", answers: ["maybe"] },
  { prompt: "d'accord", answers: ["okay", "all right"] },
  { prompt: "bon appetit", answers: ["enjoy your meal"] },
  { prompt: "ou habites-tu", answers: ["where do you live"] },
  { prompt: "j'habite a londres", answers: ["i live in london"] },
  { prompt: "quelle heure est-il", answers: ["what time is it"] },
  { prompt: "il est midi", answers: ["it is noon"] },
  { prompt: "il est une heure", answers: ["it is one o'clock"] },
  { prompt: "combien ca coute", answers: ["how much does it cost"] },
  { prompt: "je ne comprends pas", answers: ["i don't understand"] },
  { prompt: "parlez-vous anglais", answers: ["do you speak english"] },
  { prompt: "comment dit-on", answers: ["how do you say"] },
  { prompt: "je voudrais", answers: ["i would like"] },
  { prompt: "un cafe s'il vous plait", answers: ["a coffee please"] },
  { prompt: "de l'eau", answers: ["water", "some water"] },
  { prompt: "le pain", answers: ["bread", "the bread"] },
  { prompt: "le fromage", answers: ["cheese", "the cheese"] },
  { prompt: "la pomme", answers: ["apple", "the apple"] },
  { prompt: "le chien", answers: ["dog", "the dog"] },
  { prompt: "le chat", answers: ["cat", "the cat"] },
  { prompt: "la maison", answers: ["house", "the house"] },
  { prompt: "l'ecole", answers: ["school", "the school"] },
  { prompt: "le livre", answers: ["book", "the book"] },
  { prompt: "la voiture", answers: ["car", "the car"] },
  { prompt: "le soleil", answers: ["sun", "the sun"] },
  { prompt: "la lune", answers: ["moon", "the moon"] },
  { prompt: "aujourd'hui", answers: ["today"] },
  { prompt: "demain", answers: ["tomorrow"] },
  { prompt: "hier", answers: ["yesterday"] },
  { prompt: "maintenant", answers: ["now"] },
  { prompt: "toujours", answers: ["always"] },
  { prompt: "jamais", answers: ["never"] },
  { prompt: "souvent", answers: ["often"] },
  { prompt: "parfois", answers: ["sometimes"] },
  { prompt: "ici", answers: ["here"] },
  { prompt: "la-bas", answers: ["there", "over there"] },
  { prompt: "gauche", answers: ["left"] },
  { prompt: "droite", answers: ["right"] },
  { prompt: "tout droit", answers: ["straight ahead", "straight on"] },
  { prompt: "ouvrez le livre", answers: ["open the book"] },
  { prompt: "fermez la porte", answers: ["close the door"] },
  { prompt: "ecoutez", answers: ["listen"] },
  { prompt: "regardez", answers: ["look"] },
  { prompt: "asseyez-vous", answers: ["sit down"] },
  { prompt: "levez-vous", answers: ["stand up"] },
  { prompt: "j'aime", answers: ["i like", "i love"] },
  { prompt: "je n'aime pas", answers: ["i don't like", "i do not like"] },
  { prompt: "c'est bon", answers: ["it's good", "it tastes good"] },
  { prompt: "c'est mauvais", answers: ["it's bad"] },
  { prompt: "il fait chaud", answers: ["it is hot"] },
  { prompt: "il fait froid", answers: ["it is cold"] },
  { prompt: "il pleut", answers: ["it is raining"] },
  { prompt: "il neige", answers: ["it is snowing"] },
  { prompt: "ou est la gare", answers: ["where is the station"] },
  { prompt: "ou sont les toilettes", answers: ["where is the toilet", "where is the bathroom"] },
  { prompt: "viens ici", answers: ["come here"] },
  { prompt: "attends une minute", answers: ["wait a minute"] },
  { prompt: "bon anniversaire", answers: ["happy birthday"] },
  { prompt: "joyeux noel", answers: ["merry christmas"] },
  { prompt: "bonne annee", answers: ["happy new year"] },
  { prompt: "a tes souhaits", answers: ["bless you"] },
  { prompt: "je peux entrer", answers: ["may i come in"] }
];

const translationPool = [...new Set(rounds.flatMap((round) => round.answers))];

const promptTextEl = document.getElementById("prompt-text");
const promptCopyEl = document.getElementById("prompt-copy");
const optionsGridEl = document.getElementById("options-grid");
const scoreEl = document.getElementById("score");
const scoreContextEl = document.getElementById("score-context");
const pointsScoreEl = document.getElementById("points-score");
const roundTimerEl = document.getElementById("round-timer");
const highScoreEl = document.getElementById("high-score");
const checkButtonEl = document.getElementById("check-button");
const clearButtonEl = document.getElementById("clear-button");
const newGameButtonEl = document.getElementById("new-game-button");
const bonusToastEl = document.getElementById("bonus-toast");
const celebrationEl = document.getElementById("celebration");
const celebrationKickerEl = document.getElementById("celebration-kicker");
const celebrationTitleEl = document.getElementById("celebration-title");
const celebrationCopyEl = document.getElementById("celebration-copy");
const celebrationButtonEl = document.getElementById("celebration-button");

const state = {
  deck: [],
  currentRound: null,
  currentOptions: [],
  selectedAnswers: new Set(),
  points: 0,
  highScore: 0,
  correct: 0,
  presented: 0,
  correctStreak: 0,
  streakElapsedMs: 0,
  timerId: null,
  timerSegmentStartedAt: 0,
  resetTimerOnNextRound: false,
  isLocked: false,
  isComplete: false,
  bonusTimer: null,
  feedbackReadyAt: 0,
  feedbackTimer: null
};

registerServiceWorker();
resetGame();
checkButtonEl.addEventListener("click", checkAnswer);
clearButtonEl.addEventListener("click", clearSelection);
newGameButtonEl.addEventListener("click", resetGame);
celebrationButtonEl.addEventListener("click", () => {
  if (Date.now() < state.feedbackReadyAt) {
    return;
  }

  hideCelebration();
  if (!state.isComplete) {
    startRound();
  }
});

function resetGame() {
  stopRoundTimer();
  state.deck = shuffleList(rounds);
  state.currentRound = null;
  state.currentOptions = [];
  state.selectedAnswers = new Set();
  state.points = 0;
  state.correct = 0;
  state.presented = 0;
  state.correctStreak = 0;
  state.streakElapsedMs = 0;
  state.timerSegmentStartedAt = 0;
  state.resetTimerOnNextRound = false;
  state.isLocked = false;
  state.isComplete = false;
  state.highScore = readHighScore();
  renderScore();
  renderPoints();
  renderTimer(0);
  scoreContextEl.textContent = `of ${rounds.length} phrases`;
  startRound();
}

function startRound() {
  if (state.deck.length === 0) {
    finishGame();
    return;
  }

  state.currentRound = state.deck.pop();
  state.currentOptions = buildOptions(state.currentRound);
  state.selectedAnswers = new Set();
  state.isLocked = false;
  promptTextEl.textContent = state.currentRound.prompt;
  promptCopyEl.textContent = "Some rounds have more than one correct English answer, so select all that fit before checking.";
  renderOptions();
  updateActionButtons();
  startRoundTimer();
}

function buildOptions(round) {
  const options = new Set(round.answers);
  const distractors = shuffleList(translationPool.filter((entry) => !options.has(entry)));
  for (const distractor of distractors) {
    if (options.size >= 20) {
      break;
    }
    options.add(distractor);
  }
  return shuffleList([...options]);
}

function renderOptions() {
  optionsGridEl.innerHTML = "";
  state.currentOptions.forEach((translation) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = translation;
    button.addEventListener("pointerdown", () => button.classList.add("pressing"));
    button.addEventListener("pointerup", () => button.classList.remove("pressing"));
    button.addEventListener("pointercancel", () => button.classList.remove("pressing"));
    button.addEventListener("click", () => toggleSelection(translation, button));
    optionsGridEl.appendChild(button);
  });
}

function toggleSelection(translation, button) {
  if (state.isLocked) {
    return;
  }

  if (state.selectedAnswers.has(translation)) {
    state.selectedAnswers.delete(translation);
    button.classList.remove("selected");
  } else {
    state.selectedAnswers.add(translation);
    button.classList.add("selected");
  }

  updateActionButtons();
}

function clearSelection() {
  if (state.isLocked) {
    return;
  }

  state.selectedAnswers.clear();
  [...optionsGridEl.querySelectorAll(".option-button")].forEach((button) => {
    button.classList.remove("selected");
  });
  updateActionButtons();
}

function updateActionButtons() {
  const hasSelection = state.selectedAnswers.size > 0;
  checkButtonEl.disabled = state.isLocked || !hasSelection;
  clearButtonEl.disabled = state.isLocked || !hasSelection;
}

function checkAnswer() {
  if (state.isLocked || state.selectedAnswers.size === 0) {
    return;
  }

  state.isLocked = true;
  const roundMs = stopRoundTimer();
  const correctAnswers = new Set(state.currentRound.answers);
  const missed = [...correctAnswers].filter((answer) => !state.selectedAnswers.has(answer));
  const extras = [...state.selectedAnswers].filter((answer) => !correctAnswers.has(answer));
  const isCorrect = missed.length === 0 && extras.length === 0;

  state.presented += 1;
  if (isCorrect) {
    state.correct += 1;
  }

  applyScoring(isCorrect, state.currentRound.answers.length * 10, roundMs);

  [...optionsGridEl.querySelectorAll(".option-button")].forEach((button) => {
    button.disabled = true;
    if (correctAnswers.has(button.textContent)) {
      button.classList.add("correct");
    } else if (state.selectedAnswers.has(button.textContent)) {
      button.classList.add("incorrect");
    }
  });

  updateActionButtons();
  renderScore();
  showFeedback(isCorrect, missed, extras);
}

function showFeedback(isCorrect, missed, extras) {
  celebrationEl.classList.toggle("wrong", !isCorrect);
  celebrationKickerEl.textContent = isCorrect ? "Correct" : "Answer";
  celebrationTitleEl.textContent = state.currentRound.prompt;

  if (isCorrect) {
    celebrationCopyEl.textContent = `Valid answers: ${state.currentRound.answers.join(", ")}.`;
  } else {
    const parts = [`Valid answers: ${state.currentRound.answers.join(", ")}.`];
    if (missed.length > 0) {
      parts.push(`Missed: ${missed.join(", ")}.`);
    }
    if (extras.length > 0) {
      parts.push(`Extra: ${extras.join(", ")}.`);
    }
    celebrationCopyEl.textContent = parts.join(" ");
  }

  showCelebration();
}

function finishGame() {
  state.isLocked = true;
  state.isComplete = true;
  stopRoundTimer();
  promptTextEl.textContent = "Set complete";
  promptCopyEl.textContent = "You finished the full beginner phrase deck. Tap New game to reshuffle the set.";
  optionsGridEl.innerHTML = "";
  updateActionButtons();
  celebrationEl.classList.remove("wrong");
  celebrationKickerEl.textContent = "Complete";
  celebrationTitleEl.textContent = "Full Set Done";
  celebrationCopyEl.textContent = `You finished ${rounds.length} phrases.`;
  showCelebration();
}

function showCelebration() {
  window.clearTimeout(state.feedbackTimer);
  state.feedbackReadyAt = Date.now() + 300;
  celebrationButtonEl.disabled = true;
  celebrationEl.classList.add("show");
  celebrationEl.setAttribute("aria-hidden", "false");
  state.feedbackTimer = window.setTimeout(() => {
    celebrationButtonEl.disabled = false;
  }, 300);
}

function hideCelebration() {
  celebrationEl.classList.remove("show");
  celebrationEl.setAttribute("aria-hidden", "true");
}

function renderScore() {
  scoreEl.textContent = `${state.correct} / ${state.presented}`;
}

function renderPoints() {
  pointsScoreEl.textContent = state.points;
  highScoreEl.textContent = state.highScore;
}

function startRoundTimer() {
  stopRoundTimer();
  if (state.resetTimerOnNextRound) {
    state.streakElapsedMs = 0;
    state.resetTimerOnNextRound = false;
  }

  state.timerSegmentStartedAt = performance.now();
  renderTimer(state.streakElapsedMs);
  state.timerId = window.setInterval(() => {
    renderTimer(state.streakElapsedMs + performance.now() - state.timerSegmentStartedAt);
  }, 100);
}

function stopRoundTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }

  if (!state.timerSegmentStartedAt) {
    return state.streakElapsedMs || 0;
  }

  state.streakElapsedMs += performance.now() - state.timerSegmentStartedAt;
  state.timerSegmentStartedAt = 0;
  renderTimer(state.streakElapsedMs);
  return state.streakElapsedMs;
}

function renderTimer(milliseconds) {
  const secondsText = (milliseconds / 1000).toFixed(1).padStart(5, "0");
  roundTimerEl.textContent = `${secondsText}s`;
}

function applyScoring(isCorrect, basePoints, roundMs) {
  const bonusMessages = [];

  if (isCorrect) {
    state.points += basePoints;
    state.correctStreak += 1;

    if (state.correctStreak % 10 === 0) {
      state.points += 100;
      bonusMessages.push("+100 streak bonus");

      const streakSeconds = roundMs / 1000;
      if (streakSeconds <= 14) {
        state.points += 250;
        bonusMessages.push("+250 speed bonus");
      }
    }
  } else {
    state.correctStreak = 0;
    state.resetTimerOnNextRound = true;
  }

  updateHighScore();
  renderPoints();

  if (bonusMessages.length > 0) {
    showBonusToast(bonusMessages.join(" / "));
  }
}

function updateHighScore() {
  if (state.points <= state.highScore) {
    return;
  }

  state.highScore = state.points;
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(state.highScore));
  } catch {
    // Ignore localStorage issues.
  }
}

function readHighScore() {
  try {
    const storedScore = Number(localStorage.getItem(HIGH_SCORE_KEY));
    return Number.isFinite(storedScore) && storedScore > 0 ? storedScore : 0;
  } catch {
    return 0;
  }
}

function showBonusToast(message) {
  window.clearTimeout(state.bonusTimer);
  bonusToastEl.textContent = message;
  bonusToastEl.classList.add("show");
  bonusToastEl.setAttribute("aria-hidden", "false");
  state.bonusTimer = window.setTimeout(() => {
    bonusToastEl.classList.remove("show");
    bonusToastEl.setAttribute("aria-hidden", "true");
  }, 1400);
}

function shuffleList(items) {
  const copy = items.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`./sw.js?v=${APP_VERSION}`).catch(() => {});
  });
}
