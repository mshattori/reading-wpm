// Cordova device APIs are available after the `deviceready` event
// Ref. https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    if (window.cordova) {
        console.log('cordova-' + cordova.platformId + '@' + cordova.version);
        document.getElementById('cordova-css').disabled = false;
    }
}

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
textArea.addEventListener('paste', onPaste);
saveBtn.addEventListener('click', updateTextDisplayOrEdit);
triggerBtn.addEventListener('click', trigger);
cancelBtn.addEventListener('click', cancel);

function isTouchDevice() {
    // devices that correspond to `pointer: coarse` are primarily operated using fingers,
    // such as smartphones and tablets.
    return (window.matchMedia('(pointer: coarse)').matches)
}

function onKeydown(e) {
    if (isTouchDevice()) {
        return;
    }
    // you can put new-lines with shift-key
    if (e.key === 'Enter' && e.shiftKey == false) {
        e.preventDefault();
        updateTextDisplay();
    }
}

function onPaste(e) {
    if (isTouchDevice() == false) {
        return;
    }
    setTimeout(updateTextDisplay, 0); // Call updateTextDisplay after paste event is processed
}

function updateTextDisplayOrEdit() {
    if (saveBtn.textContent === 'Save') {
        updateTextDisplay();
    } else {
        editTextDisplay();
    }
}

function updateTextDisplay() {
    if (textArea.value.trim() !== '') {
        // Preserve line breaks
        textDisplay.innerHTML = textArea.value.replace(/\n/g, '<br>');
        toggleDisplay(textArea);
        toggleDisplay(textDisplay);
        saveBtn.textContent = 'Edit';
        triggerBtn.disabled = false;
        cancelBtn.disabled = false;
    }
}

function editTextDisplay() {
    toggleDisplay(textArea);
    toggleDisplay(textDisplay);
    saveBtn.textContent = 'Save';
    triggerBtn.disabled = true;
    cancelBtn.disabled = true;
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
    saveBtn.disabled = true
}

function stopTest() {
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
    const wpm = calculateWPM(wordCount, elapsedTime);

    const seconds = Math.floor(elapsedTime);

    triggerBtn.textContent = 'Start';
    cancelBtn.textContent = 'Clear';
    saveBtn.disabled = false

    if (window.cordova) {
        function onConfirm(buttonIndex) {}

        const title = `Reading speed: ${wpm} wpm`;
        const message = `(${wordCount} words / ${seconds} seconds)`;
        navigator.notification.confirm(message, onConfirm, title, ['OK']);
    } else {
        resultDiv.innerHTML = `Reading speed: ${wpm} wpm<br>(${wordCount} words / ${seconds} seconds)`;
    }
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
    saveBtn.textContent = 'Save';
    saveBtn.disabled = false;
    triggerBtn.disabled = true;
    cancelBtn.disabled = true;
}

function cancelTest() {
    triggerBtn.textContent = 'Start';
    cancelBtn.textContent = 'Clear';
    saveBtn.disabled = false
}

function countWords(text) {
    // filter slashes to support slash-reading texts
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
