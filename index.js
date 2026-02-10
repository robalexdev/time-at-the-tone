const countdown = document.getElementById("countdown");
const progress = document.getElementById("progress");

let audioContext = null;

const start = new Date();

let setupNextMinute = () => {
  // Jump to the next minute
  now = new Date();
  timeAtTone = new Date(now);

  timeAtTone.setMilliseconds(0);
  timeAtTone.setSeconds(0);
  timeAtTone.setMinutes(now.getMinutes() + 1);

  // How long until we need to play the tone
  const delayMs = timeAtTone.getTime() - now.getTime();
  playTone(3000, delayMs / 1000);

  if (delayMs > 3000) {
    // 3 2 1 ...
    playTone(2200, (delayMs - 3000) / 1000);
    playTone(2200, (delayMs - 2000) / 1000);
    playTone(2200, (delayMs - 1000) / 1000);
  }

  if (delayMs > 10000) {
    if (!! audioContext) {
      setTimeout(() => { sayTime(timeAtTone); }, delayMs - 10000);
    }
  }
  
  if (delayMs > 30000) {
    if (!! audioContext) {
      setTimeout(() => { sayTime(timeAtTone); }, 5000);
    }
  }

  const options = { timeStyle: "short" };
  document.getElementById("time-will-be").innerText = timeAtTone.toLocaleTimeString(navigator.language, options);
};

let triggerSet = false;

let tick = () => {
  const now = new Date();
  if (now > timeAtTone) {
    setupNextMinute();
  }

  progress.value = 60000 - (timeAtTone.getTime() - now.getTime());

  // This needs to be somewhat fast for the progress bar
  setTimeout(tick, 1000/60);
};

let mainGainNode = null;

const playTone = (freq, delaySeconds) => {
  if (!! audioContext) {
    const tickOscillator = audioContext.createOscillator();
    tickOscillator.connect(mainGainNode);
    tickOscillator.type = "sine";
    tickOscillator.frequency.value = freq;
    const now = audioContext.currentTime;
    if (delaySeconds > 0.05) {
      // Start and end such that the middle of the tone aligns with the new second
      // Scheduling using the audio context should be most precise
      tickOscillator.start(now + delaySeconds - 0.05);
      tickOscillator.stop(now + delaySeconds + 0.05);
    }
  }
};

const timeToText = (time) => {
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var amPm = "A.M.";
  if (hours == 0) {
    if (minutes == 0) {
        return "12 oh clock, midnight";
    }
    hours = "12";
  } else if (hours == 12) {
    if (minutes == 0) {
        return "12 oh clock, noon";
    }
    hours = "12";
  } else if (hours > 12) {
    hours = String(hours - 12);
    amPm = "P.M.";
  }

  if (minutes == 0) {
    minutes = "oh clock";
  } else if (minutes < 10) {
    minutes = "oh " + String(minutes);
  } else {
    minutes = String(minutes);
  }

  return hours + " " + minutes + " " + amPm;
};

const sayTime = (time) => {
  if (!! audioContext) {
    var msg = new SpeechSynthesisUtterance();
    msg.text = "At the tone, the time will be: " + timeToText(time);
    window.speechSynthesis.speak(msg);
  }
};

const requestAudioButton = document.getElementById("request-audio-button");
requestAudioButton.addEventListener("click", (event) => {
  const topOfMinuteActionElement = document.getElementById("top-of-minute-action");
  topOfMinuteActionElement.innerText = "At the tone, the time will be: ";

  const requestAudioElement = document.getElementById("request-audio");
  requestAudioElement.style = "display: none";

  audioContext = new AudioContext();
  mainGainNode = audioContext.createGain();
  mainGainNode.connect(audioContext.destination);
  mainGainNode.gain.value = 1.0;

  // Re-initialize
  setupNextMinute();
});

setupNextMinute();
setTimeout(tick, 1);

