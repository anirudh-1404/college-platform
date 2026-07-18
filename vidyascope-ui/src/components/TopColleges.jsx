import React from 'react'
import { Star } from 'lucide-react'

const TopColleges = () => {
  const colleges = [
    {
      id: 'iit-bombay',
      name: 'IIT Bombay',
      location: 'Mumbai, Maharashtra',
      rating: '4.8',
      reviews: '2300',
      avgPackage: '₹24.5 LPA',
      fees: '₹8.94 L',
      feesDuration: '4 Yrs',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&h=380&q=80',
    },
    {
      id: 'du',
      name: 'Delhi University',
      location: 'New Delhi, Delhi',
      rating: '4.6',
      reviews: '2100',
      avgPackage: '₹8.6 LPA',
      fees: '₹2.1 L',
      feesDuration: '3 Yrs',
      image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=600&h=380&q=80',
    },
    {
      id: 'bits',
      name: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      rating: '4.7',
      reviews: '1800',
      avgPackage: '₹19.2 LPA',
      fees: '₹17.1 L',
      feesDuration: '4 Yrs',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=380&q=80',
    },
    {
      id: 'vit',
      name: 'VIT Vellore',
      location: 'Vellore, Tamil Nadu',
      rating: '4.5',
      reviews: '1700',
      avgPackage: '₹9.4 LPA',
      fees: '₹6.2 L',
      feesDuration: '4 Yrs',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&h=380&q=80',
    },
  ]

  return (
    <section className="py-12 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Top Colleges in India
        </h2>
        <a
          href="#all-colleges"
          className="text-sm sm:text-base font-bold text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors duration-200"
        >
          View all
        </a>
      </div>

      {/* Grid of College Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {colleges.map((college) => (
          <div
            key={college.id}
            className="group flex flex-col bg-white border border-border-color rounded-2xl shadow-sm hover:shadow-premium hover:border-brand-primary/20 hover:scale-[1.02] transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* College Image */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Content Body */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                {/* College Title */}
                <h3 className="text-base sm:text-lg font-extrabold text-text-primary group-hover:text-brand-primary transition-colors duration-200">
                  {college.name}
                </h3>
                
                {/* Location */}
                <p className="text-xs sm:text-sm text-text-light font-medium mt-1">
                  {college.location}
                </p>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1.5 mt-2.5">
                  <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-extrabold text-text-primary mt-0.5">
                    {college.rating}
                  </span>
                  <span className="text-xs text-text-light font-semibold mt-0.5">
                    ({college.reviews})
                  </span>
                </div>
              </div>

              {/* Detail Footer */}
              <div className="border-t border-slate-100 pt-4 mt-5 grid grid-cols-2 gap-4">
                {/* Avg Package */}
                <div>
                  <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">
                    Avg. Package
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-text-primary mt-0.5">
                    {college.avgPackage}
                  </p>
                </div>

                {/* Tuition Fees */}
                <div>
                  <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">
                    Fees ({college.feesDuration})
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-text-primary mt-0.5">
                    {college.fees}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TopColleges
