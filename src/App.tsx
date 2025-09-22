import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider, useAppContext } from './contexts/AppContext'
import { BottomNavigation } from './components/layout/BottomNavigation'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { CourseDetail } from './pages/CourseDetail'
import { ShoppingCart } from './pages/ShoppingCart'
import { Checkout } from './pages/Checkout'
import { Profile } from './pages/Profile'

function AppContent() {
  const { state, dispatch } = useAppContext()

  const handleLogin = (userData: { name: string; studentId: string }) => {
    dispatch({ type: 'LOGIN', payload: userData })
  }

  if (!state.isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        
        <BottomNavigation />
      </div>
    </Router>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
