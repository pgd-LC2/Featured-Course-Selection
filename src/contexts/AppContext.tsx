import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { CartItem, TimeSlot } from '../data/mockData'

interface AppState {
  user: { name: string; studentId: string } | null
  isLoggedIn: boolean
  cartItems: CartItem[]
  selectedCourses: CartItem[]
  favorites: string[]
  searchQuery: string
  selectedCategory: string
  selectedGrade: string
  selectedCourseType: string
}

type AppAction =
  | { type: 'LOGIN'; payload: { name: string; studentId: string } }
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

const initialState: AppState = {
  user: null,
  isLoggedIn: false,
  cartItems: [],
  selectedCourses: [],
  favorites: [],
  searchQuery: '',
  selectedCategory: '全部',
  selectedGrade: '全部',
  selectedCourseType: '全部'
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
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
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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
