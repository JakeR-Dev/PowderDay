import { useState } from 'react'
import './SearchForm.scss'

export default function SearchForm({ searchResorts, setResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    const data = await searchResorts(query);
    console.log(data);
    setResults(data.results || []);
  };

  return (
    <div className="search-form">
      <input type="text" placeholder="Search resort" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}