export class FormStateManager {
    constructor(func) {
        this.endingFunction = func
        this.currentState = 0;
    }

    setSupportedAirports(airports){
        this.supportedAirports = airports;
    }

    setDate(isFirst, date){
        if(isFirst){
            this.stDate = date;
        } else {
            this.enDate = date;
        }
    }

    goBack() {
        if(this.currentState===5){
            this.validateStateInput(this.currentState)
        }
        DisplayError()
        if(this.currentState === 4){
            this.currentState--
        }
        if ((this.currentState === 5 && !this.isReturn) || 
        (this.currentState === 5 && this.isReturn === true && this.isExactDates === false)
        ){
            this.currentState -=2 
            SkipStepsBack()
        }
        if (this.currentState > 0) {
            this.currentState--;
            this.updateForm();
        }
    }

    goNext() {
        let errorMsg = this.validateStateInput(this.currentState)
        DisplayError(errorMsg)
        if ((this.currentState === 2 && !this.isReturn) ||
            (this.currentState === 2 && this.isReturn === true && this.isExactDates === false)
        ){
            this.currentState +=2 
            SkipStepsForward()
        }
        if(this.currentState === 2){
            this.currentState++
        }
        if (this.currentState < 6 && !errorMsg) {
            this.currentState++;
            this.updateForm();
        }
    }

    updateForm() {
        // Array of section IDs, assuming you have sections from 0 to 5
        const sectionIds = ['section0', 'section1', 'section2', 'section3', 'section4', 'section5', 
         'section6'
        ];


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
            case 3:
                document.getElementById('location-place1').innerText = this.portTo + " " 
                break;
            case 4:
                document.getElementById('location-place2').innerText = this.portTo
                break;
            case 5:
                DisplayState5(this.isReturn, this.isExactDates, this.stDate, this.enDate)
                break;
            case 6:
                DisplayState6()
                let depar = this.portFrom.match(/\(([^)]+)\)/)
                let arriv = this.portTo.match(/\(([^)]+)\)/);
                this.endingFunction({
                    "limit":160, 
                    "departure":depar[1],
                    "arrival":arriv[1],
                    "isreturn":this.isReturn
                });
                break;
            default:
                // Default case does nothing
        }

        UpdateFormProgressBar(this.currentState)
    
        
    }

    validateStateInput(currentState){
        let targetState = currentState;
        let result;
        switch (targetState) {
            case 1:
                let airPortFrom = document.getElementById('airportFrom').value;
                let airPortTo = document.getElementById('airportTo').value;

                if (this.supportedAirports.includes(airPortFrom)) {
                    this.portFrom = airPortFrom;
                } else {
                    if(airPortFrom){
                        result = 'Departure airport is not supported';
                    } else {
                        result = 'Departure airport could not be empty';
                    }
                }

                if(result){
                    break;
                }

                if (this.supportedAirports.includes(airPortTo)) {
                    if (airPortTo !== airPortFrom) {
                        this.portTo = airPortTo;
                    } else {
                        result = 'Destination airport should not be the same';
                    }
                } else {
                    if(airPortTo){
                        result = 'Arrival airport is not supported';
                    } else {
                        result = 'Arrival airport could not be empty';
                    }
                }

                if(result){
                    break;
                }

                console.log("from: ", airPortFrom);
                console.log("to: ", airPortTo);

                this.portFrom = airPortFrom
                this.portTo = airPortTo
                break;

            case 2:
                let r = document.getElementById('returnTicketsCheckbox').checked;
                let e = document.getElementById('exactDates').checked;
                console.log("return: ", r)
                console.log("exactDates: ", e)

                this.isReturn = r
                this.isExactDates = e
                break;
            case 3:
                // let minimumNights = document.getElementById('minimumNights').value;
                
                // if (!isNaN(minimumNights) && minimumNights > 0 && minimumNights <= 27) {
                //     console.log("minimumNights: ", minimumNights);
                //     this.minNights = minimumNights;
                // } else {
                //     result = 'Minimum staying nights should be a positive integer not exceeding 27';
                // }
                // break; 
            case 4:
                let minimumNights = document.getElementById('minimumNights').value;
                
                if (!isNaN(minimumNights) && minimumNights > 0 && minimumNights <= 27) {
                    console.log("minimumNights: ", minimumNights);
                    this.minNights = minimumNights;
                } else {
                    result = 'Minimum staying nights should be a positive integer not exceeding 27';
                    break; 
                }

                let maximumNights = document.getElementById('maximumNights').value;

                if (!isNaN(maximumNights) && maximumNights > 0 && maximumNights <= 28) {
                    if(this.minNights > maximumNights){
                        result = 'Maximal staying nights should equal or grater than minimum staying nights ('+this.minNights+')';
                    } else {
                        console.log("maximumNights", maximumNights)
                        this.maxNights = maximumNights
                    }
                } else {
                    result = 'Maximum staying nights should be a positive integer not exceeding 28';
                    break; 
                }
                break; 
            case 5:
                let startDateInput = document.getElementById('startDate').value;
                let startDate = new Date(startDateInput);

                let today = new Date();

                if(this.isReturn === false && this.isExactDates === false){
                    if (startDate >= today ){
                        this.stDate = startDate;
                        break
                    } else {
                        result = 'Departure date should be greater than yesterday';
                        break
                    }
                }

                let endDateInput = document.getElementById('endDate').value;

                let endDate = new Date(endDateInput);


                if (startDate >= today && startDate <= AddMonths(today, 12)) {
                    if (endDate > startDate && endDate <= AddMonths(today, 12)) {
                        console.log("startDate: ", startDate);
                        console.log("endDate: ", endDate);

                        this.stDate = startDate;
                        this.enDate = endDate;
                    } else {
                        if(endDate > startDate){
                            result = 'Range end date should not exceed today + 12 months';
                            break; 
                        } else {
                            result = 'Range end date should be greater than start date';
                            break; 
                        }
                    }
                } else {
                    if(startDate >= today){
                        result = 'Range start date should not exceed today + 12 months';
                        break; 
                    } else {
                        result = 'Range start date should be at least today';
                        break; 
                    }
                }

                break;
            case 6:
                break;
            default:
                // Default case does nothing
        }
        console.log("result", result)
        return result
    }
}

