const APP_VERSION = "20260423-capitals2";
const HIGH_SCORE_KEY = "capitalsGameHighScore";

const rounds = [
  {
    country: "France",
    capital: "Paris",
    nearbyCities: ["Brussels", "Amsterdam", "London", "Luxembourg City", "Geneva", "Milan", "Turin", "Barcelona"],
    domesticCities: ["Marseille", "Lyon", "Toulouse", "Nice", "Bordeaux", "Lille", "Nantes", "Strasbourg"]
  },
  {
    country: "Germany",
    capital: "Berlin",
    nearbyCities: ["Warsaw", "Prague", "Vienna", "Amsterdam", "Brussels", "Zurich", "Copenhagen", "Luxembourg City"],
    domesticCities: ["Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Leipzig", "Dresden", "Dortmund"]
  },
  {
    country: "Italy",
    capital: "Rome",
    nearbyCities: ["Milan", "Venice", "Zurich", "Vienna", "Ljubljana", "Valletta", "Tunis", "Marseille"],
    domesticCities: ["Naples", "Turin", "Florence", "Bologna", "Palermo", "Genoa", "Bari", "Catania"]
  },
  {
    country: "Spain",
    capital: "Madrid",
    nearbyCities: ["Lisbon", "Barcelona", "Marseille", "Andorra la Vella", "Tangier", "Casablanca", "Bordeaux", "Bilbao"],
    domesticCities: ["Seville", "Valencia", "Malaga", "Zaragoza", "Granada", "Murcia", "Palma", "Alicante"]
  },
  {
    country: "Portugal",
    capital: "Lisbon",
    nearbyCities: ["Madrid", "Seville", "Vigo", "Casablanca", "Rabat", "Tangier", "Porto Santo", "Badajoz"],
    domesticCities: ["Porto", "Braga", "Coimbra", "Faro", "Aveiro", "Evora", "Funchal", "Ponta Delgada"]
  },
  {
    country: "United Kingdom",
    capital: "London",
    nearbyCities: ["Dublin", "Paris", "Brussels", "Amsterdam", "Cardiff", "Belfast", "Edinburgh", "Oslo"],
    domesticCities: ["Manchester", "Birmingham", "Glasgow", "Liverpool", "Leeds", "Bristol", "Newcastle", "Sheffield"]
  },
  {
    country: "Ireland",
    capital: "Dublin",
    nearbyCities: ["London", "Belfast", "Cardiff", "Glasgow", "Liverpool", "Edinburgh", "Paris", "Reykjavik"],
    domesticCities: ["Cork", "Galway", "Limerick", "Waterford", "Kilkenny", "Sligo", "Drogheda", "Wexford"]
  },
  {
    country: "Netherlands",
    capital: "Amsterdam",
    nearbyCities: ["Brussels", "Rotterdam", "The Hague", "Cologne", "Antwerp", "Luxembourg City", "London", "Berlin"],
    domesticCities: ["Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen", "Maastricht", "Leiden", "Haarlem"]
  },
  {
    country: "Belgium",
    capital: "Brussels",
    nearbyCities: ["Amsterdam", "Antwerp", "Rotterdam", "Paris", "Luxembourg City", "Cologne", "London", "Lille"],
    domesticCities: ["Antwerp", "Ghent", "Bruges", "Liege", "Namur", "Leuven", "Mons", "Mechelen"]
  },
  {
    country: "Switzerland",
    capital: "Bern",
    nearbyCities: ["Zurich", "Geneva", "Milan", "Munich", "Lyon", "Turin", "Vienna", "Luxembourg City"],
    domesticCities: ["Zurich", "Geneva", "Basel", "Lausanne", "Lucerne", "Lugano", "St. Gallen", "Winterthur"]
  },
  {
    country: "Austria",
    capital: "Vienna",
    nearbyCities: ["Prague", "Bratislava", "Budapest", "Munich", "Ljubljana", "Zurich", "Venice", "Zagreb"],
    domesticCities: ["Salzburg", "Graz", "Linz", "Innsbruck", "Klagenfurt", "Bregenz", "Villach", "Wels"]
  },
  {
    country: "Poland",
    capital: "Warsaw",
    nearbyCities: ["Berlin", "Prague", "Bratislava", "Vilnius", "Kyiv", "Minsk", "Gdansk", "Krakow"],
    domesticCities: ["Krakow", "Gdansk", "Wroclaw", "Poznan", "Lodz", "Szczecin", "Lublin", "Katowice"]
  },
  {
    country: "Czechia",
    capital: "Prague",
    nearbyCities: ["Berlin", "Vienna", "Bratislava", "Warsaw", "Dresden", "Munich", "Brno", "Budapest"],
    domesticCities: ["Brno", "Ostrava", "Plzen", "Liberec", "Olomouc", "Ceske Budejovice", "Pardubice", "Hradec Kralove"]
  },
  {
    country: "Hungary",
    capital: "Budapest",
    nearbyCities: ["Vienna", "Bratislava", "Zagreb", "Belgrade", "Ljubljana", "Prague", "Cluj-Napoca", "Bucharest"],
    domesticCities: ["Debrecen", "Szeged", "Pecs", "Gyor", "Miskolc", "Eger", "Kecskemet", "Sopron"]
  },
  {
    country: "Greece",
    capital: "Athens",
    nearbyCities: ["Sofia", "Skopje", "Tirana", "Istanbul", "Izmir", "Nicosia", "Thessaloniki", "Valletta"],
    domesticCities: ["Thessaloniki", "Patras", "Heraklion", "Larissa", "Volos", "Kalamata", "Rhodes", "Ioannina"]
  },
  {
    country: "Turkey",
    capital: "Ankara",
    nearbyCities: ["Istanbul", "Sofia", "Athens", "Tbilisi", "Yerevan", "Baku", "Aleppo", "Tehran"],
    domesticCities: ["Istanbul", "Izmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Trabzon"]
  },
  {
    country: "Egypt",
    capital: "Cairo",
    nearbyCities: ["Alexandria", "Jerusalem", "Amman", "Khartoum", "Tripoli", "Riyadh", "Jeddah", "Nicosia"],
    domesticCities: ["Alexandria", "Giza", "Luxor", "Aswan", "Port Said", "Sharm El Sheikh", "Hurghada", "Mansoura"]
  },
  {
    country: "Morocco",
    capital: "Rabat",
    nearbyCities: ["Casablanca", "Tangier", "Algiers", "Madrid", "Lisbon", "Seville", "Tunis", "Marrakesh"],
    domesticCities: ["Casablanca", "Tangier", "Marrakesh", "Fes", "Agadir", "Meknes", "Oujda", "Tetouan"]
  },
  {
    country: "Nigeria",
    capital: "Abuja",
    nearbyCities: ["Lagos", "Accra", "Yaounde", "Douala", "Niamey", "Port Harcourt", "Cotonou", "Lome"],
    domesticCities: ["Lagos", "Kano", "Ibadan", "Port Harcourt", "Benin City", "Kaduna", "Jos", "Enugu"]
  },
  {
    country: "Kenya",
    capital: "Nairobi",
    nearbyCities: ["Kampala", "Addis Ababa", "Dar es Salaam", "Mogadishu", "Kigali", "Juba", "Mombasa", "Arusha"],
    domesticCities: ["Mombasa", "Kisumu", "Nakuru", "Eldoret", "Naivasha", "Malindi", "Thika", "Garissa"]
  },
  {
    country: "South Africa",
    capital: "Pretoria",
    nearbyCities: ["Johannesburg", "Cape Town", "Gaborone", "Maputo", "Windhoek", "Maseru", "Mbabane", "Harare"],
    domesticCities: ["Johannesburg", "Cape Town", "Durban", "Bloemfontein", "Port Elizabeth", "Polokwane", "Kimberley", "Nelspruit"]
  },
  {
    country: "India",
    capital: "New Delhi",
    nearbyCities: ["Mumbai", "Kathmandu", "Dhaka", "Lahore", "Karachi", "Colombo", "Thimphu", "Islamabad"],
    domesticCities: ["Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Ahmedabad"]
  },
  {
    country: "Pakistan",
    capital: "Islamabad",
    nearbyCities: ["Lahore", "Karachi", "New Delhi", "Kabul", "Tehran", "Jaipur", "Amritsar", "Dhaka"],
    domesticCities: ["Lahore", "Karachi", "Peshawar", "Quetta", "Faisalabad", "Rawalpindi", "Multan", "Hyderabad"]
  },
  {
    country: "China",
    capital: "Beijing",
    nearbyCities: ["Shanghai", "Seoul", "Pyongyang", "Ulaanbaatar", "Taipei", "Tokyo", "Hong Kong", "Tianjin"],
    domesticCities: ["Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Wuhan", "Xi'an", "Hangzhou", "Nanjing"]
  },
  {
    country: "Japan",
    capital: "Tokyo",
    nearbyCities: ["Seoul", "Busan", "Taipei", "Shanghai", "Sapporo", "Osaka", "Nagoya", "Fukuoka"],
    domesticCities: ["Osaka", "Kyoto", "Nagoya", "Sapporo", "Fukuoka", "Hiroshima", "Sendai", "Yokohama"]
  },
  {
    country: "South Korea",
    capital: "Seoul",
    nearbyCities: ["Busan", "Tokyo", "Beijing", "Shanghai", "Pyongyang", "Daejeon", "Incheon", "Jeju City"],
    domesticCities: ["Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Jeju City"]
  },
  {
    country: "Thailand",
    capital: "Bangkok",
    nearbyCities: ["Chiang Mai", "Phnom Penh", "Vientiane", "Yangon", "Ho Chi Minh City", "Kuala Lumpur", "Singapore", "Da Nang"],
    domesticCities: ["Chiang Mai", "Phuket", "Pattaya", "Khon Kaen", "Hat Yai", "Ayutthaya", "Krabi", "Udon Thani"]
  },
  {
    country: "Vietnam",
    capital: "Hanoi",
    nearbyCities: ["Ho Chi Minh City", "Vientiane", "Phnom Penh", "Nanning", "Bangkok", "Da Nang", "Luang Prabang", "Hong Kong"],
    domesticCities: ["Ho Chi Minh City", "Da Nang", "Hai Phong", "Hue", "Can Tho", "Nha Trang", "Dalat", "Vung Tau"]
  },
  {
    country: "Indonesia",
    capital: "Jakarta",
    nearbyCities: ["Singapore", "Kuala Lumpur", "Bandung", "Surabaya", "Dili", "Manila", "Bangkok", "Denpasar"],
    domesticCities: ["Surabaya", "Bandung", "Medan", "Yogyakarta", "Makassar", "Semarang", "Denpasar", "Balikpapan"]
  },
  {
    country: "Australia",
    capital: "Canberra",
    nearbyCities: ["Sydney", "Melbourne", "Auckland", "Wellington", "Port Moresby", "Suva", "Christchurch", "Brisbane"],
    domesticCities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Hobart", "Darwin", "Gold Coast"]
  },
  {
    country: "New Zealand",
    capital: "Wellington",
    nearbyCities: ["Auckland", "Sydney", "Melbourne", "Canberra", "Suva", "Christchurch", "Brisbane", "Hobart"],
    domesticCities: ["Auckland", "Christchurch", "Hamilton", "Dunedin", "Queenstown", "Rotorua", "Napier", "Tauranga"]
  },
  {
    country: "Canada",
    capital: "Ottawa",
    nearbyCities: ["Toronto", "Montreal", "Quebec City", "New York", "Chicago", "Washington", "Detroit", "Winnipeg"],
    domesticCities: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Quebec City", "Halifax", "Winnipeg"]
  },
  {
    country: "United States",
    capital: "Washington",
    nearbyCities: ["New York", "Toronto", "Ottawa", "Montreal", "Mexico City", "Chicago", "Atlanta", "Havana"],
    domesticCities: ["New York", "Los Angeles", "Chicago", "Houston", "Miami", "Seattle", "Boston", "Atlanta"]
  },
  {
    country: "Mexico",
    capital: "Mexico City",
    nearbyCities: ["Guadalajara", "Monterrey", "Houston", "Guatemala City", "Belize City", "Havana", "San Antonio", "Merida"],
    domesticCities: ["Guadalajara", "Monterrey", "Puebla", "Merida", "Tijuana", "Cancun", "Oaxaca", "Leon"]
  },
  {
    country: "Brazil",
    capital: "Brasilia",
    nearbyCities: ["Sao Paulo", "Rio de Janeiro", "Buenos Aires", "Asuncion", "Montevideo", "Lima", "Bogota", "La Paz"],
    domesticCities: ["Sao Paulo", "Rio de Janeiro", "Salvador", "Recife", "Fortaleza", "Manaus", "Belo Horizonte", "Curitiba"]
  },
  {
    country: "Argentina",
    capital: "Buenos Aires",
    nearbyCities: ["Montevideo", "Santiago", "Asuncion", "Porto Alegre", "Cordoba", "Mendoza", "Sao Paulo", "La Paz"],
    domesticCities: ["Cordoba", "Rosario", "Mendoza", "Salta", "Mar del Plata", "Ushuaia", "La Plata", "Bariloche"]
  },
  {
    country: "Chile",
    capital: "Santiago",
    nearbyCities: ["Mendoza", "Buenos Aires", "La Paz", "Lima", "Valparaiso", "Cordoba", "Montevideo", "Antofagasta"],
    domesticCities: ["Valparaiso", "Concepcion", "Antofagasta", "La Serena", "Puerto Montt", "Temuco", "Iquique", "Punta Arenas"]
  },
  {
    country: "Peru",
    capital: "Lima",
    nearbyCities: ["Quito", "La Paz", "Santiago", "Bogota", "Guayaquil", "Cusco", "Arequipa", "Trujillo"],
    domesticCities: ["Cusco", "Arequipa", "Trujillo", "Piura", "Iquitos", "Chiclayo", "Tacna", "Puno"]
  },
  {
    country: "Colombia",
    capital: "Bogota",
    nearbyCities: ["Quito", "Caracas", "Panama City", "Lima", "Medellin", "Cali", "Guayaquil", "San Jose"],
    domesticCities: ["Medellin", "Cali", "Cartagena", "Barranquilla", "Bucaramanga", "Pereira", "Santa Marta", "Manizales"]
  },
  {
    country: "Saudi Arabia",
    capital: "Riyadh",
    nearbyCities: ["Jeddah", "Mecca", "Medina", "Amman", "Cairo", "Doha", "Kuwait City", "Dubai"],
    domesticCities: ["Jeddah", "Mecca", "Medina", "Dammam", "Taif", "Tabuk", "Abha", "Khobar"]
  },
  {
    country: "United Arab Emirates",
    capital: "Abu Dhabi",
    nearbyCities: ["Dubai", "Doha", "Muscat", "Riyadh", "Manama", "Kuwait City", "Sharjah", "Jeddah"],
    domesticCities: ["Dubai", "Sharjah", "Ajman", "Al Ain", "Fujairah", "Ras Al Khaimah", "Umm Al Quwain", "Khor Fakkan"]
  }
];

