import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ExploreByGoal from './components/ExploreByGoal'
import TopColleges from './components/TopColleges'
import WhyVidyaScope from './components/WhyVidyaScope'
import Testimonials from './components/Testimonials'
import BlogSection from './components/BlogSection'
import Footer from './components/Footer'
import CounselingModal from './components/CounselingModal'

import { motion, AnimatePresence } from 'framer-motion'

import CollegeCategoryPage from './pages/CollegeCategoryPage'
import CollegeListingPage from './pages/CollegeListingPage'
import CollegeDetailPage from './pages/CollegeDetailPage'
import CollegeComparePage from './pages/CollegeComparePage'
import CoursesPage from './pages/CoursesPage'
import ExamsPage from './pages/ExamsPage'
import ShortlistPage from './pages/ShortlistPage'
import CareerGuidePage from './pages/CareerGuidePage'
import CounselingPage from './pages/CounselingPage'

const App = () => {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedStream, setSelectedStream] = useState('all')
  const [selectedCollegeId, setSelectedCollegeId] = useState('iit-bombay')
  const [compareList, setCompareList] = useState([])
  const [shortlistedIds, setShortlistedIds] = useState(['iit-bombay', 'iim-ahmedabad', 'aiims-delhi'])
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
          alert('You can compare up to 4 colleges at a time.')
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
        alert('You can compare up to 4 colleges at a time.')
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
        shortlistedCount={shortlistedIds.length}
      />

      {/* Main Content Router View */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex-grow"
        >
          {/* 1. HOMEPAGE VIEW (Clean, Uncluttered, Purposeful) */}
          {currentPage === 'home' && (
            <>
              <Hero
                onNavigateListing={() => setCurrentPage('colleges-listing')}
                onOpenCounseling={() => setIsCounselingModalOpen(true)}
              />
              <ExploreByGoal
                onSelectCategory={handleSelectCategory}
                onNavigateListing={handleHeroSearch}
              />
              <TopColleges
                onSelectCollege={handleSelectCollege}
                onNavigateListing={() => setCurrentPage('colleges-listing')}
              />
              <WhyVidyaScope onOpenCounseling={() => setIsCounselingModalOpen(true)} />
              <Testimonials />
              <BlogSection onNavigate={handleNavigate} />
            </>
          )}

          {/* 2. DOMAINS & CATEGORIES PAGE */}
          {currentPage === 'colleges-categories' && (
            <CollegeCategoryPage
              onSelectCategory={handleSelectCategory}
              onNavigateHome={() => setCurrentPage('home')}
            />
          )}

          {/* 3. COLLEGE LISTING / DISCOVERY PAGE */}
          {currentPage === 'colleges-listing' && (
            <CollegeListingPage
              onNavigateHome={() => setCurrentPage('home')}
              selectedStream={selectedStream}
              onSelectStream={(stream) => setSelectedStream(stream)}
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

          {/* 4. COLLEGE DETAIL PAGE */}
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

          {/* 5. COURSES 3-STEP DISCOVERY PAGE */}
          {currentPage === 'courses' && (
            <CoursesPage
              onNavigateHome={() => setCurrentPage('home')}
              onSelectCollegeDetail={handleSelectCollege}
              onOpenCounseling={() => setIsCounselingModalOpen(true)}
            />
          )}

          {/* 6. ENTRANCE EXAMS EDUCATIONAL GUIDE PAGE */}
          {currentPage === 'exams' && (
            <ExamsPage
              onNavigateHome={() => setCurrentPage('home')}
              onNavigateColleges={() => setCurrentPage('colleges-listing')}
              onOpenCounseling={() => setIsCounselingModalOpen(true)}
            />
          )}

          {/* 7. COLLEGE COMPARISON MATRIX PAGE */}
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

          {/* 8. SHORTLIST / SAVED COLLEGES PAGE */}
          {currentPage === 'shortlist' && (
            <ShortlistPage
              shortlistedIds={shortlistedIds}
              onToggleShortlist={handleToggleShortlist}
              onClearShortlist={() => setShortlistedIds([])}
              onSelectCollege={handleSelectCollege}
              onNavigateHome={() => setCurrentPage('home')}
              onNavigateColleges={() => setCurrentPage('colleges-listing')}
              onOpenCounseling={() => setIsCounselingModalOpen(true)}
              compareList={compareList}
              onToggleCompare={handleToggleCompare}
              onNavigateCompare={() => setCurrentPage('compare')}
            />
          )}

          {/* 9. CAREER GUIDANCE ROADMAPS PAGE */}
          {currentPage === 'career-guide' && (
            <CareerGuidePage
              onNavigateHome={() => setCurrentPage('home')}
              onOpenCounseling={() => setIsCounselingModalOpen(true)}
              onNavigateColleges={(filter) => {
                if (filter && filter.stream) {
                  setSelectedStream(filter.stream)
                }
                setCurrentPage('colleges-listing')
              }}
              onNavigateCourses={() => setCurrentPage('courses')}
              onNavigateExams={() => setCurrentPage('exams')}
              onSelectCollege={handleSelectCollege}
            />
          )}

          {/* 10. COUNSELING / LEAD CAPTURE PAGE */}
          {currentPage === 'counseling' && (
            <CounselingPage onNavigateHome={() => setCurrentPage('home')} />
          )}

        </motion.main>
      </AnimatePresence>

      {/* Centralized Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenCounseling={() => setIsCounselingModalOpen(true)}
      />

      {/* Global Quick Counseling Lead Modal */}
      <CounselingModal
        isOpen={isCounselingModalOpen}
        onClose={() => setIsCounselingModalOpen(false)}
      />

    </div>
  )
}

export default App