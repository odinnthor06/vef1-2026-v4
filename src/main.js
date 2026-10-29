import { questions } from "./lib/questions.js";
import {shuffle, createResults, countCorrect, updateStats, } from "./lib/quiz.js";
import { renderQuestion, showScreen, renderStats, renderResults } from "./lib/ui.js";

/* TODO importa úr hinum skránum */

/** Fasti sem segir til um hversu margar spurningar við sýnum. */
const NUMBER_OF_QUESTIONS = 4;

/** þetta er til að breyta fjolda spurninga hja Rétt svör: 0 af 4<-- og 
 * Spurning 1 af 4<-- eg veit verkefnalysing seigir ekkert um að breyta
 * þessu en sa það var ekki erfit að breyta þessu og langaði að breyta því :) */
const numerAfSpurningum = document.querySelectorAll(".total");
  
for (const Spurningar of numerAfSpurningum) {
  Spurningar.textContent = NUMBER_OF_QUESTIONS
} 

/**
 * Staða leiks, heldur utanum tölfræði, spurningar í núverandi leik,
 * svör notanda í núverandi leik og á hvaða spurningu við erum.
 * @type {{
 *   stats: import("./lib/quiz.js").Stats,
 *   questions: import("./lib/quiz.js").Question[],
 *   answers: string[],
 *   current: number,
 * }}
 */
const state = {
  stats: { played: 0, correct: 0, incorrect: 0 },
  questions: [],
  answers: [],
  current: 0,
};

/**
 * Byrjar nýjan leik og sýnir fyrstu spurningu.
 * @returns {void}
 */
function start() {
  /* TODO velja spurningar, endursetja stöðu, sýna fyrsta skjá */
  const shuffled = shuffle(questions);
  state.questions = shuffled.slice(0, NUMBER_OF_QUESTIONS);
  state.current = 1;
  state.answers = [];

  const startButton = document.querySelector(".start-button");

  if (startButton) {
    startButton.addEventListener("click", () => {
      showScreen("question");

      renderQuestion(
        state.questions[state.current - 1],
        state.current - 1,
        NUMBER_OF_QUESTIONS,
      );
    });
  } else {
    console.error("fann ekki start button");
  }
}

/**
 * Klárar leik, uppfærir tölfræði og sýnir niðurstöður.
 * @returns {void}
 */
function finish() {
  const results = createResults(state.questions, state.answers);

  state.stats = updateStats(state.stats, results);
  renderStats(state.stats);

  const correctCount = countCorrect(results);
  renderResults(results, correctCount);

  showScreen("results");
}

/**
 * Vistar svar við núverandi spurningu og sýnir næstu, eða niðurstöður ef
 * öllum spurningum hefur verið svarað.
 * @param answer {string}
 * @returns {void}
 */
function submitAnswer(answer) {
  /* TODO skrá stöðu svars, klára ef seinasta spurning, annars sýna næstu */

  state.answers.push(answer);

  const nextQuestionNum = state.current + 1;

  console.log(
    "Svarið notanda er",
    answer,
    "rétt svar er",
    state.questions[state.current - 1].answer,
  );

  if (nextQuestionNum > NUMBER_OF_QUESTIONS) {
    finish();
  } else {
    state.current = nextQuestionNum;
    renderQuestion(
      state.questions[state.current - 1],
      state.current - 1,
      NUMBER_OF_QUESTIONS,
    );
  }
}

/**
 * Fer aftur á upphafsskjá með uppfærðri tölfræði.
 * @returns {void}
 */
function restart() {
  /* TODO sýna upphafsskjá og stöðu */
  start();
}

function initialize() {
  /* TODO finna öll element, tengja form, sýna upphafsstöðu og upphafsskjá */
  start();

  const form = document.querySelector("form");

  if (!form) {
    console.error("form not found");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("form submitted");

    const data = new FormData(form);
    const answer = data.get("answer");

    if (typeof answer !== "string") {
      console.warn("answer is not a string");
      return;
    }

    submitAnswer(answer);
    const input = form.querySelector('input');
    form.reset();
    input?.focus();
  });

  const restartButton = document.querySelector("button.restart-button");

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      showScreen("start");
      restart();
    });
  }
}

window.addEventListener("keyup", () => {
  //console.log('ytt á lykil á lyklaborði', e)
});

initialize();