function AddMonths(date, months) {
    let newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
}

function DisplayError(msg){
    let erEl = document.getElementById('error-place');
    erEl.innerHTML = '';
    if (msg){
        erEl.classList.remove('d-none');
        erEl.innerHTML = msg;
    } else {
        erEl.classList.add('d-none');
    }
}

function UpdateFormProgressBar(state){
    switch(state+1){
        //case 0:
        case 0:
            document.getElementById('form-progress-box').classList.add('d-none');
            document.getElementById('liner-box').classList.remove('d-none');
            break;
        //case 1:
        case 1:
            document.getElementById('form-progress-box').classList.add('d-none');
            document.getElementById('liner-box').classList.remove('d-none');
            // document.getElementById('form-progress-box').classList.remove('d-none');
            // document.getElementById('liner-box').classList.add('d-none');
            document.getElementById('plane1base').classList.remove("d-none");
            document.getElementById('plane1active').classList.add("d-none");
            break;
        //case 2:
        case 2:
            document.getElementById('form-progress-box').classList.remove('d-none');
            document.getElementById('liner-box').classList.add('d-none');
    
            document.getElementById('plane1base').classList.add("d-none");
            document.getElementById('plane1active').classList.remove("d-none");
            document.getElementById('plane2base').classList.remove("d-none");
            document.getElementById('plane2active').classList.add("d-none");
            break;
        //case 3:
        case 3:
            document.getElementById('plane2base').classList.add("d-none");
            document.getElementById('plane2active').classList.remove("d-none");
            document.getElementById('plane4base').classList.remove("d-none");
            document.getElementById('plane4active').classList.add("d-none");
            break;
        //case 4:
        case 4:
            // document.getElementById('plane2base').classList.add("d-none");
            // document.getElementById('plane2active').classList.remove("d-none");
            // document.getElementById('plane4base').classList.remove("d-none");
            // document.getElementById('plane4active').classList.add("d-none");
            break;
        //case 5:
        case 5:
            document.getElementById('plane4base').classList.add("d-none");
            document.getElementById('plane4active').classList.remove("d-none");
            document.getElementById('plane5base').classList.remove("d-none");
            document.getElementById('plane5active').classList.add("d-none");
            break;
        //case 6:
        case 6:
            document.getElementById('plane5base').classList.add("d-none");
            document.getElementById('plane5active').classList.remove("d-none");
            break;
    }
}

