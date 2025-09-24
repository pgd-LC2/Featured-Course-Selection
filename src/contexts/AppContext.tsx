import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import * as supabaseService from '../lib/supabaseService'

interface CartItem {
  courseId: string
  course: any
  selectedTimeSlot: TimeSlot
  selectedDate?: string
}

interface TimeSlot {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  available: boolean
}

interface AppState {
  user: { name: string; studentId: string } | null
  token: string | null
  isLoggedIn: boolean
  courses: any[]
  cartItems: CartItem[]
  selectedCourses: CartItem[]
  favorites: string[]
  searchQuery: string
  selectedCategory: string
  selectedGrade: string
  selectedCourseType: string
  loading: {
    courses: boolean
    favorites: boolean
    cart: boolean
    selectedCourses: boolean
  }
}

type AppAction =
  | { type: 'LOGIN'; payload: { name: string; studentId: string; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_ITEM'; payload: { courseId: string; timeSlot: TimeSlot } }
  | { type: 'CLEAR_CART' }
  | { type: 'SELECT_COURSES'; payload: CartItem[] }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_GRADE'; payload: string }
  | { type: 'SET_COURSE_TYPE'; payload: string }
  | { type: 'SET_COURSES'; payload: any[] }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
  | { type: 'SET_SELECTED_COURSES'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; value: boolean } }

const initialState: AppState = {
  user: null,
  token: null,
  isLoggedIn: false,
  courses: [],
  cartItems: [],
  selectedCourses: [],
  favorites: [],
  searchQuery: '',
  selectedCategory: '全部',
  selectedGrade: '全部',
  selectedCourseType: '全部',
  loading: {
    courses: false,
    favorites: false,
    cart: false,
    selectedCourses: false
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: { name: action.payload.name, studentId: action.payload.studentId },
        token: action.payload.token,
        isLoggedIn: true
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoggedIn: false,
        cartItems: [],
        selectedCourses: [],
        favorites: []
      }
    case 'ADD_TO_CART': {
      const existingItem = state.cartItems.find(item => item.courseId === action.payload.courseId)
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.courseId === action.payload.courseId ? action.payload : item
          )
        }
      }
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload]
      }
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.courseId !== action.payload)
      }
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.courseId === action.payload.courseId 
            ? { ...item, selectedTimeSlot: action.payload.timeSlot }
            : item
        )
      }
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: []
      }
    case 'SELECT_COURSES':
      return {
        ...state,
        selectedCourses: [...state.selectedCourses, ...action.payload],
        cartItems: []
      }
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      }
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      }
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload
      }
    case 'SET_GRADE':
      return {
        ...state,
        selectedGrade: action.payload
      }
    case 'SET_COURSE_TYPE':
      return {
        ...state,
        selectedCourseType: action.payload
      }
    case 'SET_COURSES':
      return {
        ...state,
        courses: action.payload
      }
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload
      }
    case 'SET_CART_ITEMS':
      return {
        ...state,
        cartItems: action.payload
      }
    case 'SET_SELECTED_COURSES':
      return {
        ...state,
        selectedCourses: action.payload
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  actions: {
    loadCourses: () => Promise<void>
    loadFavorites: () => Promise<void>
    toggleFavorite: (courseId: string) => Promise<void>
    loadCartItems: () => Promise<void>
    addToCart: (item: CartItem) => Promise<void>
    removeFromCart: (courseId: string) => Promise<void>
    updateCartItem: (courseId: string, timeSlot: TimeSlot) => Promise<void>
    clearCart: () => Promise<void>
    loadSelectedCourses: () => Promise<void>
    selectCourses: (items: CartItem[]) => Promise<void>
  }
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const userRaw = localStorage.getItem('user')
    const token = localStorage.getItem('jwt')
    if (userRaw && token) {
      const u = JSON.parse(userRaw) as { name: string; studentId: string }
      dispatch({ type: 'LOGIN', payload: { name: u.name, studentId: u.studentId, token } })
    }
  }, [])

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    if (state.isLoggedIn && state.user) {
      loadFavorites()
      loadCartItems()
      loadSelectedCourses()
    }
  }, [state.isLoggedIn])

  const loadCourses = async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'courses', value: true } })
    try {
      const courses = await supabaseService.getCourses()
      dispatch({ type: 'SET_COURSES', payload: courses })
    } catch (error) {
      console.error('Failed to load courses:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'courses', value: false } })
    }
  }

  const loadFavorites = async () => {
    if (!state.user) return
    dispatch({ type: 'SET_LOADING', payload: { key: 'favorites', value: true } })
    try {
      const favorites = await supabaseService.getFavorites(state.user.studentId)
      dispatch({ type: 'SET_FAVORITES', payload: favorites })
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'favorites', value: false } })
    }
  }

  const toggleFavorite = async (courseId: string) => {
    if (!state.user) return
    try {
      const isFavorite = state.favorites.includes(courseId)
      if (isFavorite) {
        await supabaseService.removeFavorite(state.user.studentId, courseId)
        dispatch({ type: 'TOGGLE_FAVORITE', payload: courseId })
      } else {
        await supabaseService.addFavorite(state.user.studentId, courseId)
        dispatch({ type: 'TOGGLE_FAVORITE', payload: courseId })
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const loadCartItems = async () => {
    if (!state.user) return
    dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: true } })
    try {
      const cartItemsData = await supabaseService.getCartItems(state.user.studentId)
      const cartItems = cartItemsData.map((item: any) => ({
        courseId: item.course_id,
        course: {
          id: item.courses.id,
          title: item.courses.title,
          teacher: item.courses.teacher,
          category: item.courses.category,
          grade: item.courses.grade,
          price: item.courses.price,
          materialFee: item.courses.material_fee,
          capacity: item.courses.capacity,
          enrolled: item.courses.enrolled,
          coverImage: item.courses.cover_image || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: item.courses.rating || 4.5,
          reviewCount: item.courses.review_count || 0,
          tags: item.courses.tags || [],
          timeSlots: [],
          mediaContent: item.courses.media_content || []
        },
        selectedTimeSlot: {
          id: item.time_slots.id,
          dayOfWeek: getDayOfWeekName(item.time_slots.day_of_week),
          startTime: item.time_slots.start_time,
          endTime: item.time_slots.end_time,
          available: item.time_slots.available
        },
        selectedDate: item.selected_date
      })) as any[]
      dispatch({ type: 'SET_CART_ITEMS', payload: cartItems })
    } catch (error) {
      console.error('Failed to load cart items:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: false } })
    }
  }

  const getDayOfWeekName = (dayNum: number): string => {
    const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return days[dayNum] || '周一'
  }

  const addToCart = async (item: CartItem) => {
    if (!state.user) return
    try {
      await supabaseService.addToCart(
        state.user.studentId,
        item.courseId,
        item.selectedTimeSlot.id,
        item.selectedDate
      )
      dispatch({ type: 'ADD_TO_CART', payload: item })
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const removeFromCart = async (courseId: string) => {
    if (!state.user) return
    try {
      await supabaseService.removeFromCart(state.user.studentId, courseId)
      dispatch({ type: 'REMOVE_FROM_CART', payload: courseId })
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    }
  }

  const updateCartItem = async (courseId: string, timeSlot: TimeSlot) => {
    if (!state.user) return
    try {
      await supabaseService.updateCartItem(state.user.studentId, courseId, timeSlot.id)
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { courseId, timeSlot } })
    } catch (error) {
      console.error('Failed to update cart item:', error)
    }
  }

  const clearCart = async () => {
    if (!state.user) return
    try {
      await supabaseService.clearCart(state.user.studentId)
      dispatch({ type: 'CLEAR_CART' })
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const loadSelectedCourses = async () => {
    if (!state.user) return
    dispatch({ type: 'SET_LOADING', payload: { key: 'selectedCourses', value: true } })
    try {
      const selectedCoursesData = await supabaseService.getSelectedCourses(state.user.studentId)
      const selectedCourses = selectedCoursesData.map((item: any) => ({
        courseId: item.course_id,
        course: {
          id: item.courses.id,
          title: item.courses.title,
          teacher: item.courses.teacher,
          category: item.courses.category,
          grade: item.courses.grade,
          price: item.courses.price,
          materialFee: item.courses.material_fee,
          capacity: item.courses.capacity,
          enrolled: item.courses.enrolled,
          coverImage: item.courses.cover_image || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: item.courses.rating || 4.5,
          reviewCount: item.courses.review_count || 0,
          tags: item.courses.tags || [],
          timeSlots: [],
          mediaContent: item.courses.media_content || []
        },
        selectedTimeSlot: {
          id: item.time_slots.id,
          dayOfWeek: getDayOfWeekName(item.time_slots.day_of_week),
          startTime: item.time_slots.start_time,
          endTime: item.time_slots.end_time,
          available: item.time_slots.available
        },
        selectedDate: item.selected_at
      })) as any[]
      dispatch({ type: 'SET_SELECTED_COURSES', payload: selectedCourses })
    } catch (error) {
      console.error('Failed to load selected courses:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'selectedCourses', value: false } })
    }
  }

  const selectCourses = async (items: CartItem[]) => {
    if (!state.user) return
    try {
      const cartItems = items.map(item => ({
        student_id: state.user!.studentId,
        course_id: item.courseId,
        time_slot_id: item.selectedTimeSlot.id
      }))
      await supabaseService.selectCourses(state.user.studentId, cartItems)
      dispatch({ type: 'SELECT_COURSES', payload: items })
      await loadSelectedCourses()
    } catch (error) {
      console.error('Failed to select courses:', error)
    }
  }

  const actions = {
    loadCourses,
    loadFavorites,
    toggleFavorite,
    loadCartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    loadSelectedCourses,
    selectCourses
  }

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
