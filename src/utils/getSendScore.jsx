// helper to get 'send score'
export default function getSendScore(status, freshies, stash, surface, forecastWeather, forecastSnow) {
  const forecastWeatherLower = forecastWeather ? forecastWeather.toLowerCase() : '';
  const powFlags = ['snow', 'snow showers', 'heavy snow likely', 'heavy snow'];
 
  // **
  // powder or packed powder conditions
  // **

  if (status === "1" && (surface === 'Powder' || surface === 'Packed Powder')) {
    // big stash, probably snowing today
    if (freshies + stash >= 12 || (powFlags.some(flag => forecastWeatherLower === flag) && forecastSnow >= 75)) {
      return 'pow';
    // good stash, possibly snowing today
    } else if (freshies + stash >= 6 || (powFlags.some(flag => forecastWeatherLower === flag) && forecastSnow >= 50)) {
      return 'super';
    // some stash, possibly showing today
    } else if (freshies + stash >= 3 || (powFlags.some(flag => forecastWeatherLower === flag) && forecastSnow >= 50)) {
      return 'great';
    // still powder or packed powder conditions
    } else {
      return 'good';
    }
  
  // **
  // groomed conditions
  // **

  } else if (status === "1" && (surface === 'Machine Groomed')) {
    // snowing today with good base
    if (powFlags.some(flag => forecastWeatherLower === flag) && forecastSnow >= 75) {
      return 'pow';
    // good stash, probably snowing today
    } else if (freshies + stash >= 6 || (powFlags.some(flag => forecastWeatherLower === flag) && forecastSnow >= 50)) {
      return 'great';
    // some stash, possibly snowing today
    } else if (freshies + stash >= 3 || (powFlags.some(flag => forecastWeatherLower === flag) && forecastSnow >= 50)) {
      return 'good';
    // still groomed conditions
    } else {
      return 'fair';
    }

  // **
  // variable conditions
  // **

  } else if (status === "1") {
    // snowing today
    if (forecastWeather && (powFlags.some(flag => forecastWeatherLower === flag) && forecastSnow >= 90)) {
      return 'pow';
    // some stash, probably snowing today
    } else if (freshies + stash >= 3 || (powFlags.some(flag => forecastWeatherLower === flag) && forecastSnow >= 75)) {
      return 'good';
    // variable conditions
    } else {
      return 'fair';
    }

  // **
  // resort not open for skiing
  // **
  
  } else {
    return 'N/A';
  }
}