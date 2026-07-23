import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturePanel from './components/FeaturePanel'
import ExploreByGoal from './components/ExploreByGoal'
import TopColleges from './components/TopColleges'
import Footer from './components/Footer'
import CollegeListingPage from './pages/CollegeListingPage'
import CollegeCategoryPage from './pages/CollegeCategoryPage'

const App = () => {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedStream, setSelectedStream] = useState('engineering')

  const handleSelectCategory = (streamId) => {
    setSelectedStream(streamId)
    setCurrentPage('colleges-listing')
  }

  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-brand-accent selection:text-brand-primary">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main>
        {currentPage === 'colleges-categories' && (
          <CollegeCategoryPage
            onSelectCategory={handleSelectCategory}
            onNavigateHome={() => setCurrentPage('home')}
          />
        )}
        {currentPage === 'colleges-listing' && (
          <CollegeListingPage
            onNavigateHome={() => setCurrentPage('home')}
            selectedStream={selectedStream}
            onNavigateBack={() => setCurrentPage('colleges-categories')}
          />
        )}
        {currentPage === 'home' && (
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