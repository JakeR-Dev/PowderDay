import { useState } from 'react'
import getSendScore from '../../utils/getSendScore'
import getStatusClass from '../../utils/getStatusClass'
import './Resort.scss'

export default function Resort({ resortID, data, favoriteClass, onToggleFavorite }) {
  const [expandedResortId, setExpandedResortId] = useState(null);

  const resortName = data?.name;
  const status = data?.resortStatus || "7";
  const statusClass = getStatusClass(status);
  const isOpen = expandedResortId === resortID;
  const freshies = data?.minLast24Hours + data?.maxLast24Hours / 2;
  const stash = data?.snowLast48Hours;
  const surface = data?.primarySurfaceCondition || 'N/A';
  const location = data?.location;
  const openPercent = data?.openDownHillPercent;
  const openDiff = openPercent ? Math.round(100 - openPercent) + 'px' : 0 + 'px';
  const openDiffColor =
    (openPercent === 0 || statusClass === 'status-closed bg-red') ? 'open-gray' :
      (openPercent <= 25 && statusClass === 'status-open bg-green') ? 'open-red' :
        (openPercent <= 50 && statusClass === 'status-open bg-green') ? 'open-gold' :
          (openPercent >= 95 && statusClass === 'status-open bg-green') ? 'open-green' :
            'open-blue';
  const forecastWeather =
    (data?.forecastWeather == 'Moderate or heavy snow showers') ? 'Snow showers' :
      (data?.forecastWeather == 'Slight Chance Light Snow' || data?.forecastWeather == 'Slight Chance Very Light Snow' || data?.forecastWeather == 'Slight Chance Light Snow then Partly Sunny') ? 'Chance light snow' :
        (data?.forecastWeather ? data?.forecastWeather.replace(/\s+(and|or|then)\s+/gi, ', ').replace(/(areas of|slight|patchy)\s+/gi, ' ') : null);
  const forecastWind = data?.forecastWind !== undefined ? data?.forecastWind : null;
  const forecastSnow = data?.forecastSnow !== undefined ? Math.round(data?.forecastSnow) : null;
  const forecastMaxTemp = data?.forecastMaxTemp !== undefined ? Math.round(data?.forecastMaxTemp) : null;
  const tomorrowForecastWeather =
    (data?.forecastTomorrow == 'Moderate or heavy snow showers') ? 'Snow showers' :
      (data?.forecastTomorrow == 'Slight Chance Light Snow' || data?.forecastTomorrow == 'Slight Chance Very Light Snow' || data?.forecastTomorrow == 'Slight Chance Light Snow then Partly Sunny') ? 'Chance light snow' :
        (data?.forecastTomorrow ? data?.forecastTomorrow.replace(/\s+(and|or|then)\s+/gi, ', ').replace(/(areas of|slight|patchy)\s+/gi, ' ') : null);
  const tomorrowForecastMaxTemp = data?.forecastTomorrowMaxTemp !== undefined ? Math.round(data?.forecastTomorrowMaxTemp) : null;
  const weatherLoading = data?.weatherLoading === true;
  const hasForecast = forecastWeather != null && forecastMaxTemp != null;
  const safeTrailMapUrl = (() => {
    if (!data?.trailMapUrl) return null;

    try {
      const parsedUrl = new URL(data.trailMapUrl);
      return (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:')
        ? parsedUrl.toString()
        : null;
    } catch {
      return null;
    }
  })();
  const sendScore = getSendScore(status, freshies, stash, surface, forecastWeather, forecastSnow);

  return (
    <li className="resort">
      {/* resort status */}
      <span className="resort-left text-center">
        <span className={`resort-status ${statusClass}`}>Resort Status = {status}</span>
        <span className="send-score">{sendScore}</span>
        <span className="open-percent">
          <svg width="32" height="32" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle className="open-percent_circle" r="14" cx="16" cy="16" fill="transparent" strokeWidth="4"></circle>
            <circle className={`open-percent_progress ${openDiffColor}`} r="14" cx="16" cy="16" strokeWidth="3" strokeLinecap="round" strokeDashoffset={openDiff} dataopen={openPercent}></circle>
            <text x="11" y="20" className="open-percent_text">%</text>
          </svg>
        </span>
        <a className={`favorite favorite_mobile ${favoriteClass}`} aria-label="click to favorite this resort" onClick={() => onToggleFavorite(resortID)}>
          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5L14.9 8.3L21.3 9.2L16.6 13.7L17.7 20.1L12 17.1L6.3 20.1L7.4 13.7L2.7 9.2L9.1 8.3Z" fill="transparent" stroke="#A0A0A0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
        </a>
      </span>
      {/* resort name */}
      <span className="resort-middle text-left">
        <h5>{resortName}</h5>
        <h6 className="color-gray">{location}</h6>
        <button onClick={() => setExpandedResortId(isOpen ? null : resortID)} className="btn-simple">
          {isOpen ? 'Less -' : 'More +'}
        </button>
      </span>
      {/* resort quick look info */}
      <span className="resort-right text-left">
        {/* forecast */}
        {weatherLoading ? (
          <span className="quick-look color-gray"><b>Weather loading...</b></span>
        ) : hasForecast ? (
          <span className="quick-look color-gray"><b>{forecastWeather}</b> &middot; {forecastMaxTemp}&deg;F</span>
        ) : (
          <span className="quick-look color-gray"><b>Forecast Unavailable</b></span>
        )}
        <span className="quick-look"><b>Freshies (24hrs):</b> {freshies}"</span>
        <span className="quick-look"><b>Base Depth:</b> {data?.baseDepthMin === data?.baseDepthMax ? data?.baseDepthMin + '"' : `${data?.baseDepthMin}" - ${data?.baseDepthMax}"`}</span>
        <span className="quick-look"><b>Primary Surface:</b> {surface}</span>
      </span>
      {/* resort favorite */}
      <span className="resort-favorite favorite_desktop">
        <a className={`favorite ${favoriteClass}`} aria-label="click to favorite this resort" onClick={() => onToggleFavorite(resortID)}>
          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5L14.9 8.3L21.3 9.2L16.6 13.7L17.7 20.1L12 17.1L6.3 20.1L7.4 13.7L2.7 9.2L9.1 8.3Z" fill="transparent" stroke="#A0A0A0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
        </a>
      </span>
      {/* resort additional info */}
      {isOpen && data && (
        <span className="the-goods text-left">
          <span><b>Operating Status:</b> {data.operatingStatus === '' ? 'Open' : data.operatingStatus}</span>
          <span><b>Open Percent:</b> {openPercent}%</span>
          <span><b>Stash (48hrs):</b> {stash}"</span>
          <span><b>Open Lifts:</b> {data.openDownHillLifts} / {data.maxDownHillLifts}</span>
          {weatherLoading && (
            <span><b>Forecast:</b> Weather loading...</span>
          )}
          {forecastWind !== null && !weatherLoading && (
            <span><b>Wind: </b>{forecastWind}</span>
          )}
          {forecastSnow !== null && !weatherLoading && (
            <span><b>Chance of Snow:</b> {forecastSnow}%</span>
          )}
          {tomorrowForecastWeather !== null && !weatherLoading && (
            <span><b>Tomorrow:</b> {tomorrowForecastWeather} &middot; {tomorrowForecastMaxTemp}&deg;F</span>
          )}
          <span><b>Weekday Hours:</b> {data.weekdayHours}</span>
          <span><b>Weekend Hours:</b> {data.weekendHours}</span>
          <span><b>Report Date:</b> {data.reportDateTime}</span>
          <span><b>Comments:</b> {data.comments}</span>
          {safeTrailMapUrl ? <span className="block"><a href={safeTrailMapUrl} target="_blank" rel="noopener noreferrer" className="btn-simple">View Trail Map</a></span> : null}
        </span>
      )}
    </li>
  )
}