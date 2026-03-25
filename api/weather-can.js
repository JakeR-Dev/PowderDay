import { getQueryValue, getServerEnv, handleOptions, proxyJson, rejectInvalidMethod, setCorsHeaders } from './_utils.js';

const DAYS_REGEX = /^[1-3]$/;

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);
  if (rejectInvalidMethod(req, res)) return;

  const q = getQueryValue(req, 'q');
  const days = getQueryValue(req, 'days') || '2';

  if (!q || !DAYS_REGEX.test(days)) {
    res.status(400).json({ error: 'Invalid q or days query parameter' });
    return;
  }

  const apiKey = getServerEnv('WEATHERAPI_API_KEY', res);
  if (!apiKey) return;

  const query = new URLSearchParams({
    key: apiKey,
    q,
    days,
  });
  const url = `https://api.weatherapi.com/v1/forecast.json?${query.toString()}`;

  try {
    await proxyJson(url, res);
  } catch {
    res.status(502).json({ error: 'Failed to reach WeatherAPI' });
  }
}
