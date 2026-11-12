import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LiveAlertTicker from './components/LiveAlertTicker'
import Hero from './components/Hero'
import FeaturesTailored from './components/FeaturesTailored'
import ExploreStreams from './components/ExploreStreams'
import TopColleges from './components/TopColleges'
import TopExamsSection from './components/TopExamsSection'
import WhyVidyaScope from './components/WhyVidyaScope'
import Testimonials from './components/Testimonials'
import BlogSection from './components/BlogSection'
import Footer from './components/Footer'
import CounselingModal from './components/CounselingModal'
import CompareTray from './components/CompareTray'
import HeartSaveAnimation from './components/HeartSaveAnimation'
import TopProgressBar from './components/common/TopProgressBar'
import RouteLoadingOverlay from './components/common/RouteLoadingOverlay'
import { publicApi } from './api/publicApi'

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
import BlogListingPage from './pages/BlogListingPage'
import BlogDetailPage from './pages/BlogDetailPage'

const HomePage = ({
  onNavigateListing,
  onNavigateCompare,
  onSelectCollege,
  onOpenCounseling,
  handleHeroSearch,
  handleNavigate,
  handleSelectCategory,
}) => (
  <>
    <Hero
      onNavigateListing={onNavigateListing}
      onNavigateCompare={onNavigateCompare}
      onSelectCollege={onSelectCollege}
      onHeroSearch={handleHeroSearch}
    />
    <FeaturesTailored
      onNavigateListing={onNavigateListing}
      onNavigateCompare={onNavigateCompare}
      onOpenCounseling={onOpenCounseling}
    />
    <ExploreStreams
      onSelectStream={handleSelectCategory}
      onNavigateListing={onNavigateListing}
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
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false)
  const [counselingContext, setCounselingContext] = useState(null)
  const [heroSearchQuery, setHeroSearchQuery] = useState('')
  const [heartAnimTrigger, setHeartAnimTrigger] = useState(0)

  const handleOpenCounseling = (ctx) => {
    if (ctx && typeof ctx === 'object') {
      setCounselingContext(ctx)
    } else {
      setCounselingContext(null)
    }
    setIsCounselingModalOpen(true)
  }

  // Persistent Comparison State
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('vidyascope_compare')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('vidyascope_compare', JSON.stringify(compareList))
    } catch (e) {
      console.warn('Compare storage error', e)
    }
  }, [compareList])

  // Persistent Shortlist / Favorite State
  const [shortlistedIds, setShortlistedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('vidyascope_shortlist')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('vidyascope_shortlist', JSON.stringify(shortlistedIds))
    } catch (e) {
      console.warn('Shortlist storage error', e)
    }
  }, [shortlistedIds])

  // Page Route Transition Loading State
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setIsRouteLoading(true)
    window.scrollTo({ top: 0, behavior: 'instant' })

    const timer = setTimeout(() => {
      setIsRouteLoading(false)
    }, 360)

    return () => clearTimeout(timer)
  }, [location.pathname, location.search])

  // Automatic Website Traffic & Visitor Telemetry
  useEffect(() => {
    const p = location.pathname
    let pageType = 'other'
    let collegeId = null

    if (p === '/') pageType = 'home'
    else if (p.startsWith('/colleges/')) {
      pageType = 'college_detail'
      collegeId = p.replace('/colleges/', '').split('/')[0]
    } else if (p === '/colleges') pageType = 'college_listing'
    else if (p === '/courses') pageType = 'courses'
    else if (p === '/exams') pageType = 'exams'
    else if (p === '/compare') pageType = 'compare'
    else if (p === '/counseling') pageType = 'counseling'
    else if (p === '/blogs') pageType = 'blogs'
    else if (p.startsWith('/blogs/')) pageType = 'blog_detail'
    else if (p === '/career-guide') pageType = 'career_guide'
    else if (p === '/shortlist') pageType = 'shortlist'

    publicApi.trackView({
      path: p,
      pageTitle: document.title,
      pageType,
      collegeId,
    })
  }, [location.pathname])

  // Navigation Handlers
  const handleNavigate = (page, param) => {
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
        navigate(`/colleges/${param || selectedCollegeId || 'iit-bombay'}`)
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
        if (param) {
          navigate(`/career-guide?id=${encodeURIComponent(param)}`)
        } else {
          navigate('/career-guide')
        }
        break
      case 'blogs':
        navigate('/blogs')
        break
      case 'blog-detail':
        if (param) {
          navigate(`/blogs/${param}`)
        } else {
          navigate('/blogs')
        }
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
    const collegeId = college.id || college._id || college.slug
    setCompareList((prev) => {
      const exists = prev.some((item) => (item.id || item._id || item.slug) === collegeId)
      if (exists) {
        return prev.filter((item) => (item.id || item._id || item.slug) !== collegeId)
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 colleges at a time.')
          return prev
        }
        return [
          ...prev,
          {
            ...college,
            id: collegeId,
            name: college.name,
            shortName: college.shortName || college.name,
            image: college.image || college.logo,
          },
        ]
      }
    })
  }

  const handleAddCompare = (college) => {
    if (!college) return
    const collegeId = college.id || college._id || college.slug
    if (compareList.length >= 4) {
      alert('You can compare up to 4 colleges at a time.')
      return
    }
    if (!compareList.some((c) => (c.id || c._id || c.slug) === collegeId)) {
      setCompareList((prev) => [
        ...prev,
        {
          ...college,
          id: collegeId,
          name: college.name,
          shortName: college.shortName || college.name,
          image: college.image || college.logo,
        },
      ])
    }
  }

  // Shortlist Handlers
  const handleToggleShortlist = (collegeId) => {
    setShortlistedIds((prev) => {
      const isAlreadyShortlisted = prev.includes(collegeId)
      if (!isAlreadyShortlisted) {
        // Trigger center heart animation when saving
        setHeartAnimTrigger(Date.now())
        return [...prev, collegeId]
      } else {
        return prev.filter((id) => id !== collegeId)
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-text-primary selection:bg-brand-primary selection:text-white antialiased font-sans">
      
      {/* 0. Top Screen Glowing Progress Bar */}
      <TopProgressBar />

      {/* 0.1 Route Loading Frosted Indicator */}
      <RouteLoadingOverlay isLoading={isRouteLoading} />

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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
                  handleSelectCategory={handleSelectCategory}
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
                  onNavigateListing={(stream) => {
                    if (stream && typeof stream === 'string') {
                      setSelectedStream(stream)
                    }
                    navigate('/colleges')
                  }}
                  onOpenCounseling={handleOpenCounseling}
                  onSelectCollege={handleSelectCollege}
                  shortlistedIds={shortlistedIds}
                  onToggleShortlist={handleToggleShortlist}
                  compareList={compareList}
                  onToggleCompare={handleToggleCompare}
                />
              }
            />

            <Route
              path="/courses"
              element={
                <CoursesPage
                  onNavigateHome={() => navigate('/')}
                  onSelectCollegeDetail={handleSelectCollege}
                  onOpenCounseling={() => handleOpenCounseling()}
                />
              }
            />

            <Route
              path="/exams"
              element={
                <ExamsPage
                  onNavigateHome={() => navigate('/')}
                  onNavigateColleges={() => navigate('/colleges')}
                  onOpenCounseling={() => handleOpenCounseling()}
                />
              }
            />

            <Route
              path="/compare"
              element={
                <CollegeComparePage
                  selectedColleges={compareList}
                  onRemoveCollege={(id) =>
                    setCompareList((prev) => prev.filter((item) => (item.id || item._id || item.slug) !== id))
                  }
                  onAddCollege={handleAddCompare}
                  onClearAll={() => setCompareList([])}
                  onNavigateHome={() => navigate('/')}
                  onNavigateListing={() => navigate('/colleges')}
                  onOpenCounseling={() => handleOpenCounseling()}
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
                  onOpenCounseling={() => handleOpenCounseling()}
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
                  onOpenCounseling={() => handleOpenCounseling()}
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

            <Route
              path="/blogs"
              element={
                <BlogListingPage
                  onNavigateHome={() => navigate('/')}
                  onNavigateDetail={(slug) => navigate(`/blogs/${slug}`)}
                  onOpenCounseling={handleOpenCounseling}
                />
              }
            />

            <Route
              path="/blogs/:slug"
              element={
                <BlogDetailPage
                  onNavigateHome={() => navigate('/')}
                  onNavigateListing={() => navigate('/blogs')}
                  onOpenCounseling={handleOpenCounseling}
                  onSelectCollege={handleSelectCollege}
                />
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {/* Centralized Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenCounseling={handleOpenCounseling}
      />

      {/* Global Quick Counseling Lead Modal */}
      <CounselingModal
        isOpen={isCounselingModalOpen}
        context={counselingContext}
        onClose={() => {
          setIsCounselingModalOpen(false)
          setCounselingContext(null)
        }}
      />

      {/* Floating Bottom-Right Compare Drawer */}
      {location.pathname !== '/compare' && (
        <CompareTray
          selectedColleges={compareList}
          onRemoveCollege={(id) =>
            setCompareList((prev) => prev.filter((item) => (item.id || item._id || item.slug) !== id))
          }
          onClearAll={() => setCompareList([])}
          onCompareNow={() => navigate('/compare')}
        />
      )}

      {/* Floating Center Heart Pop & Flight Animation on College Save */}
      <HeartSaveAnimation
        triggerKey={heartAnimTrigger}
        onComplete={() => setHeartAnimTrigger(0)}
      />

    </div>
  )
}

export default App