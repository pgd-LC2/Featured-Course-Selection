import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { mockCourses } from '../data/mockData'
import { CourseCard } from '../components/course/CourseCard'

export function HomePage() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredCourses = useMemo(() => {
    return mockCourses
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20 hide-scrollbar overflow-y-auto">
      {/* Full Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-6 text-white relative overflow-hidden">
        {/* 装饰圆圈 */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-16 -left-6 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-2 right-6 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">特色课程</h1>
            <p className="text-white/80 mt-1">发现你感兴趣的优质课程</p>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sticky Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 translate-y-0' 
          : '-translate-y-full'
      }`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">特色课程</h1>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="px-4 py-6 flex-1">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              推荐课程 ({filteredCourses.length})
            </h2>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CourseCard
                    course={course}
                    onClick={() => navigate(`/course/${course.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无课程</h3>
              <p className="text-gray-500">请稍后再来查看</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
