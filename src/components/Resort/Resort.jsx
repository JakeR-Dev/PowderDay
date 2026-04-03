import { useState } from 'react'
import getSendScore from '../../utils/getSendScore'
import getStatusClass from '../../utils/getStatusClass'
import './Resort.scss'

export default function Resort({ resortID, data, favoriteClass, onToggleFavorite }) {
  const [expandedResortId, setExpandedResortId] = useState(null);

  // helper to return an indication color based on resort open percent
  const openDiffColorHelper = (openPercent, statusClass) => {
    return (openPercent === 0 || statusClass === 'status-closed bg-red') ? 'open-gray' :
           (openPercent <= 25 && statusClass === 'status-open bg-green') ? 'open-red' :
           (openPercent <= 50 && statusClass === 'status-open bg-green') ? 'open-gold' :
           (openPercent >= 95 && statusClass === 'status-open bg-green') ? 'open-green' :
           'open-blue';
  }

  // helper to shorten lengthy forecast verbiage
  const forecastVerbiageHelper = (forecastWeatherRaw) => {
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

  // helper to make sure trailmap url is safe and usable
  const safeTrailMapUrlChecker = (traiMapUrl) => {
    if (!traiMapUrl) return null;

    try {
      const parsedUrl = new URL(traiMapUrl);
      return (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') ? parsedUrl.toString() : null;
    } catch {
      return null;
    }
  }

  // helper function to flag any extreme weather
  const weatherAlert = (forecastWind, forecastMinTemp, forecastWeather) => {
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

  const resortName = data?.name;
  const status = data?.resortStatus || "7";
  const statusClass = getStatusClass(status);
  const isOpen = expandedResortId === resortID;
  const freshies = data?.minLast24Hours + data?.maxLast24Hours / 2;
  const stash = data?.snowLast48Hours;
  const surface = data?.primarySurfaceCondition || 'N/A';
  const location = data?.location;
  const openPercent = Number(data?.openDownHillPercent) || 0;
  const openDiff = openPercent ? Math.round(100 - openPercent) + 'px' : 0 + 'px';
  const openDiffColor = openDiffColorHelper(openPercent, statusClass);
  const forecastWeather = forecastVerbiageHelper(data?.forecastWeather);
  const forecastWind = data?.forecastWind !== undefined ? data?.forecastWind : null;
  const forecastSnow = data?.forecastSnow !== undefined ? Math.round(data?.forecastSnow) : null;
  const forecastMaxTemp = data?.forecastMaxTemp !== undefined ? Math.round(data?.forecastMaxTemp) : null;
  const forecastMinTemp = data?.forecastMinTemp !== undefined ? Math.round(data?.forecastMinTemp) : null;
  const tomorrowForecastWeather = forecastVerbiageHelper(data?.forecastTomorrow);
  const tomorrowForecastMaxTemp = data?.forecastTomorrowMaxTemp !== undefined ? Math.round(data?.forecastTomorrowMaxTemp) : null;
  const weatherLoading = data?.weatherLoading === true;
  const hasForecast = forecastWeather != null && forecastMaxTemp != null;
  const safeTrailMapUrl = safeTrailMapUrlChecker(data?.trailMapUrl);
  const sendScore = getSendScore(status, freshies, stash, surface, forecastWeather, forecastSnow);
  const alerts = weatherAlert(forecastWind, forecastMinTemp, data?.forecastWeather);

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
          {!weatherLoading && (
            <span><b>Alerts:</b> <span className={alerts !== 'None' ? 'color-gold' : ''}>{alerts}</span></span>
          )}
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
            <span><b>Precipitation Chance:</b> {forecastSnow}%</span>
          )}
          {tomorrowForecastWeather !== null && !weatherLoading && (
            <span><b>Tomorrow:</b> <span className="capitalized">{tomorrowForecastWeather}</span> &middot; {tomorrowForecastMaxTemp}&deg;F</span>
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