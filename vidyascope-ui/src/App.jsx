import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturePanel from './components/FeaturePanel'
import ExploreByGoal from './components/ExploreByGoal'
import TopColleges from './components/TopColleges'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-brand-accent selection:text-brand-primary">
      <Navbar />
      <main>
        <Hero />
        <FeaturePanel />
        <ExploreByGoal />
        <TopColleges />
        <Footer />
      </main>
    </div>
  )
}

export default App