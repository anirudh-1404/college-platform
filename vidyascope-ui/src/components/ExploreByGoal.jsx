import React from 'react'
import { Trophy, ShieldAlert, Award, GraduationCap, Briefcase, Building2, Wallet } from 'lucide-react'

const ExploreByGoal = () => {
  const goals = [
    {
      id: 'placements',
      title: 'Best Placement Colleges',
      icon: Trophy,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      id: 'affordable',
      title: 'Affordable Colleges',
      icon: Briefcase,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      id: 'engineering',
      title: 'Top Engineering Colleges',
      icon: GraduationCap,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      id: 'mba',
      title: 'Top MBA Colleges',
      icon: Award,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      id: 'govt',
      title: 'Government Colleges',
      icon: Building2,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
    {
      id: 'budget',
      title: 'Colleges Under ₹5 Lakhs',
      icon: Wallet,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
    },
  ]

  return (
    <section className="py-12 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-text-primary mb-8 tracking-tight">
        Explore by Goal
      </h2>

      {/* Grid List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {goals.map((goal) => {
          const Icon = goal.icon
          return (
            <div
              key={goal.id}
              className="group flex flex-col items-center text-center p-6 bg-white border border-border-color rounded-2xl shadow-sm hover:shadow-card hover:border-brand-primary/20 hover:scale-[1.03] transition-all duration-300 cursor-pointer"
            >
              {/* Icon Wrapper */}
              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${goal.iconBg} ${goal.iconColor} group-hover:scale-110 transition-transform duration-300 mb-4`}>
                <Icon className="h-7 w-7" />
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-sm font-extrabold text-text-primary leading-snug group-hover:text-brand-primary transition-colors duration-200">
                {goal.title}
              </h3>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ExploreByGoal
