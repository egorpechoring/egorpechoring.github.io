import {FormStateManager} from "./js/formStateManager.js"
import {fetchCall} from "./js/fetchCall.js"

// TODO: mb go into clean code and each file one responsibil.?

// Create an instance of FormStateManager with the ending function
const formStateManager = new FormStateManager(fetchCall);

// Handle "Back" button click
document.getElementById('backButton').addEventListener('click', () => {
    formStateManager.goBack();
});

// Handle "Next" button click
document.getElementById('nextButton').addEventListener('click', () => {
    formStateManager.goNext();
});
