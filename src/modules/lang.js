
import birdsDataEn from './birdsEn';
import birdsDataRu from './birdsRu';
import content from './content';
import { gameFinished, score } from './quiz';

//settings
let settings = document.querySelector('.settings');
let settingsMenu = document.querySelector('.settings-menu');
let languages = document.querySelectorAll('.lang');
let radioBtns = document.querySelectorAll('.custom-radio');
let radioEn = document.querySelector('.english-lang');
let radioRu = document.querySelector('.russian-lang');
let langTitle = document.querySelector('.lang-title');
let langLabels = document.querySelectorAll('label');

let navLinks = document.querySelectorAll('.nav-link');

function showSettings() {
  settingsMenu.classList.toggle('settings-menu-visible');
}

settings.addEventListener('click', showSettings);

//lang choise
export let birds;
export let lang = 'ru';
export let contentTrans;


if (lang === 'ru') {
  birds = birdsDataRu;
} else {
  birds = birdsDataEn;
}

export function changeLang() {
  languages.forEach((language, index) => {
    language.onclick = function () {

      if (navLinks[0].classList.contains('link-active')) {
        document.location.reload();
      }
      if (navLinks[1].classList.contains('link-active')) {
        alert('If you change the language game will be reloaded and progress will not be saved');
        document.location.reload();
      }
      if(gameFinished) {
        let navLinksUpd = document.querySelectorAll('.nav-link');
        let resultText = document.querySelector('.results-text');
        if(localStorage.getItem('9fogelSettings') === 'ru' || lang === 'ru') {
              navLinksUpd[3].textContent = 'Результаты';
              resultText.textContent = `Вы прошли игру и набрали ${score} баллов из 30 возможных`;
            } else {
              navLinksUpd[3].textContent = 'Results';
              resultText.textContent = `You passed the game and got ${score} points out of 30`;
            }
      }
      radioBtns.forEach((radio) => {
        if (radio.hasAttribute('checked')) {
          radio.removeAttribute('checked');
          radio.classList.remove('checked');
        }
      });
      radioBtns[index].setAttribute('checked', 'checked');
      radioBtns[index].classList.add('checked');
      lang = radioBtns[index].value;
      setLocalStorageSettings();
      getLocalStorageSettings();
      if (lang === 'ru') {
        console.log('langLang', lang);
        birds = birdsDataRu;
      } else {
        console.log('langLang', lang);
        birds = birdsDataEn;
      }
    }
  });
}

changeLang();


window.addEventListener('beforeunload', setLocalStorageSettings);
window.addEventListener('load', getLocalStorageSettings);

function setLocalStorageSettings() {
  localStorage.setItem('9fogelSettings', lang);
}

export function getLocalStorageSettings() {
  if(localStorage.getItem('9fogelSettings')) {
    lang = localStorage.getItem('9fogelSettings');
  } else {
    lang = 'ru';
  }
  if(lang === 'ru') {
    radioRu.classList.add('checked');
    radioEn.classList.remove('checked');
    radioRu.setAttribute('checked', 'checked');
    radioEn.removeAttribute('checked');
    translateToRu();
  }
  if(lang === 'en') {
    radioRu.classList.remove('checked');
    radioEn.classList.add('checked');
    radioEn.setAttribute('checked', 'checked');
    radioRu.removeAttribute('checked');
    translateToEn();
  }
}

let introTitle = document.querySelector('.intro-title');
let introText1 = document.querySelectorAll('.intro-text')[0];
let introText2 = document.querySelectorAll('.intro-text')[1];
let startBtn = document.querySelector('.intro-button');
let scoreText = document.querySelector('.score');
let levelItems = document.querySelectorAll('.level-item');
let playerDesc = document.querySelectorAll('.bird-desc');
let nextBtns = document.querySelectorAll('.next-button');
let congrats = document.querySelector('.congrats-text');
let resultsText = document.querySelector('.results-text');
let resultsBtn = document.querySelector('.results-button');

function translateToRu() {
  contentTrans = content.ru;
  birds = birdsDataRu;
  langTitle.textContent = 'Выберите язык';
  langLabels[0].textContent = 'Английский';
  langLabels[1].textContent = 'Русский';
  replaceWithTranslation('ru');
}

function translateToEn() {
  contentTrans = content.en;
  birds = birdsDataEn;
  langTitle.textContent = 'Language';
  langLabels[0].textContent = 'English';
  langLabels[1].textContent = 'Russian';
  replaceWithTranslation('en');
}

function replaceWithTranslation() {
  navLinks[0].textContent = contentTrans.nav.about;
  navLinks[1].textContent = contentTrans.nav.quiz;
  navLinks[2].textContent = contentTrans.nav.gallery;
  if(navLinks[3]) {
    navLinks[2].textContent = contentTrans.nav.results;
  }

  introTitle.textContent = contentTrans.aboutPage.title;
  introText1.textContent = contentTrans.aboutPage.text1;
  introText2.textContent = contentTrans.aboutPage.text2;
  startBtn.textContent = contentTrans.aboutPage.startBtn;

  levelItems[0].textContent = contentTrans.quizPage.level1;
  levelItems[1].textContent = contentTrans.quizPage.level2;
  levelItems[2].textContent = contentTrans.quizPage.level3;
  levelItems[3].textContent = contentTrans.quizPage.level4;
  levelItems[4].textContent = contentTrans.quizPage.level5;
  levelItems[5].textContent = contentTrans.quizPage.level6;
  playerDesc.innerHTML = contentTrans.quizPage.playerDesc;
  nextBtns[0].textContent = contentTrans.quizPage.nextBtn;
  nextBtns[1].textContent = contentTrans.quizPage.nextBtn;

  congrats.textContent = contentTrans.resultsPage.congrats;
  // resultsText.textContent = contentTrans.resultsPage.resultsText;
  resultsBtn.textContent = contentTrans.resultsPage.resultsBtn;
}