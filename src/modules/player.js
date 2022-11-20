import { soundMainUrl, soundInfoUrl } from './quiz';

const playBtn = document.querySelector('.play-button');
const playBtnInfo = document.querySelector('.info-play-button');

const soundMuteBtn = document.querySelector('.sound-mute');
const soundRangeInput = document.querySelector('.sound-range');

const currentDuration = document.querySelector('.current-duration');
const totalDuration = document.querySelector('.total-duration');
const currentDurationInfo = document.querySelector('.info-current-duration');
const totalDurationInfo = document.querySelector('.info-total-duration');
const playRange = document.querySelector('.play-range');
const playRangeInfo = document.querySelector('.info-play-range');

let isPlay1 = false;
let isPlay2 = false;

let audioMain;
let audioInfo;

export function initPlayer() {
  if(audioMain && isPlay1) {
    pausePlayer();
    isPlay1 = false;
  }
  if(audioInfo && isPlay2) {
    pausePlayerInfo();
    isPlay2 = false;
  }
  audioMain = new Audio(soundMainUrl);
  // console.log(audioMain);
  isPlay1 = false;
  playBtn.classList.remove('pause-icon');
  audioMain.volume = localStorage.getItem('9fogelVolume') || 0.3;
  soundRangeInput.value = audioMain.volume * 100;
  setVolume();
}

export function initPlayerInfo() {
  if(audioInfo && isPlay2) {
    pausePlayerInfo();
    isPlay2 = false;
  }
  audioInfo = new Audio(soundInfoUrl);
  // console.log(audioInfo);
  isPlay2 = false;
  playBtnInfo.classList.remove('pause-icon');
  audioInfo.volume = localStorage.getItem('9fogelVolume') || 0.3;
}

export function pausePlayer() {
  if(audioMain) {
    audioMain.pause();
    playBtn.classList.remove('pause-icon');
    isPlay1 = false;
  }
}

export function pausePlayerInfo() {
  if(audioInfo) {
    audioInfo.pause();
    playBtnInfo.classList.remove('pause-icon');
    isPlay2 = false;
  }
}

function loadPlayer() {
  audioMain.load();
}

function loadPlayerInfo() {
  audioInfo.load();
  isPlay2 = false;
}
const answerList = document.querySelector('.answer-list');
answerList.addEventListener('click', loadPlayerInfo);

function setDefaultTime() {
  playRange.value = 0;
  audioMain.currentTime = 0;
  currentDuration.textContent = '0:00'
  totalDuration.textContent = '0:00'
}

const nextBtn = document.querySelector('.next-button');
nextBtn.addEventListener('click', loadPlayer);

  function play() {
    showTrackProgress();
    // setDefaultTime();
    if(!isPlay1 && !isPlay2) {
      audioMain.play();
      isPlay1 = true;
      playBtn.classList.toggle('pause-icon');
    } else {
      if(isPlay1) {
        pausePlayer();
      } else {
        pausePlayerInfo();
        audioMain.play();
        isPlay1 = true;
        playBtn.classList.toggle('pause-icon');
      }
    }
    audioMain.addEventListener('ended', () => {//когда доиграет до конца трека
      playBtn.classList.remove('pause-icon');
      isPlay1 = false;
    });
  }

  playBtn.addEventListener('click', play);


function playInfo() {
  showTrackProgressInfo();
  if(!isPlay2 && !isPlay1) {
    audioInfo.play();
    isPlay2 = true;
    playBtnInfo.classList.toggle('pause-icon');
  } else {
    if(isPlay2) {
      pausePlayerInfo();
    } else {
      pausePlayer();
      audioInfo.play();
      isPlay2 = true;
      playBtnInfo.classList.toggle('pause-icon');
    }
  }
  audioInfo.addEventListener('ended', () => {//когда доиграет до конца трека
  playBtnInfo.classList.remove('pause-icon');
  isPlay2 = false;
  });
}

playBtnInfo.addEventListener('click', playInfo);


function fillTrackTime(audio, curDur, totalDur, playR) {
  let duration = audio.duration;
  let currentTime = audio.currentTime;

  let progress = (currentTime / duration) * playR.max;
  playR.value = progress ? progress : 0;
  let curMin = Math.floor(currentTime / 60) || '0';
  let curSec = Math.floor(currentTime % 60) || '00';
  let durMin = Math.floor(duration / 60) || '0';
  let durSec = Math.floor(duration % 60) || '00';

  curDur.textContent = `${curMin}:${String(curSec).padStart(2, 0)}`;
  totalDur.textContent = `${durMin}:${String(durSec).padStart(2, 0)}`;
}

function showTrackProgress() {
  audioMain.addEventListener('timeupdate', fillTrackTime(audioMain, currentDuration, totalDuration, playRange));
  playRange.addEventListener('change', () => {
  let progress = playRange.value;
  audioMain.currentTime = (progress / 1000) * audioMain.duration;
  });
  setTimeout(showTrackProgress, 1000);
}

function showTrackProgressInfo() {
  audioInfo.addEventListener('timeupdate', fillTrackTime(audioInfo, currentDurationInfo, totalDurationInfo, playRangeInfo));
  playRangeInfo.addEventListener('change', () => {
  let progress = playRangeInfo.value;
  audioInfo.currentTime = (progress / 1000) * audioInfo.duration;
  });
  setTimeout(showTrackProgressInfo, 1000);
}

function setVolume() {
  soundRangeInput.addEventListener('input', () => {
      let soundValue = soundRangeInput.value;
      audioMain.volume = soundValue / 100;
      if(audioInfo) {
        audioInfo.volume = audioMain.volume;
      }
  });

soundMuteBtn.addEventListener('click', () => {
  if (audioMain.volume) {//если у аудио есть громкость
    localStorage.setItem('9fogelVolume', audioMain.volume);
    audioMain.volume = 0;
    if(audioInfo) {
      audioInfo.volume = 0;
    }
    soundMuteBtn.classList.remove('sound-on');
    soundMuteBtn.classList.add('sound-off');//убрать ховер как с answeritems
    soundRangeInput.value = 0;
    } else {
      audioMain.volume = localStorage.getItem('9fogelVolume');
      if(audioInfo) {
        audioInfo.volume = audioMain.volume;
      }
      soundMuteBtn.classList.remove('sound-off');
      soundMuteBtn.classList.add('sound-on');//TODO: убрать ховер как с answer-items или другой ховер?
      soundRangeInput.value = audioMain.volume * 100;
    }
  });
}