import { useState } from 'react'
import Title from './components/Title/Title'
import SearchForm from './components/SearchForm/SearchForm'
import SearchResults from './components/SearchResults/SearchResults'
import Footer from './components/Footer/Footer'
import './App.scss'

function App() {
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <>
      <Title />
      <SearchForm setResults={setResults} setHasSearched={setHasSearched} />
      <SearchResults results={results} hasSearched={hasSearched} />
      <Footer />
    </>
  )
}

export default App
