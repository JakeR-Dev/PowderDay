import { useState, useEffect } from 'react'
import Resort from '../Resort/Resort'
import { listAllResorts } from '../../Api'
import { getResortsInfo, getResortForecast } from '../../utils/getResortInfo'
import getSendScore from '../../utils/getSendScore'
import forEachLimit from '../../utils/forEachLimit'
import './TopResorts.scss'

const MAX_TOP_RESORTS = 9;

// helper to shuffle resorts so a random set of pow resorts is shown each visit
const shuffle = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const TopResorts = ({ favorites, onToggleFavorite }) => {
  const [powResorts, setPowResorts] = useState([]);
  const [searching, setSearching] = useState(true);

  // search all resorts for ones with a send score of 'pow'
  useEffect(() => {
    let isCancelled = false;

    const findPowResorts = async () => {
      const list = await listAllResorts();
      // sort ids so batched snow report urls match across visitors and hit the vercel cache
      const ids = (list?.items || []).map((resort) => String(resort.id)).sort();
      const allInfo = await getResortsInfo(ids);

      // only open resorts can score 'pow', so skip weather calls for the rest
      const openResorts = shuffle(allInfo.filter((resort) => resort.resortStatus === '1'));
      let found = 0;

      // check forecasts in random order, stop once there are enough pow resorts
      await forEachLimit(openResorts, 6, async (resort) => {
        if (isCancelled || found >= MAX_TOP_RESORTS) return false;

        const forecast = await getResortForecast(resort.name, resort.location, resort.country);
        const fullResort = { ...resort, ...forecast };
        if (isCancelled || found >= MAX_TOP_RESORTS || getSendScore(fullResort) !== 'pow') return;

        found++;
        setPowResorts((prev) => [...prev, fullResort]);
      });

      if (!isCancelled) setSearching(false);
    };

    findPowResorts();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="top-resorts">
      <h4>Top Resorts</h4>

      {/* show pow resorts as they're found */}
      {powResorts.length > 0 && (
        <ul>
          {powResorts.map((resort) => {
            const favoriteClass = favorites.includes(resort.id) ? 'is-favorite' : '';

            return (
              <Resort key={resort.id} resortID={resort.id} data={resort} favoriteClass={favoriteClass} onToggleFavorite={onToggleFavorite} />
            );
          })}
        </ul>
      )}

      {searching ? (
        <p className="color-gray">Searching for pow...</p>
      ) : powResorts.length === 0 && (
        <p className="color-gray">No pow today, check back after the next storm.</p>
      )}
    </div>
  )
}
