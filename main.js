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

    // Show/hide doubt input and quiz answers
    const doubtInput = document.getElementById('doubt-input');
    const quizAnswers = document.getElementById('quiz-answers');
    if (mode === 'doubt') {
        doubtInput.classList.remove('hidden');
        quizAnswers.classList.add('hidden');
    } else if (mode === 'quiz') {
        doubtInput.classList.add('hidden');
        quizAnswers.classList.remove('hidden');
    } else {
        doubtInput.classList.add('hidden');
        quizAnswers.classList.add('hidden');
    }

    // Check if the audio element exists
    const modeSound = document.getElementById('mode');
    if (modeSound) {
        modeSound.play(); // Play the sound
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
            content = q.question;
            showQuizAnswers(q.options, q.answer);
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
            content = "Type your doubt in the box below and click Submit.";
            break;
    }

    document.getElementById('display').innerText = content;
    speak(content); // Speak the content
}

// Show Quiz Answer Buttons
function showQuizAnswers(options, correctIndex) {
    console.log("Showing quiz answers:", options); // Debugging
    const quizAnswers = document.getElementById('quiz-answers');
    quizAnswers.innerHTML = ""; // Clear previous buttons

    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.innerText = option;
        button.onclick = () => checkAnswer(index, correctIndex);
        quizAnswers.appendChild(button);
    });
}

// Check Quiz Answer
function checkAnswer(selectedIndex, correctIndex) {
    const alertSound = document.getElementById('alert');
    const successSound = document.getElementById('success');

    if (selectedIndex === correctIndex) {
        document.getElementById('display').innerText = "Correct! 🎉";
        speak("Correct! 🎉"); // Speak the result
        successSound.play();
    } else {
        document.getElementById('display').innerText = "Wrong! ❌";
        speak("Wrong! ❌"); // Speak the result
        alertSound.play();
    }
}

// Navigation Functions
function next() {
    if (currentMode === null) return;
    currentIndex++;
    speakContent();
}

function previous() {
    if (currentMode === null) return;
    currentIndex--;
    if (currentIndex < 0) currentIndex = 0; // Prevent negative index
    speakContent();
}

// Doubt Mode Handler
async function submitDoubt() {
    const doubtText = document.getElementById('doubt-text').value;
    if (!doubtText) return;

    try {
        const ddgResponse = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(doubtText)}&format=json`);
        const ddgData = await ddgResponse.json();
        
        let answerText = "";
        if (ddgData.AbstractText) {
            answerText = ddgData.AbstractText;
        } else {
            answerText = "Sorry, I couldn't find an answer.";
        }

        document.getElementById('display').innerText = answerText;
        speak(answerText); // Speak the answer
    } catch {
        document.getElementById('display').innerText = "Connection error!";
        speak("Connection error!"); // Speak the error
    }
}

// Initialize
console.log("App initialized"); // Debugging
