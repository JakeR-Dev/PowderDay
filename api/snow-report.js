// function to reference the snocountry api to get the snow report for a resort
// acts as a proxy between the front-end and the snocountry api

import { getQueryValue, getServerEnv, handleOptions, proxyJson, rejectInvalidMethod, setCorsHeaders } from './_utils.js';

const IDS_REGEX = /^[0-9,]+$/;

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);
  if (rejectInvalidMethod(req, res)) return;

  const ids = getQueryValue(req, 'ids');
  if (!ids || !IDS_REGEX.test(ids)) {
    res.status(400).json({ error: 'Invalid ids query parameter' });
    return;
  }

  const apiKey = getServerEnv('SNOCOUNTRY_API_KEY', res);
  if (!apiKey) return;

  const query = new URLSearchParams({
    apiKey,
    ids,
    output: 'json',
  });
  const url = `https://feeds.snocountry.net/getSnowReport.php?${query.toString()}`;

  try {
    await proxyJson(url, res);
  } catch {
    res.status(502).json({ error: 'Failed to reach SnoCountry API' });
  }
}
