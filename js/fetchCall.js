export function findTickets(data, callback){
    console.log("API calling with data : ")
    console.log(data)
    //
    setTimeout(callback, 5000);
    //
    //call api
    //callback()
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