const progressElem = document.getElementById("progress");
const progressInnerElem = document.getElementById("progress-inner");
const progressBarWidth = 100; 
let progressInterval;
var resultDiv = document.getElementById('result');

let supportedAirports;
let savedResponseArray;

//  --- after blob comes stuff start ---

let savedBlob;

function sortByPrice() {
    //filterByStay(document.getElementById('min-stay').value,document.getElementById('max-stay').value)

    const returnTicket = document.getElementById("returnTicket").checked;
    let blob = savedBlob;
    if(returnTicket){
        blob.sort(function (a, b) {
            return (a[0].price.value + a[1].price.value) - (b[0].price.value + b[1].price.value);
        });
    } else {
        blob.sort(function (a, b) {
            return a.price.value - b.price.value;
        });
    }
    savedBlob = blob;
    renderData(savedBlob);
    //document.getElementById("result").scrollIntoView({behavior: 'smooth'});
}

function sortByDate() {
    const returnTicket = document.getElementById("returnTicket").checked;
    // filterByStay(document.getElementById('min-stay').value,document.getElementById('max-stay').value)
    let blob = savedBlob;
    if(returnTicket){
        blob.sort(function (a, b) {
            const dateA = new Date(a[0].arrivalDate);
            const dateB = new Date(b[0].arrivalDate);
            return dateA - dateB;
        });
    } else {
        blob.sort(function (a, b) {
            const dateA = new Date(a.arrivalDate);
            const dateB = new Date(b.arrivalDate);
            return dateA - dateB;
        });
    }
    savedBlob = blob;
    renderData(savedBlob);
    //document.getElementById("result").scrollIntoView({behavior: 'smooth'});
}

document.getElementById('sortByPrice').addEventListener('click', sortByPrice);
document.getElementById('sortByDate').addEventListener('click', sortByDate);

function filterByStay(minStay, maxStay){
    savedBlob = savedResponseArray;
    console.log(`min ${minStay}, max ${maxStay}`)
    if (isNaN(minStay) && isNaN(maxStay)) {
        return;
    } else if ((isNaN(minStay) || minStay === "") && !isNaN(maxStay)) {
        minStay = 1;
    } else if (!isNaN(minStay) && (isNaN(maxStay) || maxStay === "")) {
        maxStay = 30;
    }
    console.log(`min ${minStay}, max ${maxStay}`)
    if (minStay < 1 || minStay >= 30){
        showError("Minimal stay bound must be a positive number in range from 1 to 30 and less than maximal stay bound", 'minLimitErrorMessage');
    } else if (maxStay < 1 || maxStay > 30){
        showError("Maximal stay bound must be a positive number in range from 1 to 30 and more than minimal stay bound", 'maxLimitErrorMessage');
    } else if(minStay > 0 && minStay < 30 && maxStay > 0 && maxStay <= 30 && maxStay > minStay){
        clearErrorMessage('minLimitErrorMessage') 
        clearErrorMessage('maxLimitErrorMessage') 
        console.log(`Filtering with more than ${minStay}, less than ${maxStay}`);

        //TODO : fix for 'any'
        const filteredFlights = savedBlob.filter((innerArray) => {
            for (let i = 1; i < innerArray.length; i++) {
              const departureDate1 = new Date(innerArray[i - 1].departureDate);
              const arrivalDate2 = new Date(innerArray[i].arrivalDate);
              
              // Calculate the stay duration in days
              const stayDuration = (arrivalDate2 - departureDate1) / (1000 * 60 * 60 * 24);
              
              // Check if stayDuration is within the specified range
              if (stayDuration >= minStay && stayDuration <= maxStay) {
                return true; // Keep this flight tuple
              }
            }
            return false; // Exclude this inner array if no matching stay duration is found
        });
        blob = filteredFlights;
        savedBlob = blob;
        
        renderData(blob);
        //document.getElementById("result").scrollIntoView({behavior: 'smooth'});
    } 
}

document.getElementById('min-stay').addEventListener('input', function(event) {
    const minValue = parseInt(event.target.value);
    const maxValue = document.getElementById('max-stay').value;
    console.log(`Minimal stay value changed to: ${minValue} and max is: ${maxValue}`);

    if(isNaN(minValue) && maxValue <= 30 && maxValue > 0){
        filterByStay(minValue, maxValue);
    }else if (minValue > 0 && minValue < 30 && (maxValue === "" || isNaN(maxValue))){
        document.getElementById('max-stay').value = 30;
        filterByStay(minValue, maxValue);
    } else if (minValue <= 0 || minValue > 30 || minValue >= maxValue) {
        if(minValue >= maxValue){
            showError("Maximal stay bound must be a positive number in range from 1 to 30 and more than minimal stay bound", 'maxLimitErrorMessage');
        }
        showError("Minimal stay bound must be a positive number in range from 1 to 30 and less than maximal stay bound", 'minLimitErrorMessage');
        return;
    } else {
        clearErrorMessage('minLimitErrorMessage') 
        if(minValue < maxValue){
            clearErrorMessage('maxLimitErrorMessage')
            filterByStay(minValue, maxValue);
        }
    }
});

