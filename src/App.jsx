import { useState } from 'react'
import { listResorts } from './Api.jsx'
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
      <SearchResults results={results} hasSearched={hasSearched} />
      <Footer />
    </>
  )
}

export default App
