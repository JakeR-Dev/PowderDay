import { useState, useEffect } from 'react'
import getSendScore from '../../utils/getSendScore'
import getResortInfo from '../../utils/getResortInfo'
import getStatusClass from '../../utils/getStatusClass'
import './SearchResults.scss'

export default function SearchResults({ loading, setLoading, results, hasSearched, setHasSearched }) {
  const [expandedResortId, setExpandedResortId] = useState(null);
  const [resortData, setResortData] = useState({});
  const [favoriteResortsData, setFavoriteResortsData] = useState({});
  const [favorites, setFavorites] = useState([]);

  // load favorites from localStorage on load
  useEffect(() => {
    const storedFavorites = localStorage.getItem('powDayFavorites');
    if (storedFavorites) {
      const favoritesArray = storedFavorites.split(',');
      setFavorites(favoritesArray);

      const fetchFavoritesData = async () => {
        const favoritesPromises = favoritesArray.map(async (favorite) => {
          const info = await getResortInfo(favorite);
          return { id: favorite, ...info };
        });

        const allFavorites = await Promise.all(favoritesPromises);
        const favoritesMap = {};
        allFavorites.forEach((favorite) => {
          favoritesMap[favorite.id] = favorite;
        });
        setLoading(false);
        setFavoriteResortsData(favoritesMap);
      };

      fetchFavoritesData();
    }
  }, []);

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

  // add the resort to the favorite localstorage
  const handleFavoriteClick = (resortId) => {
    const storedFavorites = localStorage.getItem('powDayFavorites');
    let favoritesArr = storedFavorites ? storedFavorites.split(',') : [];

    // Remove from favorites
    if (favoritesArr.includes(resortId)) {
      favoritesArr = favoritesArr.filter(id => id !== resortId);
      // Add to favorites
    } else {
      favoritesArr.push(resortId);
    }

    localStorage.setItem('powDayFavorites', favoritesArr.join(','));
    setFavorites(favoritesArr);
  }

  // check if the resort is part of the favorites localstorage
  const checkFavorite = (resortID) => {
    return favorites.includes(resortID);
  }

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

        // if haven't searched yet, show favorites
      ) : (results.length === 0 && favorites.length) ? (
        <ul>
          {favorites.map((resort) => {
            const data = favoriteResortsData[resort];
            const resortName = data?.name;
            const status = data?.resortStatus || "7";
            const statusClass = getStatusClass(status);
            const isOpen = expandedResortId === resort;
            const freshies = data?.minLast24Hours + data?.maxLast24Hours / 2;
            const stash = data?.snowLast48Hours;
            const surface = data?.primarySurfaceCondition || 'N/A';
            const sendScore = getSendScore(status, freshies, stash, surface);

            return (
              <li key={resort} className="resort">
                {/* resort status */}
                <span className="resort-left text-center">
                  <span className={`resort-status ${statusClass}`}>Resort Status = {status}</span>
                  <span className="send-score">{sendScore}</span>
                  <a className="favorite is-favorite" aria-label="click to favorite this resort" onClick={() => handleFavoriteClick(resort)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5L14.9 8.3L21.3 9.2L16.6 13.7L17.7 20.1L12 17.1L6.3 20.1L7.4 13.7L2.7 9.2L9.1 8.3Z" fill="transparent" stroke="#A0A0A0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
                  </a>
                </span>
                {/* resort name */}
                <span className="resort-middle text-left">
                  <h5>{resortName}</h5>
                  <h6 className="color-gray">{data?.location}</h6>
                  <button onClick={() => setExpandedResortId(isOpen ? null : resort)} className="btn-simple">
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
        // if haven't searched yet, but there are no favorites
      ) : (results.length === 0) ? (
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
            const favoriteClass = checkFavorite(resort.id) ? 'is-favorite' : '';

            return (
              <li key={resort.id} className="resort">
                {/* resort status */}
                <span className="resort-left text-center">
                  <span className={`resort-status ${statusClass}`}>Resort Status = {status}</span>
                  <span className="send-score">{sendScore}</span>
                  <a className={`favorite ${favoriteClass}`} aria-label="click to favorite this resort" onClick={() => handleFavoriteClick(resort.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5L14.9 8.3L21.3 9.2L16.6 13.7L17.7 20.1L12 17.1L6.3 20.1L7.4 13.7L2.7 9.2L9.1 8.3Z" fill="transparent" stroke="#A0A0A0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
                  </a>
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