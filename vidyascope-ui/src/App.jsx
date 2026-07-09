import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturePanel from './components/FeaturePanel'

const App = () => {
  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-brand-accent selection:text-brand-primary">
      <Navbar />
      <main>
        <Hero />
        <FeaturePanel />
      </main>
    </div>
  )
}

export default App