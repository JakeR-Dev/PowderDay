import { getResortSnowReport, getResortWeather, getResortWeatherCan } from '../Api.jsx';
import forEachLimit from './forEachLimit';

// snocountry returns a max of 3 resorts per snow report call
const SNOW_REPORT_BATCH_SIZE = 3;

// use snocountry api to get resort info
export default async function getResortInfo(resortID) {
  const data = await getResortSnowReport(resortID);
  return formatResortInfo(data?.items?.[0]);
}

// use snocountry api to get info for many resorts, batched to cut down on requests
export async function getResortsInfo(resortIDs) {
  const batches = [];
  for (let i = 0; i < resortIDs.length; i += SNOW_REPORT_BATCH_SIZE) {
    batches.push(resortIDs.slice(i, i + SNOW_REPORT_BATCH_SIZE).join(','));
  }

  const allInfo = [];
  await forEachLimit(batches, 6, async (ids) => {
    const data = await getResortSnowReport(ids);
    (data?.items || []).forEach((item) => {
      allInfo.push({ id: String(item.id), ...formatResortInfo(item) });
    });
  });

  return allInfo;
}

// format a single snocountry snow report item into resort info
function formatResortInfo(resortInfo) {
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
    freshies: ((Number(resortInfo?.newSnowMin) || 0) + (Number(resortInfo?.newSnowMax) || 0)) / 2,
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