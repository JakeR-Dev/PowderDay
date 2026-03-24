import { useState } from 'react'
import { Title } from './components/Title/Title'
import { SearchForm } from './components/SearchForm/SearchForm'
import { SearchResults } from './components/SearchResults/SearchResults'
import { Footer } from './components/Footer/Footer'
import { CookieNotice } from './components/CookieNotice/CookieNotice'
import { TermsModal } from './components/TermsModal/TermsModal'
import './App.scss'

function App() {
  const [results, setResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showCookieNotice, setShowCookieNotice] = useState(() => {
    return localStorage.getItem('seenCookieBanner') ? false : true;
  })
  const [showTermsModal, setShowTermsModal] = useState(false)

  return (
    <>
      <Title />
      <SearchForm setLoading={setLoading} setResults={setResults} />
      <SearchResults loading={loading} setLoading={setLoading} results={results} hasSearched={hasSearched} setHasSearched={setHasSearched} />
      <Footer />
      {showCookieNotice && (
        <CookieNotice setShowCookieNotice={setShowCookieNotice} setShowTermsModal={setShowTermsModal} />
      )}
      {showTermsModal && (
        <TermsModal setShowTermsModal={setShowTermsModal}></TermsModal>
      )}
    </>
  )
}
export default App
