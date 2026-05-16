import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { to: '/',        icon: '🥩', label: '단백질' },
  { to: '/expense', icon: '💸', label: '지출'   },
  { to: '/settings',icon: '⚙️', label: '설정'   },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/80 backdrop-blur-md border-t border-pink-100 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {tabs.map(tab => {
          const isActive = tab.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(tab.to)

          return (
            <button
              key={tab.to}
              onTouchEnd={(e) => { e.preventDefault(); navigate(tab.to) }}
              onClick={() => navigate(tab.to)}
              className="flex-1 flex flex-col items-center py-3 gap-1 relative bg-transparent border-none cursor-pointer touch-manipulation outline-none"
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-pink-400 block" />
              )}
              <span className="text-2xl leading-none">{tab.icon}</span>
              <span className={`text-xs font-bold ${isActive ? 'text-pink-500' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
