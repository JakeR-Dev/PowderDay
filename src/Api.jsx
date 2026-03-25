import { usStates, canadaProvinces } from './data/statesList'
import { coordinatesList } from './data/coordinatesList'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://powder-day.vercel.app').replace(/\/$/, '');
const ALL_RESORTS_CACHE_TTL_MS = 5 * 60 * 1000;
let allResortsCache = null;
let allResortsCacheTimestamp = 0;
let allResortsInFlight = null;

const buildApiUrl = (path, params = {}) => {
  const query = new URLSearchParams(params);
  const queryString = query.toString();
  const endpoint = `${API_BASE_URL}${path}`;
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

const fetchJson = async (url, options = { method: 'GET' }) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
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
  const now = Date.now();
  if (allResortsCache && now - allResortsCacheTimestamp < ALL_RESORTS_CACHE_TTL_MS) {
    return allResortsCache;
  }

  if (allResortsInFlight) {
    return allResortsInFlight;
  }

  // get all the states and provinces, join them into a comma-separated list to be used in fetch
  const allStates = [...usStates, ...canadaProvinces].map(s => s.value.toLowerCase()).join(',');
  const url = buildApiUrl('/api/list-resorts', {
    states: allStates,
  });

  allResortsInFlight = (async () => {
    try {
      const parsed = await fetchJson(url);
      allResortsCache = parsed;
      allResortsCacheTimestamp = Date.now();
      return parsed;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      allResortsInFlight = null;
    }
  })();

  return allResortsInFlight;
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

// get resort coordinates name
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
    console.error(error);
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