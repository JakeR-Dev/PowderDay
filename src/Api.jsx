import { usStates, canadaProvinces } from './data/statesList'
import { coordinatesList } from './data/coordinatesList'

// call the deployed Vercel API for local development
// for production, use same-origin /api routes.
const API_BASE_URL = (import.meta.env.DEV ? 'https://powder-day.vercel.app' : '').replace(/\/$/, '');

// helper function to build vercel-hosted api urls
const buildApiUrl = (path, params = {}) => {
  const query = new URLSearchParams(params);
  const queryString = query.toString();
  const endpoint = `${API_BASE_URL}${path}`;
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

// helper function to fetch json from an api endpoint
const fetchJson = async (url, options = { method: 'GET' }) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType?.includes('application/json')) {
    throw new Error(`Expected JSON response but received: ${contentType || 'unknown content type'}`);
  }

  return response.json();
};

// list resorts by state
export async function listResorts(stateCode = 'vt') {
  const url = buildApiUrl('/api/list-resorts', {
    resortType: 'alpine',
    states: stateCode,
  });

  try {
    return await fetchJson(url);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// search resorts by name
export async function listAllResorts() {
  const allStates = [...usStates, ...canadaProvinces].map(s => s.value.toLowerCase()).join(',');
  const url = buildApiUrl('/api/list-resorts', {
    states: allStates,
  });

  try {
    return await fetchJson(url);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// get single resort snow report
export async function getResortSnowReport(resortId) {
  const url = buildApiUrl('/api/snow-report', {
    ids: resortId,
  });

  try {
    return await fetchJson(url);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// get resort coordinates by name
export async function getResortCoordinates(resortName, resortState) {
  const resortStr = resortName + ', ' + resortState;
  // use the cached coordinates if they exist
  const cached = coordinatesList[resortStr] ? (coordinatesList[resortStr].coordinates || coordinatesList[resortStr]) : null;
  if (cached) return cached;

  // otherwise, retrieve them from the api
  const url = buildApiUrl('/api/geocode', {
    text: resortStr,
    state: resortState,
  });

  try {
    const result = await fetchJson(url);
    const coordinates = result && result.results.length ? result.results[0].lat + ',' + result.results[0].lon : null;
    return coordinates;
  } catch (error) {
    console.error(error);
  }
}

// get the national weather service forecast url of the resort
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
    // translate the lat/lon coordinates into a grid point using national weather service api
    const gridPoints = await fetch(gridPointURL, options);
    if (!gridPoints) return null;

    // get the forecast url from the grid point data
    const gridData = await gridPoints.json();
    const forecastURL = gridData?.properties?.forecast;
    if (forecastURL) return forecastURL;

    // otherwise, return null
    return null;
  } catch (error) {
    console.error(error);
  }
}

// get national weather service info for resort
export async function getResortWeather(resortName, resortState) {
  const forecastURL = await getForecastURL(resortName, resortState);
  if (!forecastURL) return null;

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

// for Canada, use weatherApi to get weather instead of national weather service
export async function getResortWeatherCan(resortName, resortState) {
  const coordinates = await getResortCoordinates(resortName, resortState);
  if (!coordinates) return null;

  const url = buildApiUrl('/api/weather-can', {
    q: coordinates,
    days: 2,
  });

  try {
    return await fetchJson(url);
  } catch (error) {
    console.error(error);
    return null;
  }
}