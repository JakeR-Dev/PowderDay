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
  const resortStr = resortName + ', ' + resortState;
  // use the cached coordinates if they exist
  const cached = coordinatesList[resortStr] ? (coordinatesList[resortStr].coordinates || coordinatesList[resortStr]) : null;
  if (cached) return cached;

  // otherwise, retrieve them from the api
  const GEOAPIFY_KEY = '304569c2baf9445ab41a9a49168602f8';
  const url = 'https://api.geoapify.com/v1/geocode/search?text=' + encodeURIComponent(resortStr) + '&state=' + encodeURIComponent(resortState) + '&lang=en&limit=1&filter=countrycode:us,ca&format=json&apiKey=' + GEOAPIFY_KEY;
  const options = {
    method: 'GET'
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const coordinates = result && result.results.length ? result.results[0].lat + ',' + result.results[0].lon : null;
    return coordinates;
  } catch (error) {
    console.error(error);
  }
}

export async function getForecastURL(resortName, resortState) {
  const resortStr = resortName + ', ' + resortState;
  // use the cached forecast url if it exists
  const cachedForecastURL = coordinatesList[resortStr] ? coordinatesList[resortStr].forecast : null;
  if (cachedForecastURL) return cachedForecastURL;

  // otherwise, fetch it from API
  const coordinates = await getResortCoordinates(resortName, resortState);
  if (!coordinates) return null;

  const gridPointURL = 'https://api.weather.gov/points/' + encodeURIComponent(coordinates);
  const options = {
    Accept: "application/geo+json",
    "User-Agent": "Powder Day (jryan6492@gmail.com)",
  }

  try {
    // translate the lat/lon coordinates into a grid point
    const gridPoints = await fetch(gridPointURL, options);
    if (!gridPoints) return null;

    // get the forecast url from the grid point data
    const gridData = await gridPoints.json();
    const forecastURL = gridData?.properties?.forecast;
    if (forecastURL) return forecastURL;

    // otherwise, return null
    return null;
  } catch (error) {
    console.log(error);
  }
}

// get national weather service info for resort
export async function getResortWeather(resortName, resortState) {
  const forecastURL = await getForecastURL(resortName, resortState);
  if (!forecastURL) return null;
  // console.log(forecastURL);
  const options = {
    Accept: "application/geo+json",
    "User-Agent": "Powder Day (jryan6492@gmail.com)",
  }

  try {
    // get the forecast
    const forecastData = await fetch(forecastURL, options);
    const forecast = await forecastData.json();
    return (forecast);
  } catch (error) {
    console.error(error);
  }
}

// use weatherApi to get weather instead of national weather service
export async function getResortWeatherCan(resortName, resortState) {
  const coordinates = await getResortCoordinates(resortName, resortState);
  if (!coordinates) return null;

  const url = 'https://api.weatherapi.com/v1/forecast.json?key=7af5f47e0fc24880a32195158260502&q=' + encodeURIComponent(coordinates);
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