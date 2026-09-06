import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp, cardVariant, staggerContainer } from '../utils/animations'

const Testimonials = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: 'How does VidyaScope verify college cutoff ranks and placement data?',
      a: 'All data is gathered through official statutory documentation, centralized counseling authorities (JoSAA, JAC, MCC, State CETs), and verified institutional audits by college deans and registrars.',
    },
    {
      q: 'What is the "True Cost of Education" calculator?',
      a: 'Unlike official tuition receipts that only show academic fees, our calculation incorporates mandatory hostel rentals, recurring mess charges, examination deposits, and hidden caution money across all 4 years.',
    },
    {
      q: 'Can colleges pay to promote their rankings or placement stats?',
      a: 'No. Rankings are strictly anchored to audited National Institutional Ranking Framework (NIRF) gazettes and NAAC accreditation scores approved by our editorial verification board.',
    },
    {
      q: 'How do I compare two colleges side-by-side?',
      a: 'Click the "Compare" checkbox on any college card or use the Compare tool in the navigation menu to view direct head-to-head metrics on average package, NIRF rank, and 4-year costs.',
    },
  ]

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50 border-b border-border-color overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Everything you need to know about navigating college admissions in India.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className="space-y-3"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={index}
                variants={cardVariant}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-shadow hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-primary' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}

export default Testimonials
