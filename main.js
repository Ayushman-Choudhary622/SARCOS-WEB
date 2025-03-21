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

// Mode Handlers
function setMode(mode) {
    console.log("Mode set to:", mode); // Debugging
    currentMode = mode;
    currentIndex = 0;

    // Show/hide doubt input
    const doubtInput = document.getElementById('doubt-input');
    if (mode === 'doubt') {
        doubtInput.classList.remove('hidden');
    } else {
        doubtInput.classList.add('hidden');
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
            content = "Type your doubt in the box below and click Submit.";
            break;
    }

    document.getElementById('display').innerText = content;
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
        
        if (ddgData.AbstractText) {
            document.getElementById('display').innerText = ddgData.AbstractText;
        } else {
            document.getElementById('display').innerText = "Sorry, I couldn't find an answer.";
        }
    } catch {
        document.getElementById('display').innerText = "Connection error!";
    }
}

// Initialize
console.log("App initialized"); // Debugging
