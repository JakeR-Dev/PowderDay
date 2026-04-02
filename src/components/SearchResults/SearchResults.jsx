import { useState, useEffect } from 'react'
import Resort from '../Resort/Resort'
import getResortInfo, { getResortForecast } from '../../utils/getResortInfo'
import { useFavorites } from '../../hooks/useFavorites'
import './SearchResults.scss'

export const SearchResults = ({ loading, setLoading, results, hasSearched, setHasSearched }) => {
  const [resortData, setResortData] = useState({});
  const [favoriteResortsData, setFavoriteResortsData] = useState({});
  const { favorites, toggleFavorite } = useFavorites();

  // load favorite resort data when favorites change
  useEffect(() => {
    let isCancelled = false;

    if (favorites.length > 0) {
      const fetchFavoritesData = async () => {
        const favoritesPromises = favorites.map(async (favorite) => {
          const info = await getResortInfo(favorite);
          return { id: favorite, ...info };
        });

        const allFavorites = await Promise.all(favoritesPromises);
        const favoritesMap = {};
        allFavorites.forEach((favorite) => {
          favoritesMap[favorite.id] = favorite;
        });

        if (isCancelled) return;

        setLoading(false);
        setFavoriteResortsData(favoritesMap);

        // Hydrate weather fields in the background after base cards render.
        await Promise.all(favorites.map(async (favoriteId) => {
          const baseData = favoritesMap[favoriteId];
          if (!baseData) return;

          const forecast = await getResortForecast(baseData.name, baseData.location, baseData.country);
          if (isCancelled) return;

          setFavoriteResortsData((prev) => {
            const currentFavorite = prev[favoriteId] || {};

            return {
              ...prev,
              [favoriteId]: {
                ...currentFavorite,
                ...forecast,
              },
            };
          });
        }));
      };

      fetchFavoritesData();
    } else {
      setLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [favorites, setLoading]);

  // fetch all resort data when results change
  useEffect(() => {
    let isCancelled = false;

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

      if (isCancelled) return;

      setHasSearched(true);
      setLoading(false);
      setResortData(dataMap);

      // Fetch weather after showing base resort results.
      await Promise.all(results.items.map(async (resort) => {
        const baseData = dataMap[resort.id];
        if (!baseData) return;

        const forecast = await getResortForecast(baseData.name, baseData.location, baseData.country);
        if (isCancelled) return;

        setResortData((prev) => {
          const currentResort = prev[resort.id] || {};

          return {
            ...prev,
            [resort.id]: {
              ...currentResort,
              ...forecast,
            },
          };
        });
      }));
    };

    fetchAllResortData();

    return () => {
      isCancelled = true;
    };
  }, [results, setHasSearched, setLoading]);

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
              <Resort key={resort} resortID={resort} data={data} favoriteClass={favoriteClass} onToggleFavorite={toggleFavorite} />
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
              <Resort key={resort.id} resortID={resort.id} data={data} favoriteClass={favoriteClass} onToggleFavorite={toggleFavorite} />
            );
          })}
        </ul>
      )}
    </div>
  )
}