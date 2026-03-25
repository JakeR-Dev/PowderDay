import { getQueryValue, getServerEnv, handleOptions, proxyJson, rejectInvalidMethod, setCorsHeaders } from './_utils.js';

const STATES_REGEX = /^[a-z,]+$/i;

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);
  if (rejectInvalidMethod(req, res)) return;

  const states = getQueryValue(req, 'states');
  const resortType = getQueryValue(req, 'resortType');

  if (!states || !STATES_REGEX.test(states)) {
    res.status(400).json({ error: 'Invalid states query parameter' });
    return;
  }

  const apiKey = getServerEnv('SNOCOUNTRY_API_KEY', res);
  if (!apiKey) return;

  const query = new URLSearchParams({
    apiKey,
    states,
    output: 'json',
  });

  if (resortType) {
    query.set('resortType', resortType);
  }

  const url = `https://feeds.snocountry.net/getResortList.php?${query.toString()}`;

  try {
    await proxyJson(url, res);
  } catch {
    res.status(502).json({ error: 'Failed to reach SnoCountry API' });
  }
}
