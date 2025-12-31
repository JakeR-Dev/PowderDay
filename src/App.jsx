import { useState } from 'react'
import { listResorts, getResortSnowReport } from './Api.jsx'
import SearchForm from './components/SearchForm/SearchForm'
import SearchResults from './components/SearchResults/SearchResults'
import './App.scss'

function App() {
  const [results, setResults] = useState([]);

  return (
    <>
      <h1>PowderDay</h1>
      <h2 className="subtitle">Check The Snow Before You Go</h2>
      <SearchForm listResorts={listResorts} setResults={setResults} />
      <SearchResults results={results} getResortSnowReport={getResortSnowReport} />
    </>
  )
}

export default App