document.getElementById('max-stay').addEventListener('input', function(event) {
    const minValue = document.getElementById('min-stay').value;
    const maxValue = parseInt(event.target.value);
    console.log(`Maximal stay value changed to: ${maxValue} and min is: ${minValue}`);
    if(isNaN(maxValue) && minValue < 30 && minValue > 0){
        clearErrorMessage('maxLimitErrorMessage')
        clearErrorMessage('minLimitErrorMessage')
        filterByStay(minValue, maxValue);
    } else if(maxValue <= 30 && maxValue >0 && (minValue === "" || isNaN(minValue))){
        filterByStay(minValue, maxValue);
    } else if (maxValue <= 1 || maxValue > 30 || minValue >= maxValue) {
        if(minValue >= maxValue){
            showError("Minimal stay bound must be a positive number in range from 1 to 30 and less than maximal stay bound", 'minLimitErrorMessage');
        }
        showError("Maximal stay bound must be a positive number in range from 1 to 30 and more than minimal stay bound", 'maxLimitErrorMessage');
        return;
    } else {
        clearErrorMessage('maxLimitErrorMessage')
        if(minValue < maxValue){
            clearErrorMessage('minLimitErrorMessage') 
            filterByStay(minValue, maxValue);
        }
    }
});


//  --- after blob comes stuff end ---



function clearErrorMessage(place = "errorMessage") {
    const errorMessageElem = document.getElementById(place);
    errorMessageElem.innerHTML = "";
}

function showError(message, place = "errorMessage") {
    const errorMessageElem = document.getElementById(place);
    errorMessageElem.innerHTML = `${message}<br></br>`;
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

    let isOk = true;
    
    if (limit <= 0) {
        showError("Limit must be a positive number", 'limitErrorMessage');
        isOk = false;
    } else {
        clearErrorMessage('limitErrorMessage')
    }
    
    if (!departure) {
        showError("Please select a departure airport", 'departureAirportErrorMessage');
        isOk = false;
    } else {
        clearErrorMessage('departureAirportErrorMessage')
    }
    
    if (!currency) {
        showError("Please select a currency", 'currencyErrorMessage');
        isOk = false;
    } else {
        clearErrorMessage('currencyErrorMessage')
    }
    
    if (arrival === departure) {
        showError("Arrival airport cannot be equal to departure airport", 'arrivalAirportErrorMessage');
        isOk = false;
    } else {
        clearErrorMessage('arrivalAirportErrorMessage')
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (email && !emailPattern.test(email)) {
        showError("Please enter a valid email address", 'emailErrorMessage');
        isOk = false;
    } else {
        clearErrorMessage('emailErrorMessage')
    }
    
    return isOk;
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

function hideElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem) {
        elem.style.display = 'none';
    }
}

function unhideElement(elementId) {
    if (document.getElementById("returnTicket").checked){
        document.getElementById("stayLimits").style.display = 'block';
    } else {
        document.getElementById("stayLimits").style.display = 'none';
    }
    const elem = document.getElementById(elementId);
    if (elem) {
        elem.style.display = 'block';
    }
}

// --- modifying "2way to any" to normal array could works with ---
function createFlightPairs(apiResponseA) {
    const flightPairs = [];
  
    for (const container of apiResponseA) {
      for (const tuple of container) {
        flightPairs.push(tuple);
      }
    }

    console.log(flightPairs)
  
    return flightPairs;
}
// --- . ---

async function findAdventure() {
    savedResponseArray = [];
    resultDiv.innerHTML = '';
    // hideElement('sortByDate');
    // hideElement('sortByPrice');
    hideElement('settings');
    document.getElementById('min-stay').value = '';
    document.getElementById('max-stay').value = '';

    clearErrorMessage();
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
                    showError(response.text());
                    throw new Error('Network response was not ok');
                }
                
                return response.text()
            })
            .then(data => {
                var apiResponseArray = JSON.parse(data);
                console.log(apiResponseArray);
                if(returnTicket && arrival === "any"){
                    apiResponseArray = createFlightPairs(apiResponseArray);
                }
                if (apiResponseArray.length !== 0){
                    
                    apiResponseArray.sort(function(a, b) {
                        var dateA;
                        var dateB;

                        if(returnTicket){
                            dateA = new Date(a[0].departureDate);
                            dateB = new Date(b[0].departureDate);
                        } else {
                            dateA = new Date(a.departureDate);
                            dateB = new Date(b.departureDate);
                        }
                        
                        return dateA - dateB;
                    });

                    savedResponseArray = apiResponseArray;
                    savedBlob = apiResponseArray;
                    

                    // unhideElement('sortByDate');
                    // unhideElement('sortByPrice');
                    unhideElement('settings');

                    renderData(apiResponseArray);
                } else  {
                    resultDiv.innerHTML = 'No flights between selected parameters at all :c';
                }
            })
            .catch(error => {
                showError('Error: ' + error.message);
            })
            .finally(() => {
                hideProgressBar();
                document.getElementById("settings").scrollIntoView({behavior: 'smooth'});
            });
    }
}

const findAdventureButton = document.getElementById("findAdventure");
findAdventureButton.addEventListener("click", findAdventure);


function renderData(apiResponseArray) {
    resultDiv.innerHTML = '';
    const limit = document.getElementById("limit").value;
    const departure = document.getElementById("departure").value;
    const currency = document.getElementById("currency").value;
    const arrival = document.getElementById("arrival").value;
    const email = document.getElementById("email").value;
    const returnTicket = document.getElementById("returnTicket").checked;

    if (returnTicket){
        apiResponseArray.forEach(function (item) {
            //console.log(item)

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

async function loadSupportedAirports() {
    try {
      const apiUrl = 'https://www.ryanair.com/api/views/locate/5/airports/en/active';
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${apiUrl}`);
      }
  
      const airportData = await response.json();
  
      if (!Array.isArray(airportData)) {
        throw new Error('Invalid data format');
      }
  
      const supportedAirports = airportData.map((airport) => {
        return `${airport.name} (${airport.code})`;
      });
  
      return supportedAirports;
    } catch (error) {
      //showError('Error loading supported airports:', error);
      return [];
    }
}
  

mobileOrWeb();
hideElement('settings');

loadSupportedAirports()
    .then((supportedAirports) => {
        console.log(supportedAirports);
    });
