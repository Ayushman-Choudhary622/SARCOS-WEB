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
    console.log("Mode set to:", mode); // Debugging
    currentMode = mode;
    currentIndex = 0;

    // Check if the audio element exists
    const modeSound = document.getElementById('mode');
    if (modeSound) {
        console.log("Audio element found:", modeSound); // Debugging
        modeSound.play() // Play the sound
            .then(() => console.log("Sound played successfully")) // Debugging
            .catch((error) => console.error("Error playing sound:", error)); // Debugging
    } else {
        console.error("Audio element with id 'mode' not found!");
    }

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

// Initialize
console.log("App initialized"); // Debugging
