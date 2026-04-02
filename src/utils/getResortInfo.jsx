import { getResortSnowReport, getResortWeather, getResortWeatherCan } from '../Api.jsx';

// use snocountry api to get resort info
export default async function getResortInfo(resortID) {
  const data = await getResortSnowReport(resortID);
  const resortInfo = data.items[0];
  const resortName = resortInfo?.resortName || 'N/A';
  const resortCountry = resortInfo?.country || '';
  const resortLoc = resortInfo?.state + ', ' + resortCountry || '';

  // format the date
  let reportDate = new Date(resortInfo?.reportDateTime);
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  reportDate = new Intl.DateTimeFormat("en-US", options).format(reportDate);
  reportDate = reportDate.replace(',', ' @');

  return {
    name: resortName,
    location: resortLoc,
    country: resortCountry,
    resortStatus: resortInfo?.resortStatus || '7',
    operatingStatus: resortInfo?.operatingStatus || '',
    minLast24Hours: Number(resortInfo?.newSnowMin) || 0,
    maxLast24Hours: Number(resortInfo?.newSnowMax) || 0,
    baseDepthMin: Number(resortInfo?.avgBaseDepthMin) || 0,
    baseDepthMax: Number(resortInfo?.avgBaseDepthMax) || 0,
    primarySurfaceCondition: resortInfo?.primarySurfaceCondition || 'N/A',
    openDownHillPercent: resortInfo?.openDownHillPercent !== '' ? resortInfo?.openDownHillPercent : '0',
    openDownHillLifts: resortInfo?.openDownHillLifts || '0',
    maxDownHillLifts: resortInfo?.maxOpenDownHillLifts || 'N/A',
    reportDateTime: reportDate || 'N/A',
    comments: resortInfo?.snowComments || 'N/A',
    trailMapUrl: resortInfo?.lgTrailMapURL || '',
    snowLast48Hours: Number(resortInfo?.snowLast48Hours) || 0,
    weekdayHours: resortInfo?.weekdayHours || 'N/A',
    weekendHours: resortInfo?.weekendHours || 'N/A',
    weatherLoading: true,
    forecastWeather: 'Weather loading...',
    forecastWind: 'Weather loading...',
    forecastSnow: null,
    forecastMaxTemp: null,
    forecastTomorrow: null,
    forecastTomorrowMaxTemp: null
  };
}

// use the weatherApi to get CAN resort weather, and national weather service for us weather
export async function getResortForecast(resortName, resortLoc, resortCountry) {
  const isCan = resortCountry === 'CAN';
  const weather = isCan ? await getResortWeatherCan(resortName, resortLoc) : await getResortWeather(resortName, resortLoc);
  const forecast = isCan ? weather?.forecast?.forecastday?.[0]?.day || {} : weather?.properties?.periods?.[0] || {};
  const tomorrowForecast = isCan ? weather?.forecast?.forecastday?.[1]?.day || {} : weather?.properties?.periods?.[2] || {};

  return {
    weatherLoading: false,
    forecastWeather: isCan ? forecast?.condition?.text : forecast?.shortForecast,
    forecastWind: isCan ? Number(forecast?.maxwind_mph) + ' mph' : forecast?.windSpeed,
    forecastSnow: isCan ? Number(forecast?.daily_chance_of_snow) : Number(forecast?.probabilityOfPrecipitation?.value),
    forecastMaxTemp: isCan ? Number(forecast?.maxtemp_f) : Number(forecast?.temperature),
    forecastMinTemp: isCan ? Number(forecast?.mintemp_f) : Number(forecast?.temperature),
    forecastTomorrow: isCan? tomorrowForecast?.condition?.text : tomorrowForecast?.shortForecast,
    forecastTomorrowMaxTemp: isCan ? Number(tomorrowForecast?.maxtemp_f) : Number(tomorrowForecast?.temperature)
  };
}