function fetchData(url) {
  return new Promise((resolve, reject) => {
    // Simulate a longer time of waiting (e.g., 5 seconds)
    setTimeout(() => {
      fetch(url)
        .then(response => response.json())
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

export function findTickets(data) {
  console.log(data)
  // blinking-class
  const progressPlanesA = document.querySelectorAll('.rotated-icon-active')
  
  progressPlanesA.forEach((plane, index) => {
    setTimeout(() => {
      plane.classList.add('blinking-class');
    }, index * 200); // Delay increases with each element
  });

  // Start the fetch request
  const fetchPromise = fetchData('https://jsonplaceholder.typicode.com/posts/');
  
  fetchPromise
    .then(data => {
        progressPlanesA.forEach((plane, index) => {
          plane.classList.remove('blinking-class');
        })
        document.getElementById('landing-content').classList.add('d-none')
        document.getElementById('results-content').classList.remove('d-none')
      })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
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