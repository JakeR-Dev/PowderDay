import { getQueryValue, getServerEnv, handleOptions, proxyJson, rejectInvalidMethod, setCorsHeaders } from './_utils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);
  if (rejectInvalidMethod(req, res)) return;

  const text = getQueryValue(req, 'text');
  const state = getQueryValue(req, 'state');

  if (!text || !state) {
    res.status(400).json({ error: 'Missing text or state query parameter' });
    return;
  }

  const apiKey = getServerEnv('GEOAPIFY_API_KEY', res);
  if (!apiKey) return;

  const query = new URLSearchParams({
    text,
    state,
    lang: 'en',
    limit: '1',
    filter: 'countrycode:us,ca',
    format: 'json',
    apiKey,
  });

  const url = `https://api.geoapify.com/v1/geocode/search?${query.toString()}`;

  try {
    await proxyJson(url, res);
  } catch {
    res.status(502).json({ error: 'Failed to reach Geoapify API' });
  }
}
