import { useState } from 'react'
import { searchResorts, getResortSnowReport } from './Api.jsx'
import SearchForm from './components/SearchForm/SearchForm'
import SearchResults from './components/SearchResults/SearchResults'
import './App.scss'

function App() {
  const [results, setResults] = useState([]);

  return (
    <>
      <h1>PowderDay</h1>
      <SearchForm searchResorts={searchResorts} setResults={setResults} />
      <SearchResults results={results} />
    </>
  )
}

export default App
