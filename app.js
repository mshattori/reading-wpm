const textArea = document.querySelector('textarea');
const textDisplay = document.querySelector('#text-display');
const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const resultDiv = document.querySelector('#result');

let startTime;
let wordCount;

textArea.addEventListener('input', updateTextDisplay);

startBtn.addEventListener('click', startTest);
stopBtn.addEventListener('click', stopTest);
cancelBtn.addEventListener('click', cancelTest);

function updateTextDisplay() {
    textDisplay.textContent = textArea.value;
}

function startTest() {
    startTime = new Date().getTime();
    wordCount = countWords(textArea.value);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    cancelBtn.disabled = false;
}

function stopTest() {
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
    const wpm = calculateWPM(wordCount, elapsedTime);

    resultDiv.textContent = `Your reading speed is ${wpm} words per minute.`;

    startBtn.disabled = false;
    stopBtn.disabled = true;
    cancelBtn.disabled = true;
}

function cancelTest() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    cancelBtn.disabled = true;
    resultDiv.textContent = '';
}

function countWords(text) {
    const words = text.trim().split(/\s+/);
    return words.length;
}

function calculateWPM(wordCount, elapsedTime) {
    const wordsPerMinute = wordCount / (elapsedTime / 60);
    return Math.round(wordsPerMinute);
}