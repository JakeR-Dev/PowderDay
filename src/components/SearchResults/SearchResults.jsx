import { useState, useEffect } from 'react'
import Resort from '../Resort/Resort'
import getResortInfo from '../../utils/getResortInfo'
import './SearchResults.scss'

export default function SearchResults({ loading, setLoading, results, hasSearched, setHasSearched }) {
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
    } else {
      setLoading(false);
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
            const favoriteClass = "is-favorite";

            return (
              <Resort key={resort} resortID={resort} data={data} favoriteClass={favoriteClass} handleFavoriteClick={handleFavoriteClick} />
            );
          })}
        </ul>

      // if haven't searched yet, but there are no favorites
      ) : (results.length === 0) ? (
        <p></p>

      // otherwise, show results
      ) : (
        <ul>
          {results.items.map((resort) => {
            // use the resort ID to reference the array item for the resort
            const data = resortData[resort.id];
            const favoriteClass = checkFavorite(resort.id) ? 'is-favorite' : '';

            return (
              <Resort key={resort.id} resortID={resort.id} data={data} favoriteClass={favoriteClass} handleFavoriteClick={handleFavoriteClick} />
            );
          })}
        </ul>
      )}
    </div>
  )
}