let selectedVoice = 'female'; // default

function selectVoice(voice) {
  selectedVoice = voice;
  document.getElementById("status").innerText = `Selected ${voice} voice`;
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();
  document.getElementById("status").innerText = "Listening...";

  recognition.onresult = async function(event) {
    const userText = event.results[0][0].transcript;
    document.getElementById("status").innerText = `You said: "${userText}"`;

    const aiReply = await getAIResponse(userText);
    speak(aiReply);
  };
}

async function getAIResponse(userInput) {
  const apiKey = "YOUR_OPENAI_API_KEY"; // <-- replace this
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userInput }]
    })
  });

  const data = await res.json();
  const reply = data.choices[0].message.content;
  return reply;
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  const voices = synth.getVoices();

  const voiceName = selectedVoice === 'male' ? 'Google UK English Male' : 'Google UK English Female';
  utter.voice = voices.find(v => v.name === voiceName) || voices[0];

  synth.speak(utter);
}
