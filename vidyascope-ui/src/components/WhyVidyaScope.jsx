import React from 'react'
import { XCircle, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp, cardVariant, staggerContainer } from '../utils/animations'

const comparisons = [
  {
    parameter: 'Placement Figures',
    conventionalTitle: 'Outlier International Offers',
    conventionalDesc: 'Platforms advertise a single international off-campus offer (₹1.5 Cr) to artificially inflate brand perception across a 1,200-student batch.',
    vidyascopeTitle: 'Audited Batch Median CTC',
    vidyascopeDesc: 'We mandate official regulatory median compensation (what 90% of the class actually receives) backed by tax and recruiter proof.',
  },
  {
    parameter: 'Institutional Rankings',
    conventionalTitle: 'Pay-to-Play Sponsored Lists',
    conventionalDesc: 'Commercial portals routinely sell "Top 10 Private University" slots to institutions willing to pay high promotion retainers.',
    vidyascopeTitle: 'Zero Sponsored Rankings',
    vidyascopeDesc: 'Rankings follow pure government NIRF and NAAC scores. No institution can pay to jump position in search results or rankings.',
  },
  {
    parameter: 'Fee Transparency',
    conventionalTitle: 'Partial Tuition Quotes',
    conventionalDesc: 'Websites quote bare-minimum academic tuition, concealing compulsory hostel fees, mess deposits, and semester examination charges.',
    vidyascopeTitle: 'True 4-Year Cost of Living',
    vidyascopeDesc: 'Calculates the complete 4-year gross expenditure including mandatory living expenses, mess tiers, and recurring institutional dues.',
  },
  {
    parameter: 'Data Governance',
    conventionalTitle: 'Unverified Internet Scrapes',
    conventionalDesc: 'Aggregators scrape outdated forums, unverified student reviews, and PR press releases with zero legal accountability.',
    vidyascopeTitle: 'Official Editorial Oversight',
    vidyascopeDesc: 'Information is authored directly by designated institutional nodal officers and vetted by central editorial verification officers.',
  },
]

const WhyVidyaScope = () => {
  return (
    <section className="bg-white border-b border-border-color py-16 sm:py-24 text-left overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="max-w-3xl mb-12"
        >
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase">
            Consumer Protection Standard • Transparency Ledger
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-950 mt-1">
            The Industry Reality vs. The VidyaScope Standard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
            Higher education is among the largest financial investments an Indian family will ever make. Here is why thousands of students and parents trust our forensic audit over commercial portals.
          </p>
        </motion.div>

        {/* Forensic Truth Ledger Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeInUp}
          className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-sm"
        >
          
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-900 text-white text-xs font-mono font-bold uppercase tracking-wider py-4 px-6 border-b border-slate-800">
            <div className="md:col-span-3 text-slate-400">Decision Parameter</div>
            <div className="md:col-span-4 text-rose-300 flex items-center gap-1.5 mt-2 md:mt-0">
              <XCircle className="h-4 w-4 text-rose-400" />
              <span>Commercial College Portals</span>
            </div>
            <div className="md:col-span-5 text-emerald-300 flex items-center gap-1.5 mt-2 md:mt-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>VidyaScope Forensic Standard</span>
            </div>
          </div>

          {/* Table Body Rows */}
          <div className="divide-y divide-slate-200 text-xs">
            {comparisons.map((row, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-12 p-6 hover:bg-slate-50/70 transition-colors gap-4 items-start"
              >
                {/* Parameter Tag */}
                <div className="md:col-span-3">
                  <span className="font-serif text-sm font-bold text-slate-900 block">
                    {row.parameter}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Audited Standard 0{idx + 1}
                  </span>
                </div>

                {/* Conventional Portals Practice */}
                <div className="md:col-span-4 p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
                  <p className="font-bold text-rose-950 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{row.conventionalTitle}</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed font-normal">
                    {row.conventionalDesc}
                  </p>
                </div>

                {/* VidyaScope Standard */}
                <div className="md:col-span-5 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{row.vidyascopeTitle}</span>
                  </p>
                  <p className="text-slate-700 leading-relaxed font-normal">
                    {row.vidyascopeDesc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>

      </div>
    </section>
  )
}

export default WhyVidyaScope
