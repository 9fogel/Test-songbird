import content from './content';
import correctSound from '../sound/sound-correct.mp3';
import wrongSound from '../sound/sound-wrong.mp3';

import { birds, lang, changeLang, getLocalStorageSettings } from './lang';
import { getRandomArr } from './random';
import { addResultsNav, setResultsPageActive, restartGame } from './nav';
import { initPlayer, initPlayerInfo, pausePlayer } from './player';

export let score;
export let soundMainUrl;
export let soundInfoUrl;

let randomArr = getRandomArr();
let level = 0;
score = 0;
let maxScore = 30;
let points = 5;
let scoreWrap = document.querySelector('.score');
let levelNavItems = document.querySelectorAll('.level-item');
let nextBtns = document.querySelectorAll('.next-button');
let playAgainBtn = document.querySelector('.results-button');

let birdNames = document.querySelectorAll('.bird-name');
let birdNameLatin = document.querySelector('.bird-name-latin');
let players = document.querySelectorAll('.player');
let birdDesc = document.querySelector('.bird-desc');
let birdImgs = document.querySelectorAll('.bird-image');

let answers = document.querySelectorAll('.answer-text');
let answerIcons = document.querySelectorAll('.answer-circle');
let correctAnswer = birds[level][randomArr[level]].name;

let resultsText = document.querySelector('.results-text');

let answerState = false;
export let gameFinished = false;


export let contentTrans;

export function loadGame(score) {
  getLocalStorageSettings();
  checkLang();
  changeLang();
  // document.location.reload();
  setDefaultState(score);
  createAnswersList(level);
  setCorrectAnswer();
}

export function checkLang() {
  if(lang === 'ru') {
  contentTrans = content.ru;
  } else {
  contentTrans = content.en;
  }
}


function createAnswersList(level) {
  getLocalStorageSettings();
  changeLang();
  checkLang();
  answers.forEach((answer, index) => {
    answer.textContent = birds[level][index].name;
  });
}

function setDefaultState(score) {
  getLocalStorageSettings();
  changeLang();
  checkLang();
  correctAnswer = birds[level][randomArr[level]].name;
  scoreWrap.textContent = `${contentTrans.quizPage.score}${score}`;
  nextBtns[0].setAttribute('disabled', 'disabled');
  nextBtns[1].setAttribute('disabled', 'disabled');

  setDefaultBird();
  levelNavItems.forEach((levelItem) => {
    levelItem.classList.remove('level-active');
  });
  levelNavItems[level].classList.add('level-active');
  answerIcons.forEach((answerIcon) => {
    answerIcon.classList.remove('wrong-answer');
    answerIcon.classList.remove('correct-answer');
  });
  answerState = false;
}

function setDefaultBird() {
  birdImgs[0].style.backgroundImage = `url("./assets/images/guess-bird-bg.jpg")`;
  birdNames[0].textContent = '**********';
  birdNames[1].style.display = 'none';
  birdNameLatin.style.display = 'none';
  soundMainUrl = birds[level][randomArr[level]].audio;
  initPlayer();
  birdDesc.innerHTML = contentTrans.quizPage.playerDesc;
  players[1].style.display = 'none';
  birdImgs[1].style.display = 'none';
}

function createCorrectBirdCard(level) {
  birdNames.forEach((birdName) => {
    birdName.textContent = birds[level][randomArr[level]].name;
  });
  birdNameLatin.textContent = birds[level][randomArr[level]].species;
  birdDesc.textContent = birds[level][randomArr[level]].description;
  birdImgs.forEach((img) => {
    img.style.backgroundImage = `url(${birds[level][randomArr[level]].image})`;
  });
  birdNames[1].style.display = 'block';
  birdNameLatin.style.display = 'block';
  players[1].style.display = 'block';
  birdImgs[1].style.display = 'block';
}

function setCorrectAnswer() {
  answers.forEach((answer) => {
    if(answer.textContent === correctAnswer) {
      console.log('correct', answer.textContent);
      answer.classList.add('correct');
    } else {
      answer.classList.add('wrong');
    }
  });
}

export function handleClick() {
  let answerItems = document.querySelectorAll('.answer-item');

  answerItems.forEach((answerItem, index) => {
    answerItem.addEventListener('mouseover', () => {
      answerItem.classList.add('item-hovered');
      answerItem.style.cursor = 'pointer';
    });
    answerItem.addEventListener('mouseout', () => {
      answerItem.classList.remove('item-hovered');
      answerItem.style.cursor = 'default';
    });

    answerItem.addEventListener('click', () => {
      if(answers[index].textContent === correctAnswer) {
        handleClickSound('correct');
        pausePlayer();
        answerIcons[index].classList.add('correct-answer');
        answerItems[index].classList.remove('item-hovered');
        answerItems[index].style.cursor = 'default';
        createCorrectBirdCard(level);
        setCorrectGameState();
        if (level === 5) {
          finishGame();
        }
      } else {
        if (!answerState) {
          answerIcons[index].classList.add('wrong-answer');
          handleClickSound('wrong');
          points--;
        }
        answerItems[index].classList.remove('item-hovered');
        answerItems[index].style.cursor = 'default';
      }
      showBirdInfo(index);
    });
  });
}

