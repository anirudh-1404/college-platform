import React from 'react'

const TrendingTags = ({ onTagClick }) => {
  const tags = [
    { name: 'MBA', count: '12k+' },
    { name: 'B.Tech', count: '45k+' },
    { name: 'NEET 2026', count: '18k+' },
    { name: 'IIT Bombay', count: '8k+' },
    { name: 'Scholarships', count: '25k+' },
    { name: 'Career Path', count: '15k+' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
      <span className="text-sm font-bold text-text-secondary">
        Trending:
      </span>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => onTagClick && onTagClick(tag.name)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border-color bg-white hover:bg-brand-accent hover:border-brand-primary/20 text-xs sm:text-sm font-semibold text-text-secondary hover:text-brand-primary transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-card cursor-pointer"
          >
            <span>{tag.name}</span>
            <span className="text-[10px] font-medium text-text-light px-1 bg-slate-100 rounded-md">
              {tag.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TrendingTags
