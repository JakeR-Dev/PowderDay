import { useState } from 'react'
import Title from './components/Title/Title'
import SearchForm from './components/SearchForm/SearchForm'
import SearchResults from './components/SearchResults/SearchResults'
import Footer from './components/Footer/Footer'
import './App.scss'

function App() {
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Title />
      <SearchForm setLoading={setLoading} setResults={setResults} />
      <SearchResults loading={loading} setLoading={setLoading} results={results} hasSearched={hasSearched} setHasSearched={setHasSearched} />
      <Footer />
    </>
  )
}

export default App
