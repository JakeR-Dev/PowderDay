// helper to shorten lengthy forecast verbiage
export default function getForecastVerbiage(forecastWeatherRaw) {
  if (!forecastWeatherRaw) return null;

  // strip filler words and normalize spacing
  const normalized = forecastWeatherRaw
    .replace(/\s+(and|or|then)\s+/gi, ', ')
    .replace(/\b(areas of|slight|patchy|mostly|moderate|heavy|very)\b/gi, '')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\bthunderstorms?\b/gi, 'T-Storms')
    .trim();

  // make sure forecast terms aren't repeated
  const parts = normalized.split(',').map((part) => part.trim()).filter(Boolean);
  const seen = new Set();
  const deduped = parts.filter((part) => {
    const key = part.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.join(', ');
}