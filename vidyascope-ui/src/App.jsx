import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturePanel from './components/FeaturePanel'
import ExploreByGoal from './components/ExploreByGoal'
import TopColleges from './components/TopColleges'
import Footer from './components/Footer'
import CollegeListingPage from './pages/CollegeListingPage'

const App = () => {
  const [currentPage, setCurrentPage] = useState('colleges')

  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-brand-accent selection:text-brand-primary">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main>
        {currentPage === 'colleges' ? (
          <CollegeListingPage onNavigateHome={() => setCurrentPage('home')} />
        ) : (
          <>
            <Hero />
            <FeaturePanel />
            <ExploreByGoal />
            <TopColleges />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App