const globalFallbackCities = buildCityPool(rounds);

const promptCountryEl = document.getElementById("prompt-country");
const promptCopyEl = document.getElementById("prompt-copy");
const optionsGridEl = document.getElementById("options-grid");
const scoreEl = document.getElementById("score");
const scoreContextEl = document.getElementById("score-context");
const pointsScoreEl = document.getElementById("points-score");
const roundTimerEl = document.getElementById("round-timer");
const highScoreEl = document.getElementById("high-score");
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
  scoreContextEl.textContent = `of ${rounds.length} curated countries`;
  startRound();
}

function startRound() {
  if (state.deck.length === 0) {
    finishGame();
    return;
  }

  state.currentRound = state.deck.pop();
  state.isLocked = false;
  promptCountryEl.textContent = state.currentRound.country;
  promptCopyEl.textContent = "Pick the capital city. Distractors include nearby capitals or cities plus places inside the country.";
  renderOptions(buildOptions(state.currentRound));
  startRoundTimer();
}

function buildOptions(round) {
  const options = new Set([round.capital]);
  shuffleList(round.nearbyCities).slice(0, 8).forEach((city) => options.add(city));
  shuffleList(round.domesticCities).slice(0, 8).forEach((city) => options.add(city));

  const fallbackPool = shuffleList(globalFallbackCities.filter((city) => {
    return city !== round.capital && !round.nearbyCities.includes(city) && !round.domesticCities.includes(city);
  }));

  for (const city of fallbackPool) {
    if (options.size >= 20) {
      break;
    }
    options.add(city);
  }

  return shuffleList([...options].slice(0, 20));
}

