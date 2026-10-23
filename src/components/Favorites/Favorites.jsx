import Resort from '../Resort/Resort'

export const Favorites = ({favorites, favoriteResortsData, toggleFavorite}) => {
    return (
        <>
            {favorites.length > 0 && (
                <ul>
                    {favorites.map((resort) => {
                        const data = favoriteResortsData[resort];
                        const favoriteClass = "is-favorite";

                        return (
                            <Resort key={resort} resortID={resort} data={data} favoriteClass={favoriteClass} onToggleFavorite={toggleFavorite} />
                        );
                    })}
                </ul>
            )}
        </>
    );
}