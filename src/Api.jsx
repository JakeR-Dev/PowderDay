import { usStates, canadaProvinces } from './data/statesList'

// list resorts by state
export async function listResorts(stateCode = 'vt') {
  const url = 'https://feeds.snocountry.net/getResortList.php?apiKey=SnoCountry.example&resortType=alpine&states=' + stateCode + '&output=json';
  const options = {
    method: 'GET'
  };
  
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result);
  } catch (error) {
    console.error(error);
  }
}

// search resorts by name
export async function listAllResorts() {
  // get all the states and provinces, join them into a comma-separated list to be used in fetch
  const allStates = [...usStates, ...canadaProvinces].map(s => s.value.toLowerCase()).join(',');
  const url = 'https://feeds.snocountry.net/getResortList.php?apiKey=SnoCountry.example&states=' + allStates + '&output=json';
  const options = {
    method: 'GET'
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result);
  } catch (error) {
    console.error(error);
  }
}

// get single resort snow report
export async function getResortSnowReport(resortId) {
  const url = 'https://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=' + resortId + '&output=json';
  const options = {
    method: 'GET'
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result);
  } catch (error) {
    console.error(error);
  }
}

// get resort coordinates name
export async function getResortCoordinates(resortName, resortState) {
  const resortStr = resortName + ',' + resortState;
  const url = 'https://nominatim.openstreetmap.org/search?q=' + resortStr + '&format=json&limit=1&countrycodes=CA,US';
  const options = {
    method: 'GET'
  };

  try {
    const response = await fetch(url, options);
    const result = JSON.parse(await response.text());
    const coordinates = result ? result[0].lat + ',' + result[0].lon : 'null';
    return coordinates;
  } catch (error) {
    console.error(error);
  }
}

// getResortZip('Okemo Mountain Resort', 'VT');

// get weather info for resort
export async function getResortWeather(resortName, resortState) {
  const coordinates = await getResortCoordinates(resortName, resortState);
  const url = 'https://api.weatherapi.com/v1/current.json?key=7af5f47e0fc24880a32195158260502&q=' + coordinates;
  const options = {
    method: 'GET'
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result);
  } catch (error) {
    console.error(error);
  }
}