// function to reference the national weather service api to get the forecast for a resort
// acts as a proxy between the front-end and the national weather service api
// no api key needed, but proxying lets vercel cache forecasts across visitors

import { getQueryValue, handleOptions, proxyJson, rejectInvalidMethod, setCorsHeaders } from './_utils.js';

// only allow grid point lookups (points/lat,lon) and forecasts (gridpoints/OFFICE/x,y/forecast)
const PATH_REGEX = /^(points\/-?\d+(\.\d+)?,-?\d+(\.\d+)?|gridpoints\/[A-Z]{2,4}\/\d+,\d+\/forecast)$/;

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);
  if (rejectInvalidMethod(req, res)) return;

  const path = getQueryValue(req, 'path');
  if (!path || !PATH_REGEX.test(path)) {
    res.status(400).json({ error: 'Invalid path query parameter' });
    return;
  }

  const url = `https://api.weather.gov/${path}`;

  try {
    await proxyJson(url, res, {
      Accept: 'application/geo+json',
      'User-Agent': 'Powder Day (jryan6492@gmail.com)',
    });
  } catch {
    res.status(502).json({ error: 'Failed to reach National Weather Service API' });
  }
}
