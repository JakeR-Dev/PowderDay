// set the default allowed origins for CORS
const DEFAULT_ALLOWED_ORIGINS = ['https://powderday.io', 'http://localhost:5173', 'http://localhost:5174'];

// helper function to get allowed origins for CORS
const getAllowedOrigins = () => {
  const configured = process.env.ALLOWED_ORIGINS;
  if (!configured) return DEFAULT_ALLOWED_ORIGINS;

  return configured
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

// helper function to set CORS headers on a response
export const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// helper function to handle OPTIONS requests for CORS preflight
export const handleOptions = (req, res) => {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }

  return false;
};

// helper function to reject requests with invalid HTTP methods
export const rejectInvalidMethod = (req, res, allowedMethod = 'GET') => {
  if (req.method !== allowedMethod) {
    res.status(405).json({ error: 'Method not allowed' });
    return true;
  }

  return false;
};

// helper function to get a query parameter value from the request
export const getQueryValue = (req, key) => {
  const value = req.query?.[key];
  return Array.isArray(value) ? value[0] : value;
};

// helper function to get a server environment variable from vercel
export const getServerEnv = (name, res) => {
  const value = process.env[name];
  if (!value) {
    res.status(500).json({ error: `Missing server env var: ${name}` });
    return null;
  }

  return value;
};

// helper function to proxy a json request to an upstream api (ex SnoCountry, Geoapify, WeatherAPI)
export const proxyJson = async (url, res) => {
  const response = await fetch(url, { method: 'GET' });
  const text = await response.text();

  if (!response.ok) {
    res.status(response.status).json({ error: 'Upstream request failed' });
    return;
  }

  res.status(200).json(JSON.parse(text));
};
