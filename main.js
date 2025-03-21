// Content Databases
const storyDB = [
    "In 2035, AR robots became teachers. Sarcos was the most advanced AI educator!",
    "Sarcos could project holographic lessons. Students learned about space through 3D simulations!",
    "The robot's knowledge database connected to all human knowledge through quantum networks!"
];

const quizDB = [
    {
        question: "What's the capital of France?",
        options: ["London", "Paris", "Berlin"],
        answer: 1 // Index of the correct answer (Paris is at index 1)
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter"],
        answer: 1 // Mars is at index 1
    }
];

const factsDB = [
    "The Eiffel Tower can grow taller in summer due to thermal expansion!",
    "Octopuses have three hearts!",
    "Bananas are berries, but strawberries aren't!"
];

const languageDB = {
    french: ["Hello = Bonjour", "Goodbye = Au revoir", "Thank you = Merci"],
    german: ["Hello = Hallo", "Goodbye = Auf Wiedersehen", "Thank you = Danke"]
};

const lifeLessonsDB = [
    "Always believe in yourself, even when others doubt you.",
    "Failure is not the opposite of success; it's part of success.",
    "The only way to do great work is to love what you do."
];

let currentMode = null;
let currentIndex = 0;

// Text-to-Speech Function
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

// Mode Handlers
function setMode(mode) {
    currentMode = mode;
    currentIndex = 0;
    document.getElementById('mode').play(); // Play mode sound
    speakContent();
}

function speakContent() {
    let content = "";

    switch (currentMode) {
        case 'story':
            content = storyDB[currentIndex % storyDB.length];
            break;
        case 'quiz':
            const q = quizDB[currentIndex % quizDB.length];
            content = `${q.question}. Options are: ${q.options.join(', ')}`;
            break;
        case 'facts':
            content = factsDB[currentIndex % factsDB.length];
            break;
        case 'language':
            const lang = currentIndex % 2 === 0 ? 'french' : 'german';
            content = `Here are some ${lang} phrases: ${languageDB[lang].join(', ')}`;
            break;
        case 'life':
            content = lifeLessonsDB[currentIndex % lifeLessonsDB.length];
            break;
        case 'doubt':
            content = "Ask your question...";
            break;
    }

    document.getElementById('display').innerText = content;
    speak(content); // Speak the content
}

// Voice Control
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.lang = 'en-US';

recognition.onresult = async (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.toLowerCase();
    console.log("Voice input detected:", transcript);

    if (currentMode === null) return;

    if (transcript.includes('next')) {
        currentIndex++;
        speakContent();
    } else if (currentMode === 'quiz') {
        const q = quizDB[currentIndex % quizDB.length];
        const answer = parseInt(transcript) - 1;
        const correct = answer === q.answer;
        if (correct) {
            speak("Correct! 🎉");
            currentIndex++;
            speakContent();
        } else {
            speak("Wrong! ❌");
        }
    } else if (currentMode === 'doubt') {
        handleQuestion(transcript);
    }
};

// Question Answering System (DuckDuckGo)
async function handleQuestion(question) {
    try {
        const ddgResponse = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(question)}&format=json`);
        const ddgData = await ddgResponse.json();
        
        if (ddgData.AbstractText) {
            showAnswer(ddgData.AbstractText);
        } else {
            showAnswer("Sorry, I couldn't find an answer.");
        }
    } catch {
        showAnswer("Connection error!");
    }
}

function showAnswer(text) {
    document.getElementById('display').innerText = text;
    speak(text); // Speak the answer
}

// Initialize
recognition.start();