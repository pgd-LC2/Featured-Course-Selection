import React from 'react'
import { Filter } from 'lucide-react'
import { categories, grades, courseTypes } from '../../data/mockData'
import { useAppContext } from '../../contexts/AppContext'

export function FilterBar() {
  const { state, dispatch } = useAppContext()

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">筛选条件</span>
      </div>
      
      <div className="space-y-3">
        {/* Category Filter */}
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category })}
                className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  state.selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grade Filter */}
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => dispatch({ type: 'SET_GRADE', payload: grade })}
                className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  state.selectedGrade === grade
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}