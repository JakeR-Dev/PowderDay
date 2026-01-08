import { useState, useEffect } from 'react'
import getSendScore from '../../utils/getSendScore'
import getResortInfo from '../../utils/getResortInfo'
import getStatusClass from '../../utils/getStatusClass'
import './SearchResults.scss'

export default function SearchResults({ loading, setLoading, results, hasSearched, setHasSearched }) {
  const [expandedResortId, setExpandedResortId] = useState(null);
  const [resortData, setResortData] = useState({});

  // fetch all resort data when results change
  useEffect(() => {
    const fetchAllResortData = async () => {
      if (results.length === 0) return;

      const dataPromises = results.items.map(async (resort) => {
        const info = await getResortInfo(resort.id);
        return { id: resort.id, ...info };
      });

      const allData = await Promise.all(dataPromises);
      const dataMap = {};
      allData.forEach((data) => {
        dataMap[data.id] = data;
      });
      setHasSearched(true);
      setLoading(false);
      setResortData(dataMap);
    };

    fetchAllResortData();
  }, [results]);
  
  return (
    <div className="search-results">
      {/* loading spinner */}
      {loading ? (
        <div className="loader">
          <p className="sr-only">Loading resort data...</p>
          <div className="loader-one" aria-hidden></div>
          <div className="loader-two" aria-hidden></div>
        </div>
      // if no results after search
      ) : (results.length === 0 || !results.items || results.items.length === 0) && hasSearched ? (
        <p>No results found, try something else.</p>
      // if haven't searched yet
      ) : results.length === 0 ? (
        <p></p>
      // otherwise, show results
      ) : (
        <ul>
          {/* loop through results */}
          {results.items.map((resort) => {
            // use the resort ID to reference the array item for the resort
            const data = resortData[resort.id];
            // console.log(data);
            const resortName = data?.name;
            const status = data?.resortStatus || "7";
            const statusClass = getStatusClass(status);
            const isOpen = expandedResortId === resort.id;
            const freshies = data?.minLast24Hours + data?.maxLast24Hours / 2;
            const stash = data?.snowLast48Hours;
            const surface = data?.primarySurfaceCondition || 'N/A';
            const sendScore = getSendScore(status, freshies, stash, surface);

            return (
              <li key={resort.id} className="resort">
                {/* resort status */}
                <span className="resort-left text-center">
                  <span className={`resort-status ${statusClass}`}>Resort Status = {status}</span>
                  <span className="send-score">{sendScore}</span>
                </span>
                {/* resort name */}
                <span className="resort-middle text-left">
                  <h5>{resortName}</h5>
                  <h6 className="color-gray">{data?.location}</h6>
                  <button onClick={() => setExpandedResortId(isOpen ? null : resort.id)} className="btn-simple">
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
            );
          })}
        </ul>
      )}
    </div>
  )
}