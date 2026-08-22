import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturePanel from './components/FeaturePanel'
import ExploreByGoal from './components/ExploreByGoal'
import TopColleges from './components/TopColleges'
import TrendingExams from './components/TrendingExams'
import WhyVidyaScope from './components/WhyVidyaScope'
import Testimonials from './components/Testimonials'
import BlogSection from './components/BlogSection'
import Footer from './components/Footer'
import CounselingModal from './components/CounselingModal'

import CollegeCategoryPage from './pages/CollegeCategoryPage'
import CollegeListingPage from './pages/CollegeListingPage'
import CollegeDetailPage from './pages/CollegeDetailPage'
import CollegeComparePage from './pages/CollegeComparePage'
import CourseGuidePage from './pages/CourseGuidePage'
import CounselingPage from './pages/CounselingPage'

const App = () => {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedStream, setSelectedStream] = useState('engineering')
  const [selectedCollegeId, setSelectedCollegeId] = useState('iit-bombay')
  const [compareList, setCompareList] = useState([])
  const [shortlistedIds, setShortlistedIds] = useState(['iit-bombay', 'iim-ahmedabad'])
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false)
  const [heroSearchQuery, setHeroSearchQuery] = useState('')

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage, selectedCollegeId])

  // Navigation Handlers
  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleSelectCategory = (streamId) => {
    setSelectedStream(streamId)
    setHeroSearchQuery('')
    setCurrentPage('colleges-listing')
  }

  const handleSelectCollege = (collegeId) => {
    setSelectedCollegeId(collegeId)
    setCurrentPage('college-detail')
  }

  const handleHeroSearch = (searchData) => {
    if (searchData && searchData.query) {
      setHeroSearchQuery(searchData.query)
    }
    if (searchData && searchData.stream) {
      setSelectedStream(searchData.stream)
    }
    setCurrentPage('colleges-listing')
  }

  // Compare List Handlers
  const handleToggleCompare = (college) => {
    if (!college) return
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === college.id)
      if (exists) {
        return prev.filter((item) => item.id !== college.id)
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 colleges at a time.')
          return prev
        }
        return [...prev, college]
      }
    })
  }

  const handleAddCompare = (college) => {
    if (!college) return
    setCompareList((prev) => {
      if (prev.some((item) => item.id === college.id)) return prev
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 colleges at a time.')
        return prev
      }
      return [...prev, college]
    })
  }

  // Shortlist Handlers
  const handleToggleShortlist = (collegeId) => {
    setShortlistedIds((prev) => {
      if (prev.includes(collegeId)) {
        return prev.filter((id) => id !== collegeId)
      } else {
        return [...prev, collegeId]
      }
    })
  }

  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-brand-accent selection:text-brand-primary flex flex-col justify-between">
      
      {/* Centralized Top Navbar */}
      <Navbar
        onNavigate={handleNavigate}
        currentPage={currentPage}
        onOpenCounseling={() => setIsCounselingModalOpen(true)}
      />

      {/* Main Content Router View */}
      <main className="flex-grow">
        
        {/* HOMEPAGE VIEW */}
        {currentPage === 'home' && (
          <>
            <Hero
              onNavigateListing={handleHeroSearch}
              onOpenCounseling={() => setIsCounselingModalOpen(true)}
            />
            <FeaturePanel />
            <ExploreByGoal onSelectCategory={handleSelectCategory} />
            <TopColleges
              onSelectCollege={handleSelectCollege}
              onNavigateListing={() => setCurrentPage('colleges-listing')}
            />
            <TrendingExams onNavigate={handleNavigate} />
            <WhyVidyaScope onOpenCounseling={() => setIsCounselingModalOpen(true)} />
            <Testimonials />
            <BlogSection onNavigate={handleNavigate} />
          </>
        )}

        {/* DOMAINS & CATEGORIES PAGE */}
        {currentPage === 'colleges-categories' && (
          <CollegeCategoryPage
            onSelectCategory={handleSelectCategory}
            onNavigateHome={() => setCurrentPage('home')}
          />
        )}

        {/* COLLEGE LISTING PAGE */}
        {currentPage === 'colleges-listing' && (
          <CollegeListingPage
            onNavigateHome={() => setCurrentPage('home')}
            selectedStream={selectedStream}
            onNavigateBack={() => setCurrentPage('colleges-categories')}
            onSelectCollege={handleSelectCollege}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onClearCompare={() => setCompareList([])}
            onNavigateCompare={() => setCurrentPage('compare')}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={handleToggleShortlist}
            initialSearchQuery={heroSearchQuery}
          />
        )}

        {/* COLLEGE DETAIL PAGE */}
        {currentPage === 'college-detail' && (
          <CollegeDetailPage
            collegeId={selectedCollegeId}
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateListing={() => setCurrentPage('colleges-listing')}
            onOpenCounseling={() => setIsCounselingModalOpen(true)}
            onSelectCollege={handleSelectCollege}
            isShortlisted={shortlistedIds.includes(selectedCollegeId)}
            onToggleShortlist={handleToggleShortlist}
            onToggleCompare={handleToggleCompare}
            isCompared={compareList.some((c) => c.id === selectedCollegeId)}
          />
        )}

        {/* COLLEGE COMPARISON PAGE */}
        {currentPage === 'compare' && (
          <CollegeComparePage
            selectedColleges={compareList}
            onRemoveCollege={(id) => setCompareList((prev) => prev.filter((item) => item.id !== id))}
            onAddCollege={handleAddCompare}
            onClearAll={() => setCompareList([])}
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateListing={() => setCurrentPage('colleges-listing')}
            onOpenCounseling={() => setIsCounselingModalOpen(true)}
            onSelectCollege={handleSelectCollege}
          />
        )}

        {/* COURSE / STREAM GUIDE PAGE */}
        {currentPage === 'course-guide' && (
          <CourseGuidePage
            onNavigateHome={() => setCurrentPage('home')}
            onSelectCollege={handleSelectCollege}
            onOpenCounseling={() => setIsCounselingModalOpen(true)}
          />
        )}

        {/* COUNSELING / LEAD CAPTURE PAGE */}
        {currentPage === 'counseling' && (
          <CounselingPage onNavigateHome={() => setCurrentPage('home')} />
        )}

      </main>

      {/* Centralized Footer */}
      <Footer />

      {/* Global Quick Counseling Lead Modal */}
      <CounselingModal
        isOpen={isCounselingModalOpen}
        onClose={() => setIsCounselingModalOpen(false)}
      />

    </div>
  )
}

export default App