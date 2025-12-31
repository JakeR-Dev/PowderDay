import { useState, useEffect } from 'react'
import './SearchResults.scss'

export default function SearchResults({ results, getResortSnowReport }) {
  const [expandedResortId, setExpandedResortId] = useState(null);
  const [resortData, setResortData] = useState({});

  // Fetch all resort data
  useEffect(() => {
    const fetchAllResortData = async () => {
      if (results.length === 0) return;
      
      const dataPromises = results.items.map(async (resort) => {
        const data = await getResortSnowReport(resort.id);
        const resortInfo = data.items[0];
        
        return {
          id: resort.id,
          resortStatus: resortInfo?.resortStatus || '7',
          operatingStatus: resortInfo?.operatingStatus || '',
          snowLast24Hours: resortInfo?.snowLast24Hours || 0,
          baseDepthMin: resortInfo?.avgBaseDepthMin || 0,
          baseDepthMax: resortInfo?.avgBaseDepthMax || 0,
          primarySurfaceCondition: resortInfo?.primarySurfaceCondition || 'N/A',
          openDownHillPercent: resortInfo?.openDownHillPercent || 'N/A',
          openDownHillLifts: resortInfo?.openDownHillLifts || 'N/A',
          maxDownHillLifts: resortInfo?.maxOpenDownHillLifts || 'N/A',
          reportDateTime: resortInfo?.reportDateTime || 'N/A',
          comments: resortInfo?.snowComments || 'N/A'
        };
      });

      const allData = await Promise.all(dataPromises);
      const dataMap = {};
      allData.forEach((data) => {
        dataMap[data.id] = data;
      });
      setResortData(dataMap);
    };

    fetchAllResortData();
  }, [results, getResortSnowReport]);

  // helper to get status class
  const getStatusClass = (status) => {
    if (status === "1") return 'status-open bg-green';
    if (status === "3" || status === "4") return 'status-warning bg-yellow';
    return 'status-closed bg-red';
  };

  // toggle more info
  const showMore = (resortId) => {
    if (expandedResortId === resortId) {
      setExpandedResortId(null);
    } else {
      setExpandedResortId(resortId);
    }
  };

  return (
    <div className="search-results">
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {results.items.map((resort) => {
            const data = resortData[resort.id];
            // console.log(data);
            const status = data?.resortStatus || "7";
            const snowfall = data?.snowLast24Hours || 0;
            const statusClass = getStatusClass(status);

            return (
              <li key={resort.id}>
                <h4>
                  <span className={`resort-status ${statusClass}`}>Resort Status = {status}</span>
                  {resort.resortName}
                  <span className="send-status">Send status = {snowfall}" in 24hrs</span>
                </h4>
                <button onClick={() => showMore(resort.id)}>
                  {expandedResortId === resort.id ? 'Less -' : 'More +'}
                </button>
                {expandedResortId === resort.id && data && (
                  <span className="the-goods">
                    <span><b>Operating Status:</b> {data.operatingStatus === '' ? 'Open' : data.operatingStatus}</span>
                    <span><b>Snow Last 24 Hours:</b> {data.snowLast24Hours}"</span>
                    <span><b>Base Depth:</b> {data.baseDepthMin === data.baseDepthMax ? data.baseDepthMin + '"' : `${data.baseDepthMin}" - ${data.baseDepthMax}"`}</span>
                    <span><b>Primary Surface:</b> {data.primarySurfaceCondition}</span>
                    <span><b>Open Percent:</b> {data.openDownHillPercent}%</span>
                    <span><b>Open Lifts:</b> {data.openDownHillLifts} / {data.maxDownHillLifts}</span>
                    <span><b>Report Date:</b> {data.reportDateTime}</span>
                    <span className="block"><b>Comments:</b> {data.comments}</span>
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