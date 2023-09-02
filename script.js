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
  
    if (!existingValue || existingValue.trim() === "") {
      const randomKey = generateRandomKey();
      localStorage.setItem(localStorageKey, randomKey);
      return randomKey;
    } else {
      return existingValue;
    }
}

function splitDateTime(dateTimeString) {
    const [datePart, timePart] = dateTimeString.split("T");
    const [year, month, day] = datePart.split("-");
    const [hour, minute, second] = timePart.split(":");
    
    const dateTime = new Date(year, month - 1, day, hour, minute, second);
    
    const formattedTime = `${hour}:${minute}`;
    
    return {
      date: dateTime.toDateString(),
      time: formattedTime
    };
}

async function findAdventure() {
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    errorMessageElem.innerHTML = '';
    if (validateForm()) {
        const limit = document.getElementById("limit").value;
        const departure = document.getElementById("departure").value;
        const currency = document.getElementById("currency").value;
        arrival = document.getElementById("arrival").value;
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

        if(!arrival){
            arrival = 'any';
        }
        
        showProgressBar();

        const apiUrl = `https://ts8n59al5l.execute-api.eu-north-1.amazonaws.com/default/IFlyBackend?From=${departure}&To=${arrival}&isReturn=${returnTicket}&currency=${currency}&threshold=${limit}`;
        console.log("apiUrl");
        console.log(apiUrl);

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                //console.log(data)
                var apiResponseArray = JSON.parse(data);
                if (returnTicket){
                    apiResponseArray.forEach(function (item) {
                        console.log(item)

                        var parentDiv = document.createElement('div');
                        parentDiv.style.display = 'flex'; 

                        var divElement1 = document.createElement('div');

                        const resultDepart1 = splitDateTime(item[0].departureDate);
                        const resultArrive1 = splitDateTime(item[0].arrivalDate);

                        divElement1.innerHTML = `
                            <div>From ${item[0].From} to ${item[0].To}</div>
                            <div>${resultDepart1.date} at ${resultDepart1.time}</div>
                            <div>  ->  ${resultArrive1.date} at ${resultArrive1.time}</div>
                            <div><span>Price: ${item[0].price.value} ${currency}</span></div>
                        `;

                        var divElement2 = document.createElement('div');

                        const resultDepart2 = splitDateTime(item[1].departureDate);
                        const resultArrive2 = splitDateTime(item[1].arrivalDate);

                        divElement2.innerHTML = `
                            <div>From ${item[1].From} to ${item[1].To}</div>
                            <div>${resultDepart2.date} at ${resultDepart2.time}</div>
                            <div>  ->  ${resultArrive2.date} at ${resultArrive2.time}</div>
                            <div><span>Price: ${item[1].price.value} ${currency}</span></div>
                        `;

                        divElement1.style.marginRight = '5%';
                        divElement2.style.borderLeft = '3px dotted black';
                        divElement2.style.borderLeftS = 'black';
                        divElement2.style.width = '50%';
                        divElement2.style.paddingLeft = '5%';
                        parentDiv.appendChild(divElement1);
                        parentDiv.appendChild(divElement2);

                        var divElement = document.createElement('div');
                        divElement.innerHTML = `
                            <div><span><b>Total price:</b> ${(item[0].price.value + item[1].price.value).toFixed(2)} ${currency} (both tickets sum)</span></div>
                            <br></br>
                        `;

                        resultDiv.appendChild(parentDiv);
                        resultDiv.appendChild(divElement);

                    });
                } else {
                    apiResponseArray.forEach(function (item) {
                        var divElement = document.createElement('div');
    
                        const resultDepart = splitDateTime(item.departureDate);
                        const resultArrive = splitDateTime(item.arrivalDate);
                    
                        divElement.innerHTML = `
                          <div>From ${item.From} to ${item.To}</div>
                          <div>${resultDepart.date} at ${resultDepart.time}  ->  ${resultArrive.date} at ${resultArrive.time}</div>
                          <div><span >Price: ${item.price.value} ${currency}</span></div>
                          <br></br>
                        `;
                    
                        resultDiv.appendChild(divElement);
                    });
                }
            })
            .catch(error => {
                resultDiv.textContent = 'Error: ' + error.message;
            })
            .finally(() => {
                hideProgressBar();
                console.log('Request completed.');
            });
    }
}

const findAdventureButton = document.getElementById("findAdventure");
findAdventureButton.addEventListener("click", findAdventure);

function displayResult() {
    // TODO : Add code to display results in clickable cards
}

function isMacOSOrWindows() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('macintosh') || userAgent.includes('windows');
}

function mobileOrWeb() {
    if (!isMacOSOrWindows()) {
        document.body.style.fontSize = '175%';

        var headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(function(heading) {
            heading.style.fontSize = '82px';
        });

        var formControls = document.querySelectorAll('.form-control');
        formControls.forEach(function(control) {
            control.style.fontSize = '175%';
            control.style.padding = '10px';
        });

        var buttons = document.querySelectorAll('.btn');
        buttons.forEach(function(button) {
            button.style.fontSize = '175%';
            button.style.padding = '10px 20px';
        });

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

        var errorMessage = document.getElementById('errorMessage');
        errorMessage.style.fontSize = '175%';

    }
}

mobileOrWeb();
