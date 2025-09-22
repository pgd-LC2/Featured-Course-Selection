import React from 'react'
import { Search, X } from 'lucide-react'
import { useAppContext } from '../../contexts/AppContext'

export function SearchBar() {
  const { state, dispatch } = useAppContext()

  return (
    <div className="px-4 py-3 bg-white border-b border-gray-100">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索课程名称或老师"
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
          className="w-full pl-10 pr-10 py-3 bg-gray-50 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        {state.searchQuery && (
          <button
            onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  )
}