function renderOptions(options) {
  optionsGridEl.innerHTML = "";
  options.forEach((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = city;
    bindTap(button, () => chooseCity(city, button));
    optionsGridEl.appendChild(button);
  });
}

function chooseCity(city, button) {
  if (state.isLocked) {
    return;
  }

  state.isLocked = true;
  const roundMs = stopRoundTimer();
  const isCorrect = city === state.currentRound.capital;
  state.presented += 1;
  if (isCorrect) {
    state.correct += 1;
  }

  applyScoring(isCorrect, 10, roundMs);

  [...optionsGridEl.querySelectorAll(".option-button")].forEach((optionButton) => {
    optionButton.disabled = true;
    if (optionButton.textContent === state.currentRound.capital) {
      optionButton.classList.add("correct");
    }
  });

  if (!isCorrect) {
    button.classList.add("incorrect");
  }

  renderScore();
  showFeedback(isCorrect, city);
}

function showFeedback(isCorrect, chosenCity) {
  celebrationEl.classList.toggle("wrong", !isCorrect);
  celebrationKickerEl.textContent = isCorrect ? "Correct" : "Answer";
  celebrationTitleEl.textContent = state.currentRound.capital;
  celebrationCopyEl.textContent = isCorrect
    ? `${state.currentRound.capital} is the capital of ${state.currentRound.country}.`
    : `You chose ${chosenCity}. ${state.currentRound.capital} is the capital of ${state.currentRound.country}.`;
  showCelebration();
}

