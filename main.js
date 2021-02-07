const btn = document.querySelector(".mic");
const content = document.querySelector(".content");

var voiceSelect = document.querySelector("select");
var pitch = document.querySelector("#pitch");
var pitchValue = document.querySelector(".pitch-value");
var rate = document.querySelector("#rate");
var rateValue = document.querySelector(".rate-value");

pitch.onchange = function () {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
  rateValue.textContent = rate.value;
};

try {
  const greetings = [
    "I'm feeling good. Hope you are having a nice day",
    "Doing good today. How are you?",
    "Leave me alone!",
  ];
  const unidentified = [
    "Is that English?",
    "Who are you?",
    "What did you just said?",
  ];

  const synth = window.speechSynthesis;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  function populateVoiceList() {
    voices = synth.getVoices();

    for (i = 0; i < voices.length; i++) {
      if (voices[i].lang.includes("en")) {
        var option = document.createElement("option");
        option.textContent = voices[i].name;

        option.setAttribute("data-lang", voices[i].lang);
        option.setAttribute("data-name", voices[i].name);
        voiceSelect.appendChild(option);
      }
    }
  }

  populateVoiceList();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }

  recognition.onstart = function () {
    content.textContent = "Ehm, Say something now!";
  };

  recognition.onresult = function (event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;

    readOutLoud(transcript);
  };

  btn.addEventListener("click", () => {
    try {
      recognition.start();
    } catch (e) {
      e.toString().includes("recognition has already started")
        ? readOutLoud("Say something! I can hear you!")
        : console.error(error);
    }
  });

  function readOutLoud(message) {
    const speech = new SpeechSynthesisUtterance();
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );
    for (i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        speech.voice = voices[i];
      }
    }

    speech.pitch = pitch.value;
    speech.rate = rate.value;
    speech.text = unidentified[Math.floor(Math.random() * unidentified.length)];

    if (message.includes("how are you")) {
      const finalText = greetings[Math.floor(Math.random() * greetings.length)];
      speech.text = finalText;
    }if (message.includes("Say something! I can hear you!")) {
        speech.text = message;
      }

    window.speechSynthesis.speak(speech);
    content.textContent = message;
  }
} catch (error) {
  console.log(error);
}
