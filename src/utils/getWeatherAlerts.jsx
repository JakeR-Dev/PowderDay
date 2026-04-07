// helper function to flag any extreme weather
export default function getWeatherAlerts(forecastWind, forecastMinTemp, forecastWeather) {
  const windValues = typeof forecastWind === 'string'
    ? (forecastWind.match(/\d+(?:\.\d+)?/g) || []).map(Number)
    : (Number.isFinite(forecastWind) ? [forecastWind] : []);
  const maxWind = windValues.length ? Math.max(...windValues) : null;
  const hasThunder = typeof forecastWeather === 'string' && /\bthunder(storms?)?\b/i.test(forecastWeather);
  const hasHail = typeof forecastWeather === 'string' && /\bhail\b/i.test(forecastWeather);
  const hasHeavyRain = typeof forecastWeather === 'string' && /\bheavy rain\b/i.test(forecastWeather);

  if (forecastWind !== null && forecastMinTemp < 0) return '⚠︎ Extreme cold'
  if (hasHail) return '⚠︎ Hail'
  if (hasThunder) return '⚠︎ Thunderstorms'
  if (hasHeavyRain) return '⚠︎ Heavy rain'
  if (maxWind !== null && maxWind > 40) return '⚠︎ Extreme wind'
  if (maxWind !== null && maxWind > 30) return '⚠︎ High wind'
  if (maxWind !== null && maxWind > 20) return '⚠︎ Strong wind'
  return 'None';
}