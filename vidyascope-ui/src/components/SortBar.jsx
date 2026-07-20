import React from 'react'
import { LayoutGrid, List, Filter, X, ArrowUpDown } from 'lucide-react'

const SortBar = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeFilterChips,
  onRemoveChip,
  onOpenMobileFilters,
  totalCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-border-color shadow-sm p-4 space-y-3 mb-6">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Side: Mobile Filter Trigger & Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-brand-accent border border-brand-primary/20 text-brand-primary rounded-xl font-bold text-xs hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <span className="text-xs sm:text-sm font-bold text-text-secondary">
            Showing <strong className="text-text-primary">{totalCount}</strong> colleges
          </span>
        </div>

        {/* Right Side: Sort Selector & Grid/List View Toggles */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-border-color rounded-xl px-3 py-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-text-light" />
            <span className="hidden sm:inline text-xs font-bold text-text-light uppercase tracking-wider">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-text-primary outline-none cursor-pointer pr-1"
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating: High to Low</option>
              <option value="nirf">NIRF Rank: Top First</option>
              <option value="fees-low">Fees: Low to High</option>
              <option value="fees-high">Fees: High to Low</option>
              <option value="package-high">Package: High to Low</option>
            </select>
          </div>

          {/* Grid/List View Mode Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onViewModeChange('list')}
              aria-label="List View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-brand-primary shadow-sm font-bold'
                  : 'text-text-light hover:text-text-primary'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-brand-primary shadow-sm font-bold'
                  : 'text-text-light hover:text-text-primary'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Active Filter Chips Row */}
      {activeFilterChips && activeFilterChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-text-light uppercase tracking-wider mr-1">
            Active Filters:
          </span>
          {activeFilterChips.map((chip) => (
            <span
              key={`${chip.type}-${chip.value}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent border border-brand-primary/15 text-xs font-semibold text-brand-primary"
            >
              <span>{chip.label}</span>
              <button
                onClick={() => onRemoveChip(chip.type, chip.value)}
                className="hover:bg-brand-primary/10 rounded-full p-0.5 transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortBar
