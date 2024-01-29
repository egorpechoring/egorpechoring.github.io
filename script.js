import {FormStateManager} from "./js/formStateManager.js"
import {findTickets, loadSupportedAirports} from "./js/fetchCall.js"

// TODO: mb go into clean code and each file one responsibil.?
// i mean fetch should call results drawing paginated shit, just pregive him displaying func imported from anothr file

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
let airportInput = document.getElementById('airportFrom');

airportInput.addEventListener('input', (event)=>{
    suggestions.classList.remove('d-none');
    let inputText = airportInput.value.toLowerCase();
    
    while (suggestions.firstChild) {
        suggestions.removeChild(suggestions.firstChild);
    }
    let filteredAirports = formStateManager.supportedAirports.filter(function(airport) {
        return airport.toLowerCase().includes(inputText);
    });

    let rect = event.target.getBoundingClientRect();
    suggestions.style.left = (rect.left) + 'px';
    suggestions.style.top = (rect.bottom  - 1) + 'px';

    filteredAirports.forEach(function(airport) {
        var listItem = document.createElement("li");
        listItem.textContent = airport;
        listItem.addEventListener("click", function() {
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
})

loadSupportedAirports().then((airports) => {formStateManager.setSupportedAirports(airports)});