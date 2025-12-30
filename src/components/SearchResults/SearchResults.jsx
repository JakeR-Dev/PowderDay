import { useState } from 'react'
import './SearchResults.scss'

export default function SearchResults({ results, getResortSnowReport }) {
  const [expandedResortId, setExpandedResortId] = useState(null);
  const [resortStatus, setResortStatus] = useState('Open');
  const [snowLast24Hours, setSnowLast24Hours] = useState(0);
  const [baseDepthMin, setBaseDepthMin] = useState(0);
  const [baseDepthMax, setBaseDepthMax] = useState(0);
  const [primarySurfaceCondition, setPrimarySurfaceCondition] = useState('N/A');
  const [openDownHillPercent, setOpenDownHillPercent] = useState('N/A');
  const [openDownHillLifts, setOpenDownHillLifts] = useState('N/A');
  const [maxDownHillLifts, setMaxDownHillLifts] = useState('N/A');
  const [reportDateTime, setReportDateTime] = useState('N/A');
  const [comments, setComments] = useState('N/A');

  const showMore = async (resortId) => {
    if (expandedResortId === resortId) {
      setExpandedResortId(null);
    } else {
      const data = await getResortSnowReport(resortId);
      setExpandedResortId(resortId);
      // console.log(data.items[0]);
      setResortStatus(data.items[0].operatingStatus || 'Open');
      setSnowLast24Hours(data.items[0].snowLast24Hours || 0);
      setBaseDepthMin(data.items[0].avgBaseDepthMin || 0);
      setBaseDepthMax(data.items[0].avgBaseDepthMax || 0);
      setPrimarySurfaceCondition(data.items[0].primarySurfaceCondition || 'N/A');
      setOpenDownHillPercent(data.items[0].openDownHillPercent || 'N/A');
      setOpenDownHillLifts(data.items[0].openDownHillLifts || 'N/A');
      setMaxDownHillLifts(data.items[0].maxOpenDownHillLifts || 'N/A');
      setReportDateTime(data.items[0].reportDateTime || 'N/A');
      setComments(data.items[0].snowComments || 'N/A');
    }
  };

  return (
    <div className="search-results">
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {results.items.map((resort) => (
            <li key={resort.id}>
              <h3>{resort.resortName}</h3>
              <button onClick={() => showMore(resort.id)}>
                {expandedResortId === resort.id ? 'Less -' : 'More +'}
              </button>
              {expandedResortId === resort.id && (
                <span className="the-goods">
                  <span><b>Operating Status:</b> {resortStatus}</span>
                  <span><b>Snow Last 24 Hours:</b> {snowLast24Hours}"</span>
                  <span><b>Base Depth Min:</b> {baseDepthMin}"</span>
                  <span><b>Base Depth Max:</b> {baseDepthMax}"</span>
                  <span><b>Primary Surface:</b> {primarySurfaceCondition}</span>
                  <span><b>Open Percent:</b> {openDownHillPercent}%</span>
                  <span><b>Open Lifts:</b> {openDownHillLifts} / {maxDownHillLifts}</span>
                  <span><b>Report Date:</b> {reportDateTime}</span>
                  <span className="block"><b>Comments:</b> {comments}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}