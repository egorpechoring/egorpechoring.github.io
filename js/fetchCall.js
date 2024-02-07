function fetchData(url) {
  return new Promise((resolve, reject) => {
    // Simulate a longer time of waiting (e.g., 5 seconds)
    setTimeout(() => {
      fetch(url)
        .then(response => response.text())
        .then(data => {
          console.log('Data:', data);
          resolve(data)
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          reject(error);
        });
      // Update boo inside the timeout function
    }, 5000); // 5000 milliseconds (5 seconds)
  });
}

let isReturn;

export function findTickets(inputData) {
  isReturn = inputData['isreturn']
  console.log("user input: ",inputData)
  // blinking-class
  const progressPlanesA = document.querySelectorAll('.rotated-icon-active')
  
  progressPlanesA.forEach((plane, index) => {
    setTimeout(() => {
      plane.classList.add('blinking-class');
    }, index * 200); // Delay increases with each element
  });

  // Start the fetch request
  // TODO: PUT CORRECT
  let eur = 'EUR'
  // const apiUrl = `https://ts8n59al5l.execute-api.eu-north-1.amazonaws.com/default/IFlyBackend?From=${inputData["departure"]}&To=${inputData["arrival"]}&isReturn=${inputData["isreturn"]}&currency=${eur}&threshold=${inputData["limit"]}`;
  const apiUrl = `https://ov874qc8j5.execute-api.eu-north-1.amazonaws.com/ifly_processor?ID=5`;
  console.log("apiUrl: ", apiUrl);  

  const fetchPromise = fetchData(apiUrl);

  fetchPromise
    .then(data => {
        progressPlanesA.forEach((plane, index) => {
          plane.classList.remove('blinking-class');
        })
        document.getElementById('landing-content').classList.add('d-none')
        document.getElementById('results-content').classList.remove('d-none')

        // console.log("data: ",data)

        var apiResponseArray = JSON.parse(data);

        // processing

        if(isReturn && inputData["isReturn"] === "any"){
            apiResponseArray = CreateFlightPairs(apiResponseArray);
        }
        if (apiResponseArray.length !== 0){
            
          apiResponseArray.sort(function(a, b) {
              var dateA;
              var dateB;

              if(isReturn){
                  dateA = new Date(a[0].departureDate);
                  dateB = new Date(b[0].departureDate);
              } else {
                  dateA = new Date(a.departureDate);
                  dateB = new Date(b.departureDate);
              }
              
              return dateA - dateB;
          });

          RenderData(apiResponseArray);
        } else  {
          document.getElementById('results-content').innerHTML = `<br class="bro"><br class="bro"><br class="bro"><br class="bro">No flights between selected parameters at all :c<br class="bro"><br class="bro">`;
        }
        
        // still fetch processing :D
      })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function CreateFlightPairs(apiResponseA) {
  const flightPairs = [];

  for (const container of apiResponseA) {
    for (const tuple of container) {
      flightPairs.push(tuple);
    }
  }

  console.log(flightPairs)

  return flightPairs;
}

export async function loadSupportedAirports() {
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
  
      let supportedAirports = airportData.map((airport) => {
        return `${airport.name} (${airport.code})`;
      });
  
      return supportedAirports;
    } catch (error) {
      //showError('Error loading supported airports:', error);
      return [];
    }
}


function RenderData(apiResponseArray){
  let resultDiv = document.getElementById('results-content')
  resultDiv.classList.add('daddy-size')

  if (isReturn){
    apiResponseArray.forEach(function (item) {
        console.log(item)

        var parentDiv = document.createElement('div');
        //parentDiv.style.display = 'flex'; 
        parentDiv.classList.add('card')

        var divElement1 = document.createElement('div');

        const resultDepart1 = SplitDateTime(item[0].departureDate);
        const resultArrive1 = SplitDateTime(item[0].arrivalDate);

        divElement1.innerHTML = `
            <div>From ${item[0].From} to ${item[0].To}</div>
            <div>${resultDepart1.date} at ${resultDepart1.time}</div>
            <div>  ->  ${resultArrive1.date} at ${resultArrive1.time}</div>
            <div><span>Price: ${item[0].price.value} EUR</span></div>
        `;

        var divElement2 = document.createElement('div');

        const resultDepart2 = SplitDateTime(item[1].departureDate);
        const resultArrive2 = SplitDateTime(item[1].arrivalDate);

        divElement2.innerHTML = `
            <div>From ${item[1].From} to ${item[1].To}</div>
            <div>${resultDepart2.date} at ${resultDepart2.time}</div>
            <div>  ->  ${resultArrive2.date} at ${resultArrive2.time}</div>
            <div><span>Price: ${item[1].price.value} EUR</span></div>
        `;

        divElement1.style.marginRight = '5%';
        divElement2.style.borderLeft = '3px dotted black';
        divElement2.style.borderLeftS = 'black';
        // divElement2.style.width = '20%';
        divElement2.style.paddingLeft = '5%';
        parentDiv.appendChild(divElement1);
        parentDiv.appendChild(divElement2);

        var divElement = document.createElement('div');
        divElement.innerHTML = `
            <div><span><b>Total price:</b> ${(item[0].price.value + item[1].price.value).toFixed(2)} EUR (both tickets sum)</span></div>
            <br></br>
        `;

        parentDiv.appendChild(divElement)
        resultDiv.appendChild(parentDiv);

    });
} else {
    apiResponseArray.forEach(function (item) {
      console.log(item)
        var divElement = document.createElement('div');

        const resultDepart = SplitDateTime(item.departureDate);
        const resultArrive = SplitDateTime(item.isReturnDate);
    
        divElement.innerHTML = `
          <div>From ${item.From} to ${item.To}</div>
          <div>${resultDepart.date} at ${resultDepart.time}  ->  ${resultArrive.date} at ${resultArrive.time}</div>
          <div><span >Price: ${item.price.value} EUR</span></div>
          <br></br>
        `;
    
        resultDiv.appendChild(divElement);
    });
}

let newBro = document.createElement('br')
newBro.classList.add('bro')
resultDiv.appendChild(newBro)
resultDiv.appendChild(newBro)

}


function SplitDateTime(dateTimeString) {
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