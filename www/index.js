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
const triggerBtn = document.querySelector('#trigger-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const resultDiv = document.querySelector('#result');

let isTestRunning = false;
let startTime;
let wordCount;

textArea.addEventListener('input', updateControlState);
triggerBtn.addEventListener('click', trigger);
cancelBtn.addEventListener('click', cancel);
updateControlState();

function trigger() {
    if (!isTestRunning) {
        if (!hasInputText()) {
            updateControlState();
            return;
        }

        showReadingView();
        isTestRunning = true;
        startTest();
    } else {
        isTestRunning = false;
        stopTest();
    }
}

function startTest() {
    startTime = new Date().getTime();
    wordCount = countWords(textArea.value);

    triggerBtn.textContent = 'Stop';
    cancelBtn.textContent = 'Cancel';
    resultDiv.textContent = '';
    updateControlState();
}

function stopTest() {
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
    const wpm = calculateWPM(wordCount, elapsedTime);

    const seconds = Math.floor(elapsedTime);

    triggerBtn.textContent = 'Start';
    cancelBtn.textContent = 'Clear';
    showEditingView();
    updateControlState();

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
        isTestRunning = false;
        cancelTest();
    }
}

function clearText() {
    textArea.value = '';
    textDisplay.textContent = '';
    resultDiv.textContent = '';
    showEditingView();
    updateControlState();
}

function cancelTest() {
    triggerBtn.textContent = 'Start';
    cancelBtn.textContent = 'Clear';
    showEditingView();
    updateControlState();
}

function countWords(text) {
    const trimmedText = text.trim();
    if (trimmedText === '') {
        return 0;
    }

    // filter slashes to support slash-reading texts
    const words = trimmedText.split(/\s+/).filter(word => word !== '/');
    return words.length;
}

function calculateWPM(wordCount, elapsedTime) {
    const wordsPerMinute = wordCount / (elapsedTime / 60);
    return Math.round(wordsPerMinute);
}

function hasInputText() {
    return textArea.value.trim() !== '';
}

function showReadingView() {
    textDisplay.textContent = textArea.value;
    textArea.style.display = 'none';
    textDisplay.style.display = 'block';
}

function showEditingView() {
    textArea.style.display = 'block';
    textDisplay.style.display = 'none';
}

function updateControlState() {
    const hasText = hasInputText();

    triggerBtn.disabled = !isTestRunning && !hasText;
    cancelBtn.disabled = !isTestRunning && !hasText;
}
