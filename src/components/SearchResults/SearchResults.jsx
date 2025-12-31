import { useState, useEffect } from 'react'
import './SearchResults.scss'

export default function SearchResults({ results, getResortSnowReport }) {
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
      setResortData(dataMap);
    };

    fetchAllResortData();
  }, [results, getResortSnowReport]);

  // grab a single resort info
  const getResortInfo = async (resortID) => {
    const data = await getResortSnowReport(resortID);
    const resortInfo = data.items[0];
    console.log(resortInfo);
    
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
      name: resortInfo?.resortName || 'N/A',
      location: resortInfo?.state + ', ' + resortInfo?.country || '',
      resortStatus: resortInfo?.resortStatus || '7',
      operatingStatus: resortInfo?.operatingStatus || '',
      minLast24Hours: resortInfo?.newSnowMin || 0,
      maxLast24Hours: resortInfo?.newSnowMax || 0,
      baseDepthMin: resortInfo?.avgBaseDepthMin || 0,
      baseDepthMax: resortInfo?.avgBaseDepthMax || 0,
      primarySurfaceCondition: resortInfo?.primarySurfaceCondition || 'N/A',
      openDownHillPercent: resortInfo?.openDownHillPercent !== '' ? resortInfo?.openDownHillPercent : '0',
      openDownHillLifts: resortInfo?.openDownHillLifts || '0',
      maxDownHillLifts: resortInfo?.maxOpenDownHillLifts || 'N/A',
      reportDateTime: reportDate || 'N/A',
      comments: resortInfo?.snowComments || 'N/A',
      trailMapUrl: resortInfo?.lgTrailMapURL || '',
      snowLast48Hours: resortInfo?.snowLast48Hours !== '' ? resortInfo?.snowLast48Hours : 0,
      weekdayHours: resortInfo?.weekdayHours || 'N/A',
      weekendHours: resortInfo?.weekendHours || 'N/A',
    };
  };

  // helper to get status class
  const getStatusClass = (status) => {
    if (status === "1") return 'status-open bg-green';
    if (status === "3" || status === "4") return 'status-warning bg-yellow';
    return 'status-closed bg-red';
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
            const statusClass = getStatusClass(status);
            const isOpen = expandedResortId === resort.id;

            return (
              <li key={resort.id} className="resort">
                {/* resort status */}
                <span className="resort-left text-center">
                  <span className={`resort-status ${statusClass}`}>Resort Status = {status}</span>
                  <span className="send-status">Send status = {data?.minLast24Hours === data?.maxLast24Hours ? data?.minLast24Hours + '"' : `${data?.minLast24Hours}" - ${data?.maxLast24Hours}"`} in 24hrs</span>
                </span>
                {/* resort name */}
                <span className="resort-middle text-left">
                  <h5>{data?.name}</h5>
                  <h6 className="color-gray">{data?.location}</h6>
                  <button onClick={() => setExpandedResortId(isOpen ? null : resort.id)} className="btn-simple">
                    {isOpen ? 'Less -' : 'More +'}
                  </button>
                </span>
                {/* resort quick look info */}
                <span className="resort-right text-left">
                  <span className="quick-look"><b>Freshies (24hrs):</b> {data?.minLast24Hours === data?.maxLast24Hours ? data?.maxLast24Hours + '"' : `${data?.minLast24Hours}" - ${data?.maxLast24Hours}"`}</span>
                  <span className="quick-look"><b>Base Depth:</b> {data?.baseDepthMin === data?.baseDepthMax ? data?.baseDepthMin + '"' : `${data?.baseDepthMin}" - ${data?.baseDepthMax}"`}</span>
                  <span className="quick-look"><b>Primary Surface:</b> {data?.primarySurfaceCondition}</span>
                </span>
                {/* resort additional info */}
                {isOpen && data && (
                  <span className="the-goods text-left">
                    <span><b>Operating Status:</b> {data.operatingStatus === '' ? 'Open' : data.operatingStatus}</span>
                    <span><b>Open Percent:</b> {data.openDownHillPercent}%</span>
                    <span><b>Snow (48hrs):</b> {data.snowLast48Hours}"</span>
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