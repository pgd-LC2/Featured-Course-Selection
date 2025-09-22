import { useNavigate, useLocation } from 'react-router-dom'
import { Home, ShoppingCart, User } from 'lucide-react'
import { useAppContext } from '../../contexts/AppContext'

const navItems = [
  { id: 'home', label: '主页', icon: Home, path: '/' },
  { id: 'cart', label: '购物车', icon: ShoppingCart, path: '/cart' },
  { id: 'profile', label: '我的', icon: User, path: '/profile' }
]

export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useAppContext()

  return (
    <div className="fixed bottom-3 left-6 right-6 z-40 flex justify-center">
      <div className="bg-white/30 backdrop-blur-md rounded-full shadow-lg border border-white/20 px-1 py-1 flex items-center gap-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const showBadge = item.id === 'cart' && state.cartItems.length > 0

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative transition-all duration-200 px-3 py-1 rounded-full text-sm ${
                isActive ? 'bg-gray-200' : ''
              }`}
            >
              <span
                className={`transition-colors duration-200 ${
                  isActive ? 'text-blue-600' : 'text-gray-900'
                }`}
              >
                {item.label}
              </span>
              {showBadge && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {state.cartItems.length}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