function DisplayState0(){
    console.log("state - 0");
                
    // Change nextButton text to "Find a flight!"
    document.getElementById('nextButton').innerText = "Let's try!";
    
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

function DisplayState5(isReturn, isExactDates, date1, date2) {
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

    FillSection(isReturn, isExactDates, date1, date2)
}

function FillSection(isReturn, isExactDates, date1, date2) {
    console.log("date1, date2",date1, date2)
    var pSection5 = document.getElementById('Psection5');
    pSection5.innerHTML = '';

    // Create the first input section
    var firstSection = document.createElement('div');
    firstSection.style.width = '100%';

    var aboveInput1 = document.createElement('div');
    aboveInput1.className = 'col-auto paddingless above-input';
    if(isExactDates === false){
        aboveInput1.textContent = 'Depart at';
    } else {
        aboveInput1.textContent = 'Travel within range begins from';
    }

    var startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    startDateInput.className = 'form-control col-auto';
    startDateInput.style.width = '100%';
    startDateInput.id = 'startDate';
    startDateInput.autocomplete = 'off';
    
    // Convert date1 to the "YYYY-MM-DD" format
    if(date1){
        var date1t = new Date(date1);
        console.log("date1t ", date1t)
        startDateInput.value = date1t.toISOString().split('T')[0];
    }

    firstSection.appendChild(aboveInput1);
    firstSection.appendChild(startDateInput);

    // Create a line break
    var lineBreak = document.createElement('br');

    if(isReturn === false && isExactDates === false){
    } else {
        // Create the second input section
        var secondSection = document.createElement('div');
        secondSection.style.width = '100%';

        var aboveInput2 = document.createElement('div');
        aboveInput2.className = 'col-auto paddingless above-input';
        if(isReturn === true && isExactDates === false ){
            aboveInput2.textContent = 'and return back at';
        } else {
            aboveInput2.textContent = 'and ends after';
        }

        var endDateInput = document.createElement('input');
        endDateInput.type = 'date';
        endDateInput.className = 'form-control col-auto';
        endDateInput.style.width = '100%';
        endDateInput.id = 'endDate';
        endDateInput.autocomplete = 'off';
        
        // Convert date1 to the "YYYY-MM-DD" format
        if(date2){
            var date2t = new Date(date2);
            console.log("date1t ", date2t)
            startDateInput.value = date2t.toISOString().split('T')[0];
        }

        secondSection.appendChild(aboveInput2);
        secondSection.appendChild(endDateInput);

    }

    pSection5.appendChild(firstSection);
    pSection5.appendChild(lineBreak);
    if(isReturn === false && isExactDates === false){
    } else {
        pSection5.appendChild(secondSection);
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

    // showLoadingSpinner()
}

function SkipStepsForward(){
    // document.getElementById('plane3base').classList.add("d-none");
    // document.getElementById('plane3active').classList.remove("d-none");
    document.getElementById('plane4base').classList.add("d-none");
    document.getElementById('plane4active').classList.remove("d-none");
} 

function SkipStepsBack(){
    // document.getElementById('plane3base').classList.remove("d-none");
    // document.getElementById('plane3active').classList.add("d-none");
    document.getElementById('plane4base').classList.remove("d-none");
    document.getElementById('plane4active').classList.add("d-none");
    document.getElementById('plane5base').classList.remove("d-none");
    document.getElementById('plane5active').classList.add("d-none");
}
