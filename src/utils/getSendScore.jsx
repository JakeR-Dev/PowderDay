// helper to get 'send score'
export default function getSendScore(status, freshies, stash, surface, forecastWeather) {
  const forecastWeatherLower = forecastWeather ? forecastWeather.toLowerCase() : '';
  const powFlags = ['snow', 'snow showers', 'heavy snow likely', 'heavy snow'];
  // snowing today
  if (status === "1" && (surface === 'Powder' || surface === 'Packed Powder')) {
    if (freshies + stash >= 12 || powFlags.some(flag => forecastWeatherLower === flag)) {
      return 'pow';
    } else if (freshies + stash >= 6) {
      return 'super';
    } else if (freshies + stash >= 3) {
      return 'great';
    } else {
      return 'good';
    }
  // groomed conditions
  } else if (status === "1" && (surface === 'Machine Groomed')) {
    if (powFlags.some(flag => forecastWeatherLower === flag)) {
      return 'pow';
    } else if (freshies + stash >= 6) {
      return 'great';
    } else if (freshies + stash >= 3) {
      return 'good';
    } else {
      return 'fair';
    }
  // variable conditions
  } else if (status === "1") {
    if (forecastWeather && (forecastWeather.toLowerCase() == 'snow' || forecastWeather.toLowerCase() == 'snow showers' || forecastWeather.toLowerCase().includes('heavy snow likely'))) {
      return 'pow';
    } else if (freshies + stash >= 3) {
      return 'good';
    } else {
      return 'fair';
    }
  // resort not open for skiing
  } else {
    return 'N/A';
  }
}