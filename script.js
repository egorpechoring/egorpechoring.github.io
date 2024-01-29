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

let isSuggestionsOpened = false
let suggestions = document.getElementById('suggestions');

let airports = ["airport1", "airport2", "airport3air port3airp port3airp ort3", "airport4","airport1", "airport2", "airport3air port3airp port3airp ort3", "airport4","airport1", "airport2", "airport3air port3airp port3airp ort3", "airport4","airport1", "airport2", "airport3air port3airp port3airp ort3", "airport4", "airport5"];

document.body.addEventListener('click', (event)=>{
    suggestions.classList.add('d-none');
})

document.getElementById('airportFrom').addEventListener('click', (event)=>{
    isSuggestionsOpened = !isSuggestionsOpened

    if (isSuggestionsOpened){
        suggestions.classList.remove('d-none');

        let rect = event.target.getBoundingClientRect();
        suggestions.style.left = rect.left + 'px';
        suggestions.style.top = (rect.bottom + window.scrollY) + 'px';

        airports.forEach(function(airport) {
            var listItem = document.createElement("li");
            listItem.textContent = airport;
            listItem.addEventListener("click", function() {
                isSuggestionsOpened = false
                while (suggestions.firstChild) {
                    suggestions.removeChild(suggestions.firstChild);
                }
                suggestions.classList.add('d-none');
            });
            listItem.classList.add('autocomplete-list-element')
            suggestions.appendChild(listItem);
        });
    } else {
        while (suggestions.firstChild) {
            suggestions.removeChild(suggestions.firstChild);
        }
    }
    //set x and y same as document.getElementById('airportFrom')
})

loadSupportedAirports().then((airports) => {formStateManager.setSupportedAirports(airports)});