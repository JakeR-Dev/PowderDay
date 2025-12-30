import { useState } from 'react'
import './SearchForm.scss'

export default function SearchForm({ listResorts, setResults }) {
  const [query, setQuery] = useState("");

  const handleList = async () => {
    const data = await listResorts();
    setResults(data || []);
  };

  return (
    <div className="search-form">
      <input type="text" placeholder="Search resort" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleList}>Search</button>
      <button onClick={handleList}>Full List</button>
    </div>
  )
}