function finishGame() {
  state.isLocked = true;
  state.isComplete = true;
  stopRoundTimer();
  promptCountryEl.textContent = "Deck complete";
  promptCopyEl.textContent = "You finished the full curated set. Tap New game to reshuffle the countries.";
  optionsGridEl.innerHTML = "";
  celebrationEl.classList.remove("wrong");
  celebrationKickerEl.textContent = "Complete";
  celebrationTitleEl.textContent = "Full Set Done";
  celebrationCopyEl.textContent = `You finished ${rounds.length} curated countries.`;
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
      if (streakSeconds <= 12) {
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

function buildCityPool(roundList) {
  const uniqueCities = new Set();
  roundList.forEach((round) => {
    uniqueCities.add(round.capital);
    round.nearbyCities.forEach((city) => uniqueCities.add(city));
    round.domesticCities.forEach((city) => uniqueCities.add(city));
  });
  return [...uniqueCities];
}

function bindTap(button, onTap) {
  let touchHandledAt = 0;

  button.addEventListener("pointerdown", () => button.classList.add("pressing"));
  button.addEventListener("pointerup", () => button.classList.remove("pressing"));
  button.addEventListener("pointercancel", () => button.classList.remove("pressing"));

  button.addEventListener("touchstart", () => button.classList.add("pressing"), { passive: true });
  button.addEventListener("touchend", () => {
    button.classList.remove("pressing");
    touchHandledAt = Date.now();
    onTap();
  }, { passive: true });
  button.addEventListener("touchcancel", () => button.classList.remove("pressing"), { passive: true });

  button.addEventListener("click", () => {
    if (Date.now() - touchHandledAt < 700) {
      return;
    }
    onTap();
  });
}
