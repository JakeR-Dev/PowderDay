import './SearchResults.scss'

export default function SearchResults({ results }) {
  return (
    <div className="search-results">
      {results.length === 0 ? (
        <p>No results yet. Try searching for a resort!</p>
      ) : (
        <ul>
          {results.map((resort, index) => (
            <li key={index}>{resort.name || JSON.stringify(resort)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}