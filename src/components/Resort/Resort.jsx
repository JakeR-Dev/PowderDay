import { useState } from 'react'
import getSendScore from '../../utils/getSendScore'
import getStatusClass from '../../utils/getStatusClass'
import './Resort.scss'

export default function Resort({ resortID, data, favoriteClass, handleFavoriteClick }) {
  const [expandedResortId, setExpandedResortId] = useState(null);
  const resortName = data?.name;
  const status = data?.resortStatus || "7";
  const statusClass = getStatusClass(status);
  const isOpen = expandedResortId === resortID;
  const freshies = data?.minLast24Hours + data?.maxLast24Hours / 2;
  const stash = data?.snowLast48Hours;
  const surface = data?.primarySurfaceCondition || 'N/A';
  const sendScore = getSendScore(status, freshies, stash, surface);
  const location = data?.location;

  return (
    <li className="resort">
      {/* resort status */}
      <span className="resort-left text-center">
        <span className={`resort-status ${statusClass}`}>Resort Status = {status}</span>
        <span className="send-score">{sendScore}</span>
        <a className={`favorite ${favoriteClass}`} aria-label="click to favorite this resort" onClick={() => handleFavoriteClick(resortID)}>
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
        <span className="quick-look"><b>Freshies (24hrs):</b> {freshies}"</span>
        <span className="quick-look"><b>Base Depth:</b> {data?.baseDepthMin === data?.baseDepthMax ? data?.baseDepthMin + '"' : `${data?.baseDepthMin}" - ${data?.baseDepthMax}"`}</span>
        <span className="quick-look"><b>Primary Surface:</b> {surface}</span>
      </span>
      {/* resort additional info */}
      {isOpen && data && (
        <span className="the-goods text-left">
          <span><b>Operating Status:</b> {data.operatingStatus === '' ? 'Open' : data.operatingStatus}</span>
          <span><b>Open Percent:</b> {data.openDownHillPercent}%</span>
          <span><b>Stash (48hrs):</b> {stash}"</span>
          <span><b>Open Lifts:</b> {data.openDownHillLifts} / {data.maxDownHillLifts}</span>
          <span><b>Weekday Hours:</b> {data.weekdayHours}</span>
          <span><b>Weekend Hours:</b> {data.weekendHours}</span>
          <span><b>Report Date:</b> {data.reportDateTime}</span>
          <span><b>Comments:</b> {data.comments}</span>
          {data.trailMapUrl !== '' ? <span className="block"><a href={data.trailMapUrl} target="_blank" rel="noopener noreferrer" className="btn-simple">View Trail Map</a></span> : null}
        </span>
      )}
    </li>
  )
}