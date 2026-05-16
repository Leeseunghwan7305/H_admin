import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const tabs = [
  { to: '/',        icon: '🥩', label: '단백질' },
  { to: '/expense', icon: '💸', label: '지출'   },
  { to: '/settings',icon: '⚙️', label: '설정'   },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/80 backdrop-blur-md border-t border-pink-100 z-50">
      <div className="flex">
        {tabs.map(tab => (
          <NavLink key={tab.to} to={tab.to} end className="flex-1">
            {({ isActive }) => (
              <div className="flex flex-col items-center py-3 gap-1 relative">
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-pink-400"
                  />
                )}
                <span className="text-2xl">{tab.icon}</span>
                <span className={`text-xs font-bold ${isActive ? 'text-pink-500' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
      <div className="h-safe-bottom" />
    </nav>
  )
}
