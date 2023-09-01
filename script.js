const errorMessageElem = document.getElementById("errorMessage");
const progressElem = document.getElementById("progress");
const progressInnerElem = document.getElementById("progress-inner");
const progressBarWidth = 100; 
let progressInterval;

function clearErrorMessage() {
    errorMessageElem.textContent = "";
}

function showError(message) {
    errorMessageElem.textContent = message;
}

function showProgressBar() {
    let progress = 0;
    const step = progressBarWidth / 100;
    let progressInterval;

    progressElem.style.display = "block";
    progressInnerElem.style.width = "0%";

    progressInterval = setInterval(() => {
        if (progress >= progressBarWidth) {
            clearInterval(progressInterval);
        } else {
            progress += step;
            progressInnerElem.style.width = `${progress}%`;
        }
    }, 1000);
}

function hideProgressBar() {
    clearInterval(progressInterval);
    progressElem.style.display = "none";
    progressInnerElem.style.width = "0";
}

function validateForm() {
    clearErrorMessage();
    
    const limit = document.getElementById("limit").value;
    const departure = document.getElementById("departure").value;
    const currency = document.getElementById("currency").value;
    const arrival = document.getElementById("arrival").value;
    const email = document.getElementById("email").value;
    
    if (limit <= 0) {
        showError("Limit must be a positive number");
        return false;
    }
    
    if (!departure) {
        showError("Please select a departure airport");
        return false;
    }
    
    if (!currency) {
        showError("Please select a currency");
        return false;
    }
    
    if (arrival === departure) {
        showError("Arrival airport cannot be equal to departure airport");
        return false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (email && !emailPattern.test(email)) {
        showError("Please enter a valid email address");
        return false;
    }
    
    return true;
}

function generateRandomKey() {
    const randomString = Math.random().toString(36).substring(2);
    const currentTime = new Date().getTime();
    const randomKey = `${randomString}-${currentTime}`;
    return randomKey;
}

function checkLocalStorage() {
    const localStorageKey = "ifly-user";
    const existingValue = localStorage.getItem(localStorageKey);

    console.log("ifly-user")
    console.log(existingValue)
  
    if (!existingValue || existingValue.trim() === "") {
      const randomKey = generateRandomKey();
      localStorage.setItem(localStorageKey, randomKey);
      return randomKey;
    } else {
      return existingValue;
    }
}

async function findAdventure() {
    if (validateForm()) {
        const limit = document.getElementById("limit").value;
        const departure = document.getElementById("departure").value;
        const currency = document.getElementById("currency").value;
        const arrival = document.getElementById("arrival").value;
        const email = document.getElementById("email").value;
        const returnTicket = document.getElementById("returnTicket").checked;

        const userKey = checkLocalStorage();

        console.log("Limit:", limit);
        console.log("Departure:", departure);
        console.log("Currency:", currency);
        console.log("Arrival:", arrival);
        console.log("Email:", email);
        console.log("Return Ticket:", returnTicket);

        console.log("User Key:", userKey);
        
        showProgressBar();
        setTimeout(() => {
            displayResult()
            hideProgressBar();
        }, 20000);
    }
}

const findAdventureButton = document.getElementById("findAdventure");
findAdventureButton.addEventListener("click", findAdventure);

function displayResult() {
    // Add code to display results in clickable cards
}

function isMacOSOrWindows() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('macintosh') || userAgent.includes('windows');
}

function mobileOrWeb() {
    if (!isMacOSOrWindows()) {
        // Select the body element and increase the base font size
        document.body.style.fontSize = '175%';

        // Select and increase the font size for headings
        var headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(function(heading) {
            heading.style.fontSize = '82px';
        });

        // Select and increase the size of form elements
        var formControls = document.querySelectorAll('.form-control');
        formControls.forEach(function(control) {
            control.style.fontSize = '175%';
            control.style.padding = '10px';
        });

        // Select and increase the size of buttons
        var buttons = document.querySelectorAll('.btn');
        buttons.forEach(function(button) {
            button.style.fontSize = '175%';
            button.style.padding = '10px 20px';
        });

        // Select and increase the size of checkboxes and labels
        var formCheckInputs = document.querySelectorAll('.form-check-input');
        var formCheckLabels = document.querySelectorAll('.form-check-label');
        formCheckInputs.forEach(function(input) {
            input.style.fontSize = '175%';
            input.style.height = '100%';
            input.style.width = '10%';
            input.style.transform = 'scale(1)';
        });
        formCheckLabels.forEach(function(label) {
            label.style.marginLeft = '10%';
        });

        // Increase the size of the error message text
        var errorMessage = document.getElementById('errorMessage');
        errorMessage.style.fontSize = '175%';

    }
}

mobileOrWeb();
