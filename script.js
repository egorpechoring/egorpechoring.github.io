const errorMessageElem = document.getElementById("errorMessage");
const progressElem = document.getElementById("progress");
const progressInnerElem = document.getElementById("progress-inner");
const progressBarWidth = 500; // Width of the progress bar (in pixels)
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
    progressInnerElem.style.width = "0";

    progressInterval = setInterval(() => {
        if (progress >= progressBarWidth) {
            clearInterval(progressInterval);
        } else {
            progress += step;
            progressInnerElem.style.width = `${progress}px`;
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

async function findAdventure() {
    if (validateForm()) {
        const limit = document.getElementById("limit").value;
        const departure = document.getElementById("departure").value;
        const currency = document.getElementById("currency").value;
        const arrival = document.getElementById("arrival").value;
        const email = document.getElementById("email").value;
        const returnTicket = document.getElementById("returnTicket").checked;

        console.log("Limit:", limit);
        console.log("Departure:", departure);
        console.log("Currency:", currency);
        console.log("Arrival:", arrival);
        console.log("Email:", email);
        console.log("Return Ticket:", returnTicket);
        
        showProgressBar();
        setTimeout(() => {
            hideProgressBar();
        }, 20000);
    }
}

const findAdventureButton = document.getElementById("findAdventure");
findAdventureButton.addEventListener("click", findAdventure);

function displayResult() {
    // Add code to display results in clickable cards
}
