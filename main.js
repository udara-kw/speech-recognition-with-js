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
  const greetings = ["im good", "doing good", "leave me alone"];
  const weather = ["how do i know", "why do you ask me"];
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
      var option = document.createElement("option");
      option.textContent = voices[i].name + " (" + voices[i].lang + ")";

      if (voices[i].default) {
        option.textContent += " -- DEFAULT";
      }

      option.setAttribute("data-lang", voices[i].lang);
      option.setAttribute("data-name", voices[i].name);
      voiceSelect.appendChild(option);
    }
  }

  populateVoiceList();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }

  recognition.onstart = function () {
    console.log("Voice is activated");
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
        ? readOutLoud("You bastard")
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
    }

    window.speechSynthesis.speak(speech);
    content.textContent = message;
  }
} catch (error) {
  console.log(error);
}