function showBirdInfo(index) {
  birdImgs[1].style.backgroundImage = `url(${birds[level][index].image})`;
  birdNames[1].textContent = birds[level][index].name;
  birdNameLatin.textContent = birds[level][index].species;
  birdDesc.textContent = birds[level][index].description;
  soundInfoUrl = birds[level][index].audio;
  initPlayerInfo();
  birdNames[1].style.display = 'block';
  birdNameLatin.style.display = 'block';
  players[1].style.display = 'block';
  birdImgs[1].style.display = 'block';
}

function setCorrectGameState() {
  nextBtns[0].removeAttribute('disabled');
  nextBtns[1].removeAttribute('disabled');
  if (!answerState) {
    score += points;
    scoreWrap.textContent = `${contentTrans.quizPage.score}${score}`;
    points = 5;
  }
  answerState = true;
}

function handleNext() {
  level++;
  loadGame(score);
}

nextBtns[0].addEventListener('click', handleNext);
nextBtns[1].addEventListener('click', handleNext);

function showResults() {
  console.log('go to results page');
  addResultsNav();
  setResultsPageActive();
}

function finishGame() {
  gameFinished = true;
  if(localStorage.getItem('9fogelSettings') === 'ru' || lang === 'ru') {
    nextBtns[0].textContent = 'Посмотреть результаты';
    nextBtns[1].textContent = 'Посмотреть результаты';
  } else {
    nextBtns[0].textContent = 'Show Results';
    nextBtns[1].textContent = 'Show Results';
  }
  nextBtns[0].removeEventListener('click', handleNext);
  nextBtns[1].removeEventListener('click', handleNext);
  nextBtns[0].addEventListener('click', showResults);
  nextBtns[1].addEventListener('click', showResults);
  resultsText.textContent = contentTrans.resultsPage.resultsText1 + `${score}` + contentTrans.resultsPage.resultsText2;
  playAgainBtn.classList.remove('hidden');
  if (score === maxScore) {
    playAgainBtn.classList.add('hidden');
  }
}

function playAgain() {
  restartGame();
  console.log('restart game');
  score = 0;
  level = 0;
  nextBtns[0].removeEventListener('click', showResults);
  nextBtns[1].removeEventListener('click', showResults);
  nextBtns[0].addEventListener('click', handleNext);
  nextBtns[1].addEventListener('click', handleNext);
  gameFinished = false;
  randomArr.length = 0;
  randomArr = getRandomArr();
  nextBtns[0].textContent = 'Следующий уровень';
  nextBtns[1].textContent = 'Следующий уровень';
  loadGame(score);
}

playAgainBtn.addEventListener('click', playAgain);

function handleClickSound(guess) {
  const correctClickSound = new Audio(correctSound);
  const wrongClickSound = new Audio(wrongSound);

  if (guess === 'correct') {
    correctClickSound.play();
  } else {
    wrongClickSound.play();
  }
}

export function resizeWindow() {
  let isLevelCut = false;
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 680 && !isLevelCut) {
      if(lang === 'ru') {
        for (let i = 2; i < levelNavItems.length; i++) {
        console.log(levelNavItems[i].textContent.slice(0, levelNavItems[i].textContent.length - 6));
        levelNavItems[i].textContent = levelNavItems[i].textContent.slice(0, levelNavItems[i].textContent.length - 6);
        isLevelCut = true;
        }
      }
    } else if (window.innerWidth > 680 && isLevelCut) {
      if(lang === 'ru') {
          levelNavItems[2].textContent = contentTrans.quizPage.level3;
          levelNavItems[3].textContent = contentTrans.quizPage.level4;
          levelNavItems[4].textContent = contentTrans.quizPage.level5;
          levelNavItems[5].textContent = contentTrans.quizPage.level6;
          isLevelCut = false;
        }
      }
    });

  window.addEventListener('load', () => {
    if (window.innerWidth <= 680 && !isLevelCut) {
      for (let i = 2; i < levelNavItems.length; i++) {
        console.log(levelNavItems[i].textContent.slice(0, levelNavItems[i].textContent.length - 6));
        levelNavItems[i].textContent = levelNavItems[i].textContent.slice(0, levelNavItems[i].textContent.length - 6);
        isLevelCut = true;
      }
    }
  });
}
