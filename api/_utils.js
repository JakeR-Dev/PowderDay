const DEFAULT_ALLOWED_ORIGINS = ['https://powderday.io', 'http://localhost:5173'];

const getAllowedOrigins = () => {
  const configured = process.env.ALLOWED_ORIGINS;
  if (!configured) return DEFAULT_ALLOWED_ORIGINS;

  return configured
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export const handleOptions = (req, res) => {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }

  return false;
};

export const rejectInvalidMethod = (req, res, allowedMethod = 'GET') => {
  if (req.method !== allowedMethod) {
    res.status(405).json({ error: 'Method not allowed' });
    return true;
  }

  return false;
};

export const getQueryValue = (req, key) => {
  const value = req.query?.[key];
  return Array.isArray(value) ? value[0] : value;
};

export const getServerEnv = (name, res) => {
  const value = process.env[name];
  if (!value) {
    res.status(500).json({ error: `Missing server env var: ${name}` });
    return null;
  }

  return value;
};

export const proxyJson = async (url, res) => {
  const response = await fetch(url, { method: 'GET' });
  const text = await response.text();

  if (!response.ok) {
    res.status(response.status).json({ error: 'Upstream request failed' });
    return;
  }

  res.status(200).json(JSON.parse(text));
};
