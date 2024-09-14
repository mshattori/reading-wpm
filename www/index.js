const textArea = document.querySelector('textarea');
const textDisplay = document.querySelector('#text-display');
const saveBtn = document.querySelector('#save-btn');
const triggerBtn = document.querySelector('#trigger-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const resultDiv = document.querySelector('#result');

let isTestRunning = false;
let startTime;
let wordCount;

textArea.addEventListener('keydown', onKeydown);
saveBtn.addEventListener('click', updateTextDisplay);
triggerBtn.addEventListener('click', trigger);
cancelBtn.addEventListener('click', cancel);

function onKeydown(e) {
    if (window.matchMedia('(max-width: 600px)').matches) {
        return;
    }
    if (e.key === 'Enter' && e.shiftKey == false) {
        e.preventDefault();
        updateTextDisplay();
    }
}

function updateTextDisplay() {
    if (textArea.value.trim() !== '') {
        // Preserve line breaks
        textDisplay.innerHTML = textArea.value.replace(/\n/g, '<br>');
        toggleDisplay(textArea);
        toggleDisplay(textDisplay);
        saveBtn.disabled = true;
        triggerBtn.disabled = false;
        cancelBtn.disabled = false;
    }
}

function trigger() {
    if (!isTestRunning) {
        startTest();
        isTestRunning = true;
    } else {
        stopTest();
        isTestRunning = false;
    }
}

function startTest() {
    startTime = new Date().getTime();
    wordCount = countWords(textArea.value);

    triggerBtn.textContent = 'Stop';
    cancelBtn.textContent = 'Cancel';
    resultDiv.textContent = '';
}

function stopTest() {
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
    const wpm = calculateWPM(wordCount, elapsedTime);

    seconds = Math.floor(elapsedTime)
    resultDiv.textContent = `Reading speed: ${wpm} wpm (${wordCount} words / ${seconds} seconds)`;

    triggerBtn.textContent = 'Start';
    cancelBtn.textContent = 'Clear';
}

function cancel() {
    if (!isTestRunning) {
        clearText();
    } else {
        cancelTest();
        isTestRunning = false;
    }
}

function clearText() {
    textArea.value = '';
    textDisplay.textContent = '';
    resultDiv.textContent = '';
    toggleDisplay(textArea);
    toggleDisplay(textDisplay);
    saveBtn.disabled = false;
    triggerBtn.disabled = true;
    cancelBtn.disabled = true;
}

function cancelTest() {
    triggerBtn.textContent = 'Start';
    cancelBtn.textContent = 'Clear';
}

function countWords(text) {
    const words = text.trim().split(/\s+/).filter(word => word !== '/');
    return words.length;
}

function calculateWPM(wordCount, elapsedTime) {
    const wordsPerMinute = wordCount / (elapsedTime / 60);
    return Math.round(wordsPerMinute);
}

function toggleDisplay(element) {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
}