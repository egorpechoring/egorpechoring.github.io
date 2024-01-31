
export class FormStateManager {
    constructor(func) {
        this.endingFunction = func
        this.currentState = 0;
    }

    setSupportedAirports(airports){
        this.supportedAirports = airports;
    }

    goBack() {
        if (this.currentState > 0) {
            this.currentState--;
            this.updateForm();
        }
    }

    goNext() {
        if (this.currentState < 6) {
            this.currentState++;
            this.updateForm();
        }
    }

    updateForm() {
        // Array of section IDs, assuming you have sections from 0 to 5
        const sectionIds = ['section0', 'section1', 'section2', 'section3', 'section4', 'section5', 'section6'];

        // Iterate through all section IDs
        for (let i = 0; i < sectionIds.length; i++) {
            const sectionId = sectionIds[i];
            const sectionElement = document.getElementById(`P${sectionId}`);

            // Check if the current state matches the index, show the section; otherwise, hide it
            if (i === this.currentState) {
                sectionElement.classList.remove('d-none');
            } else {
                sectionElement.classList.add('d-none');
            }
        }

        switch (this.currentState) {
            case 0:
                 DisplayState0()
                break;
            case 1:
                 DisplayState1()
                break;
            case 5:
                DisplayState5()
                break;
            case 6:
                 DisplayState6()
                this.endingFunction(getFormData()/*basically just take correct parameters */, hideLoadingSpinner);
                break;
            default:
                // Default case does nothing
        }

        UpdateFormProgressBar(this.currentState)
    }

    validateStateInput(){
        let result = {};
        // let data = {type:"data", payload: undefined};
        switch (this.currentState) {
            case 1:
                // check 'from' and 'to' locations
                break;
            case 2:
                // check 
                break;
            case 3:
                 
                break;
            case 4:
                 
                break;
            case 5:
                
                break;
            case 6:
                 
                break;
            default:
                // Default case does nothing
        }
        //some
    }
}


function UpdateFormProgressBar(state){
    switch(state){
        case 0:
            document.getElementById('form-progress-box').classList.add('d-none');
            document.getElementById('liner-box').classList.remove('d-none');
            break;
        case 1:
            document.getElementById('form-progress-box').classList.remove('d-none');
            document.getElementById('liner-box').classList.add('d-none');
            document.getElementById('plane1base').classList.remove("d-none");
            document.getElementById('plane1active').classList.add("d-none");
            break;
        case 2:
            document.getElementById('plane1base').classList.add("d-none");
            document.getElementById('plane1active').classList.remove("d-none");
            document.getElementById('plane2base').classList.remove("d-none");
            document.getElementById('plane2active').classList.add("d-none");
            break;
        case 3:
            document.getElementById('plane2base').classList.add("d-none");
            document.getElementById('plane2active').classList.remove("d-none");
            document.getElementById('plane3base').classList.remove("d-none");
            document.getElementById('plane3active').classList.add("d-none");
            break;
        case 4:
            document.getElementById('plane3base').classList.add("d-none");
            document.getElementById('plane3active').classList.remove("d-none");
            document.getElementById('plane4base').classList.remove("d-none");
            document.getElementById('plane4active').classList.add("d-none");
            break;
        case 5:
            document.getElementById('plane4base').classList.add("d-none");
            document.getElementById('plane4active').classList.remove("d-none");
            document.getElementById('plane5base').classList.remove("d-none");
            document.getElementById('plane5active').classList.add("d-none");
            break;
        case 6:
            document.getElementById('plane5base').classList.add("d-none");
            document.getElementById('plane5active').classList.remove("d-none");
            break;
    }
}


function DisplayState0(){
    console.log("state - 0");
                
    // Change nextButton text to "Find a flight!"
    document.getElementById('nextButton').innerText = 'Find a flight!';
    
    // Check if backButton and divider have class d-none, if not - add this class
    const backButton = document.getElementById('backButton');
    const divider = document.getElementById('formNavigationDivider');

    if (!backButton.classList.contains('d-none')) {
        backButton.classList.add('d-none');
    }

    // Check if nextButton has class ml-3, if yes - remove ml-3
    const nextButton = document.getElementById('nextButton');
    if (nextButton.classList.contains('ml-3')) {
        nextButton.classList.remove('ml-3');
    }
}

function DisplayState1(){
    console.log("state - 1");

    // Change nextButton text to "Next"
    document.getElementById('nextButton').innerText = 'Next';

    // Check if backButton and divider have class d-none, if yes - remove this class
    const backButton1 = document.getElementById('backButton');
    const divider1 = document.getElementById('formNavigationDivider');

    if (backButton1.classList.contains('d-none')) {
        backButton1.classList.remove('d-none');
    }

    // Check if nextButton has class ml-3, if no - add ml-3
    const nextButton1 = document.getElementById('nextButton');
    if (!nextButton1.classList.contains('ml-3')) {
        nextButton1.classList.add('ml-3');
    }
}

function DisplayState5() {
    console.log("state - 5")
    // unhide backButton, formNavigationDivider, and nextButton by removing class d-none
    const backButton = document.getElementById('backButton');
    const formNavigationDivider = document.getElementById('formNavigationDivider');
    const nextButton = document.getElementById('nextButton');

    if (backButton) {
        backButton.classList.remove('d-none');
    }

    if (formNavigationDivider) {
        formNavigationDivider.classList.remove('d-none');
    }

    if (nextButton) {
        nextButton.classList.remove('d-none');
    }
}

function DisplayState6() {
    console.log("state - 6")
    // hide backButton, formNavigationDivider, and nextButton by adding class d-none
    const backButton = document.getElementById('backButton');
    const formNavigationDivider = document.getElementById('formNavigationDivider');
    const nextButton = document.getElementById('nextButton');

    if (backButton) {
        backButton.classList.add('d-none');
    }

    if (formNavigationDivider) {
        formNavigationDivider.classList.add('d-none');
    }

    if (nextButton) {
        nextButton.classList.add('d-none');
    }

    showLoadingSpinner()
}

// Function to show the loading spinner
function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.classList.remove('d-none');
    }
}

// Function to hide the loading spinner
function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.classList.add('d-none');
    }
    document.getElementById("Psection6").innerHTML = 'LOL, YOU SCAMMED BY NON-FUNCTIONAL PROTOTYPE'
}

function getFormData(){
    console.log("collecting data from form")
}