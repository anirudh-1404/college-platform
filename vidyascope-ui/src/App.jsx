import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LiveAlertTicker from './components/LiveAlertTicker'
import Hero from './components/Hero'
import FeaturesTailored from './components/FeaturesTailored'
import ExploreCities from './components/ExploreCities'
import TopColleges from './components/TopColleges'
import TopExamsSection from './components/TopExamsSection'
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

const HomePage = ({
  onNavigateListing,
  onNavigateCompare,
  onSelectCollege,
  onOpenCounseling,
  handleHeroSearch,
  handleNavigate,
}) => (
  <>
    <Hero
      onNavigateListing={onNavigateListing}
      onNavigateCompare={onNavigateCompare}
      onSelectCollege={onSelectCollege}
    />
    <FeaturesTailored
      onNavigateListing={onNavigateListing}
      onNavigateCompare={onNavigateCompare}
      onOpenCounseling={onOpenCounseling}
    />
    <ExploreCities
      onSelectCity={(cityName) => handleHeroSearch({ query: cityName })}
    />
    <TopColleges
      onSelectCollege={onSelectCollege}
      onNavigateListing={onNavigateListing}
    />
    <TopExamsSection
      onNavigateExams={() => handleNavigate('exams')}
    />
    <WhyVidyaScope onOpenCounseling={onOpenCounseling} />
    <Testimonials />
    <BlogSection onNavigate={handleNavigate} />
  </>
)

