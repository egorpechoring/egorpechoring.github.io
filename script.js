import { FormStateManager } from "./js/formStateManager.js"
import { findTickets, loadSupportedAirports } from "./js/fetchCall.js"
import { generateRandomString } from "./js/helpers.js";

// TODO: mb go into clean code and each file one responsibil.?
// i mean fetch should call results drawing paginated shit, just pregive him displaying func imported from anothr file

// const loadingSpinner = new LoadingSpinner();
const formStateManager = new FormStateManager(findTickets);

// Handle "Back" button click
document.getElementById('backButton').addEventListener('click', () => {
    formStateManager.goBack();
});

// Handle "Next" button click
document.getElementById('nextButton').addEventListener('click', () => {
    formStateManager.goNext();
});

let suggestions = document.getElementById('suggestions');
let airportInputFrom = document.getElementById('airportFrom');
let airportInputTo = document.getElementById('airportTo');

airportInputFrom.addEventListener('input', (event) => {
    suggest(airportInputFrom, event)
})

airportInputTo.addEventListener('input', (event) => {
    suggest(airportInputTo, event)
})

function suggest(airportInput, event){
    suggestions.classList.remove('d-none');
    let inputText = airportInput.value.toLowerCase();

    while (suggestions.firstChild) {
        suggestions.removeChild(suggestions.firstChild);
    }

    let filteredAirports = formStateManager.supportedAirports.filter(function (airport) {
        return airport.toLowerCase().includes(inputText);
    });

    let rect = event.target.getBoundingClientRect();
    let absoluteTop = rect.top + window.scrollY;
    let absoluteLeft = rect.left + window.scrollX;

    suggestions.style.left = absoluteLeft + 'px';
    suggestions.style.top = absoluteTop + rect.height  + 'px';
    suggestions.style.width = rect.width + 'px';

    filteredAirports.forEach(function (airport) {
        var listItem = document.createElement("li");
        listItem.textContent = airport;
        listItem.addEventListener("click", function () {
            airportInput.value = airport
            while (suggestions.firstChild) {
                suggestions.removeChild(suggestions.firstChild);
            }
            suggestions.classList.add('d-none');
        });
        listItem.classList.add('autocomplete-list-element')
        suggestions.appendChild(listItem);
    });

    airportInput.focus();
}

// Close suggestions on document click
document.addEventListener("click", (event) => {
    if (!event.target.closest('#suggestions') && ( event.target !== airportInputFrom || event.target !== airportInputTo)) {
        document.documentElement.scrollTop = 0;
        suggestions.classList.add('d-none');
    }
});


// video auto play 
document.addEventListener('DOMContentLoaded', function () {
    var video = document.getElementById("myVideo");
    video.muted = true;
    video.click();
    
});

// for mobile adaptation
if (window.innerWidth < window.innerHeight) {

    document.getElementById('landing-content').style.padding = "10%";

    document.getElementById('liner1').classList.remove('d-none')
    document.getElementById('liner2').classList.remove('d-none')
    document.getElementById('liner').classList.add('d-none')

    document.getElementById('footer').classList.add('d-none')
    document.getElementById('footerDivider').classList.remove('d-none')
    
    const leads = document.querySelectorAll('.lead');
    leads.forEach(lead => {
        lead.classList.remove('lead')
        lead.classList.add('lead-small')
    })

    const inputs = document.querySelectorAll('.w-75');
    inputs.forEach(input => {
        input.classList.remove('w-75');
        input.classList.add('w-100')
    })

    const labels = document.querySelectorAll('.w-25');
    labels.forEach(label => {
        label.classList.remove('w-25');
        label.classList.add('w-75');
    });

    const labelings = document.querySelectorAll('.labeling');
    labelings.forEach(labeling => {
        labeling.classList.remove('d-flex')
    })

    var h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(function (element) {
        // Adjust the font size as needed
        element.style.fontSize = '2.2rem'; // Set your desired font size
    });

    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn =>{
        btn.classList.remove('btn-lg')
        // btn.classList.add('btn-md')
    })

    const progressPlanes = document.querySelectorAll('.rotated-icon')
    progressPlanes.forEach(plane => {
        plane.classList.add('rotated-icon-small')
    })
    const progressPlanesA = document.querySelectorAll('.rotated-icon-active')
    progressPlanesA.forEach(plane => {
        plane.classList.add('rotated-icon-small')
    })
    const progressLines = document.querySelectorAll('.progress-line')
    progressLines.forEach(line => {
        line.classList.add('progress-line-small')
    })

    const easyAbove = document.querySelectorAll('.easy-above ')
    easyAbove.forEach(elem => {
        elem.classList.add('above-input')
    }) 

}

// airports loading
loadSupportedAirports().then((airports) => {formStateManager.setSupportedAirports(airports)});

// cookies

// Show the cookie consent modal when the document is loaded
$(document).ready(function() {
    let iflyID = localStorage.getItem('ifly-user-id')
    if (!iflyID){
        $('#cookieConsentModal').modal('show');
    }
    console.log("user ",localStorage.getItem('ifly-user-id'))
});

// Add your cookie consent functionality here, e.g., setting cookies based on user preferences
$('#acceptAllCookies').click(function() {
    // Handle 'Accept All' button click
    // Add code to set cookies accordingly
    $('#cookieConsentModal').modal('hide');
    localStorage.setItem('ifly-user-id', generateRandomString(4));
});

$('#acceptNecessaryCookies').click(function() {
    // Handle 'Accept Necessary' button click
    // Add code to set necessary cookies
    $('#cookieConsentModal').modal('hide');
    localStorage.setItem('ifly-user-id', generateRandomString(4));
});