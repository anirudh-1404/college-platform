import React, { useState } from 'react'
import { Search, MapPin, ArrowRight } from 'lucide-react'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('all')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({ query, location })
    } else {
      console.log('Searching for:', { query, location })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-border-color shadow-premium hover:shadow-card hover:border-brand-primary/20 transition-all duration-300 flex flex-col md:flex-row items-stretch md:items-center gap-2.5 md:gap-0"
    >
      {/* Search Input Area */}
      <div className="flex-1 flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3">
        <Search className="h-5.5 w-5.5 text-text-light flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search colleges, exams, courses, or career guides..."
          className="w-full text-text-primary placeholder:text-text-light font-medium text-sm sm:text-base outline-none bg-transparent"
        />
      </div>

      {/* Divider (Desktop Only) */}
      <div className="hidden md:block h-8 w-[1px] bg-border-color mx-4" />

      {/* Location Filter Dropdown */}
      <div className="flex items-center gap-2.5 px-3 sm:px-4 py-2 sm:py-3 md:w-56">
        <MapPin className="h-5 w-5 text-text-light flex-shrink-0" />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full text-text-secondary font-semibold text-sm sm:text-base outline-none bg-transparent cursor-pointer appearance-none pr-6 relative"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394A3B8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right center',
            backgroundSize: '1.25rem',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <option value="all">All India</option>
          <option value="delhi">Delhi NCR</option>
          <option value="mumbai">Mumbai</option>
          <option value="bangalore">Bangalore</option>
          <option value="pune">Pune</option>
          <option value="chennai">Chennai</option>
        </select>
      </div>

      {/* Search Submit Button */}
      <button
        type="submit"
        className="px-6 sm:px-8 py-3.5 sm:py-4 md:py-4 rounded-xl sm:rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-text-on-dark font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-card hover:shadow-premium group cursor-pointer"
      >
        <span>Search</span>
        <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </form>
  )
}

export default SearchBar