const App = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedStream, setSelectedStream] = useState('all')
  const [selectedCollegeId, setSelectedCollegeId] = useState(null)
  const [compareList, setCompareList] = useState([])
  const [shortlistedIds, setShortlistedIds] = useState([])
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false)
  const [heroSearchQuery, setHeroSearchQuery] = useState('')

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  // Navigation Handlers
  const handleNavigate = (page) => {
    switch (page) {
      case 'home':
        navigate('/')
        break
      case 'colleges-listing':
        navigate('/colleges')
        break
      case 'colleges-categories':
        navigate('/categories')
        break
      case 'college-detail':
        navigate(`/colleges/${selectedCollegeId || 'iit-bombay'}`)
        break
      case 'courses':
        navigate('/courses')
        break
      case 'exams':
        navigate('/exams')
        break
      case 'compare':
        navigate('/compare')
        break
      case 'shortlist':
        navigate('/shortlist')
        break
      case 'career-guide':
        navigate('/career-guide')
        break
      case 'counseling':
        navigate('/counseling')
        break
      default:
        navigate('/')
    }
  }

  const handleSelectCategory = (streamId) => {
    setSelectedStream(streamId)
    setHeroSearchQuery('')
    navigate('/colleges')
  }

  const handleSelectCollege = (collegeId) => {
    setSelectedCollegeId(collegeId)
    navigate(`/colleges/${collegeId}`)
  }

  const handleHeroSearch = (searchData) => {
    if (searchData && searchData.query) {
      setHeroSearchQuery(searchData.query)
    }
    if (searchData && searchData.stream) {
      setSelectedStream(searchData.stream)
    }
    navigate('/colleges')
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
    if (compareList.length >= 4) {
      alert('You can compare up to 4 colleges at a time.')
      return
    }
    if (!compareList.some((c) => c.id === college.id)) {
      setCompareList((prev) => [...prev, college])
    }
  }

  // Shortlist Handlers
  const handleToggleShortlist = (collegeId) => {
    setShortlistedIds((prev) =>
      prev.includes(collegeId) ? prev.filter((id) => id !== collegeId) : [...prev, collegeId]
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-text-primary selection:bg-brand-primary selection:text-white antialiased font-sans">
      
      {/* 1. Top Real-time Regulatory & Cutoff Ticker */}
      <LiveAlertTicker />

      {/* 2. Primary Navigation Bar */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenCounseling={() => setIsCounselingModalOpen(true)}
        shortlistedCount={shortlistedIds.length}
      />

      {/* 3. Page Content with Route Transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex-grow"
        >
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onNavigateListing={() => navigate('/colleges')}
                  onNavigateCompare={() => navigate('/compare')}
                  onSelectCollege={handleSelectCollege}
                  onOpenCounseling={() => setIsCounselingModalOpen(true)}
                  handleHeroSearch={handleHeroSearch}
                  handleNavigate={handleNavigate}
                />
              }
            />

            <Route
              path="/categories"
              element={
                <CollegeCategoryPage
                  onSelectCategory={handleSelectCategory}
                  onNavigateHome={() => navigate('/')}
                />
              }
            />

            <Route
              path="/colleges"
              element={
                <CollegeListingPage
                  onNavigateHome={() => navigate('/')}
                  selectedStream={selectedStream}
                  onSelectStream={(stream) => setSelectedStream(stream)}
                  onNavigateBack={() => navigate('/categories')}
                  onSelectCollege={handleSelectCollege}
                  compareList={compareList}
                  onToggleCompare={handleToggleCompare}
                  onClearCompare={() => setCompareList([])}
                  onNavigateCompare={() => navigate('/compare')}
                  shortlistedIds={shortlistedIds}
                  onToggleShortlist={handleToggleShortlist}
                  initialSearchQuery={heroSearchQuery}
                />
              }
            />

            <Route
              path="/colleges/:id"
              element={
                <CollegeDetailPage
                  collegeId={selectedCollegeId}
                  onNavigateHome={() => navigate('/')}
                  onNavigateListing={() => navigate('/colleges')}
                  onOpenCounseling={() => setIsCounselingModalOpen(true)}
                  onSelectCollege={handleSelectCollege}
                  isShortlisted={shortlistedIds.includes(selectedCollegeId)}
                  onToggleShortlist={handleToggleShortlist}
                  onToggleCompare={handleToggleCompare}
                  isCompared={compareList.some((c) => c.id === selectedCollegeId)}
                />
              }
            />

            <Route
              path="/courses"
              element={
                <CoursesPage
                  onNavigateHome={() => navigate('/')}
                  onSelectCollegeDetail={handleSelectCollege}
                  onOpenCounseling={() => setIsCounselingModalOpen(true)}
                />
              }
            />

            <Route
              path="/exams"
              element={
                <ExamsPage
                  onNavigateHome={() => navigate('/')}
                  onNavigateColleges={() => navigate('/colleges')}
                  onOpenCounseling={() => setIsCounselingModalOpen(true)}
                />
              }
            />

            <Route
              path="/compare"
              element={
                <CollegeComparePage
                  selectedColleges={compareList}
                  onRemoveCollege={(id) => setCompareList((prev) => prev.filter((item) => item.id !== id))}
                  onAddCollege={handleAddCompare}
                  onClearAll={() => setCompareList([])}
                  onNavigateHome={() => navigate('/')}
                  onNavigateListing={() => navigate('/colleges')}
                  onOpenCounseling={() => setIsCounselingModalOpen(true)}
                  onSelectCollege={handleSelectCollege}
                />
              }
            />

            <Route
              path="/shortlist"
              element={
                <ShortlistPage
                  shortlistedIds={shortlistedIds}
                  onToggleShortlist={handleToggleShortlist}
                  onClearShortlist={() => setShortlistedIds([])}
                  onSelectCollege={handleSelectCollege}
                  onNavigateHome={() => navigate('/')}
                  onNavigateColleges={() => navigate('/colleges')}
                  onOpenCounseling={() => setIsCounselingModalOpen(true)}
                  compareList={compareList}
                  onToggleCompare={handleToggleCompare}
                  onNavigateCompare={() => navigate('/compare')}
                />
              }
            />

            <Route
              path="/career-guide"
              element={
                <CareerGuidePage
                  onNavigateHome={() => navigate('/')}
                  onOpenCounseling={() => setIsCounselingModalOpen(true)}
                  onNavigateColleges={(filter) => {
                    if (filter && filter.stream) {
                      setSelectedStream(filter.stream)
                    }
                    navigate('/colleges')
                  }}
                  onNavigateCourses={() => navigate('/courses')}
                  onNavigateExams={() => navigate('/exams')}
                  onSelectCollege={handleSelectCollege}
                />
              }
            />

            <Route
              path="/counseling"
              element={<CounselingPage onNavigateHome={() => navigate('/')} />}
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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