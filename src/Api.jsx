import { usStates, canadaProvinces } from './data/statesList'
import { coordinatesList } from './data/coordinatesList'

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
  const resortStr = encodeURIComponent(resortName + ', ' + resortState) + ' ski';

  // use the cached coordinates if they exist
  const cached = coordinatesList[resortStr] || null;
  if (cached) return cached;

  // otherwise, retrieve them from the api
  const GEOAPIFY_KEY = '304569c2baf9445ab41a9a49168602f8';
  const url = 'https://api.geoapify.com/v1/geocode/search?text=' + resortStr + '&state=' + encodeURIComponent(resortState) + '&lang=en&limit=1&filter=countrycode:us,ca&format=json&apiKey=' + GEOAPIFY_KEY;
  const options = {
    method: 'GET'
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    // console.log(result);
    const coordinates = result && result.results.length ? result.results[0].lat + ',' + result.results[0].lon : null;
    
    // store the coordinates
    if (coordinates) {
      coordinatesList[resortStr] = coordinates;
    }
    // return the newly-stored cordinates
    return coordinates;
  } catch (error) {
    console.error(error);
  }
}

export function exportCoordinatesCache() {
  console.log('Copy this to coordinatesList.js:');
  console.log(JSON.stringify(coordinatesList, null, 2));
  return coordinatesList;
}

// get weather info for resort
export async function getResortWeather(resortName, resortState) {
  // TODO: store coordinates in json file, reference that instead of making fetch call every time
  const coordinates = await getResortCoordinates(resortName, resortState);
  if (!coordinates) return null;

  const url = 'https://api.weatherapi.com/v1/forecast.json?key=7af5f47e0fc24880a32195158260502&q=' + coordinates;
  const options = {
    method: 'GET'
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}