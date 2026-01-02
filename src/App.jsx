import { useState } from 'react'
import { listResorts, getResortSnowReport } from './Api.jsx'
import Title from './components/Title/Title.jsx'
import SearchForm from './components/SearchForm/SearchForm'
import SearchResults from './components/SearchResults/SearchResults'
import Footer from './components/Footer/Footer.jsx'
import './App.scss'

function App() {
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <>
      <Title />
      <SearchForm listResorts={listResorts} setResults={setResults} setHasSearched={setHasSearched} />
      <SearchResults results={results} getResortSnowReport={getResortSnowReport} hasSearched={hasSearched} />
      <Footer />
    </>
  )
}

export default App
