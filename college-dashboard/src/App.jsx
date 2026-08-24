import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import { initialCollegeData } from './data/initialCollegeData'

// Page Components
import DashboardHome from './pages/DashboardHome'
import CollegeProfilePage from './pages/CollegeProfilePage'
import AboutCollegePage from './pages/AboutCollegePage'
import CoursesProgramsPage from './pages/CoursesProgramsPage'
import AdmissionsPage from './pages/AdmissionsPage'
import FeesPage from './pages/FeesPage'
import FacilitiesPage from './pages/FacilitiesPage'
import PlacementsPage from './pages/PlacementsPage'
import RankingsPage from './pages/RankingsPage'
import ScholarshipsPage from './pages/ScholarshipsPage'
import HostelPage from './pages/HostelPage'
import GalleryPage from './pages/GalleryPage'
import FAQsPage from './pages/FAQsPage'
import ContactPage from './pages/ContactPage'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [collegeData, setCollegeData] = useState(initialCollegeData)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)

  // State Slice Update Handlers
  const handleUpdateProfile = (profile) => {
    setCollegeData((prev) => ({
      ...prev,
      profile,
      lastUpdated: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }))
  }

  const handleUpdateAbout = (about) => {
    setCollegeData((prev) => ({ ...prev, about }))
  }

  const handleUpdateCourses = (courses) => {
    setCollegeData((prev) => ({ ...prev, courses }))
  }

  const handleUpdateAdmissions = (admissions) => {
    setCollegeData((prev) => ({ ...prev, admissions }))
  }

  const handleUpdateFees = (fees) => {
    setCollegeData((prev) => ({ ...prev, fees }))
  }

  const handleUpdateFacilities = (facilities) => {
    setCollegeData((prev) => ({ ...prev, facilities }))
  }

  const handleUpdatePlacements = (placements) => {
    setCollegeData((prev) => ({ ...prev, placements }))
  }

  const handleUpdateRankings = (rankings) => {
    setCollegeData((prev) => ({ ...prev, rankings }))
  }

  const handleUpdateScholarships = (scholarships) => {
    setCollegeData((prev) => ({ ...prev, scholarships }))
  }

  const handleUpdateHostels = (hostels) => {
    setCollegeData((prev) => ({ ...prev, hostels }))
  }

  const handleUpdateGallery = (gallery) => {
    setCollegeData((prev) => ({ ...prev, gallery }))
  }

  const handleUpdateFaqs = (faqs) => {
    setCollegeData((prev) => ({ ...prev, faqs }))
  }

  const handleUpdateContact = (contact) => {
    setCollegeData((prev) => ({ ...prev, contact }))
  }

  const handleOpenPublicPreview = () => {
    setPreviewModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-text-primary flex">
      
      {/* 1. Dedicated Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collegeName={collegeData.profile.shortName}
        onPreviewPublic={handleOpenPublicPreview}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Top Header Bar */}
        <TopBar
          status={collegeData.status}
          collegeName={collegeData.profile.name}
          lastUpdated={collegeData.lastUpdated}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onPreviewPublic={handleOpenPublicPreview}
        />

        {/* Dynamic Page Routing with Smooth Transitions */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'dashboard' && (
                <DashboardHome
                  collegeData={collegeData}
                  onNavigateTab={setActiveTab}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'profile' && (
                <CollegeProfilePage
                  collegeData={collegeData}
                  onUpdateProfile={handleUpdateProfile}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'about' && (
                <AboutCollegePage
                  collegeData={collegeData}
                  onUpdateAbout={handleUpdateAbout}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'courses' && (
                <CoursesProgramsPage
                  collegeData={collegeData}
                  onUpdateCourses={handleUpdateCourses}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'admissions' && (
                <AdmissionsPage
                  collegeData={collegeData}
                  onUpdateAdmissions={handleUpdateAdmissions}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'fees' && (
                <FeesPage
                  collegeData={collegeData}
                  onUpdateFees={handleUpdateFees}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'facilities' && (
                <FacilitiesPage
                  collegeData={collegeData}
                  onUpdateFacilities={handleUpdateFacilities}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'placements' && (
                <PlacementsPage
                  collegeData={collegeData}
                  onUpdatePlacements={handleUpdatePlacements}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'rankings' && (
                <RankingsPage
                  collegeData={collegeData}
                  onUpdateRankings={handleUpdateRankings}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'scholarships' && (
                <ScholarshipsPage
                  collegeData={collegeData}
                  onUpdateScholarships={handleUpdateScholarships}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'hostels' && (
                <HostelPage
                  collegeData={collegeData}
                  onUpdateHostels={handleUpdateHostels}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'gallery' && (
                <GalleryPage
                  collegeData={collegeData}
                  onUpdateGallery={handleUpdateGallery}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'faqs' && (
                <FAQsPage
                  collegeData={collegeData}
                  onUpdateFaqs={handleUpdateFaqs}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}

              {activeTab === 'contact' && (
                <ContactPage
                  collegeData={collegeData}
                  onUpdateContact={handleUpdateContact}
                  onPreviewPublic={handleOpenPublicPreview}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Live Public Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setPreviewModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border-color p-6 sm:p-8 z-10 space-y-5 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between pb-4 border-b border-border-color">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-accent px-2 py-0.5 rounded">
                  Public Website Sync Preview
                </span>
                <h3 className="font-serif text-xl font-bold text-text-primary mt-1">
                  {collegeData.profile.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1.5 rounded-lg text-text-light hover:text-text-primary hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-border-color grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-text-light uppercase block">NIRF Rank</span>
                  <span className="font-bold text-brand-primary">#{collegeData.profile.nirfRank}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-light uppercase block">Avg Package</span>
                  <span className="font-bold text-emerald-600">{collegeData.placements.averagePackage}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-light uppercase block">Annual Tuition</span>
                  <span className="font-bold text-text-primary">{collegeData.fees.totalAnnualTuition}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-text-light uppercase block mb-1">Public Overview</span>
                <p className="text-text-secondary leading-relaxed bg-slate-50 p-3 rounded-lg border border-border-color">
                  {collegeData.profile.shortDescription}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-text-light uppercase block mb-1">Active Programs ({collegeData.courses.length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {collegeData.courses.map((c) => (
                    <span key={c.id} className="px-2 py-1 rounded bg-slate-100 text-text-primary text-[11px] font-medium border border-border-color">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200/60 rounded-xl text-emerald-900 text-xs font-semibold">
                ✓ All 13 CMS sections are in sync with the public student discovery site.
              </div>
            </div>

            <div className="pt-3 border-t border-border-color flex justify-end">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="btn btn-primary btn-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
