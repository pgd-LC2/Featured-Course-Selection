import { motion } from 'framer-motion'
import { Clock, Users, Star, Heart } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { useAppContext } from '../../contexts/AppContext'

interface Course {
  id: string
  title: string
  category: string
  rating: number
  enrolled: number
  capacity: number
  coverImage: string
  teacher: {
    name: string
    avatar: string
  }
  timeSlots: Array<{
    dayOfWeek: string
  }>
}

interface CourseCardProps {
  course: Course
  onClick: () => void
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const { state, actions } = useAppContext()
  const isFavorite = state.favorites.includes(course.id)

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    actions.toggleFavorite(course.id)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="cursor-pointer" onClick={onClick}>
        <div className="relative">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-40 object-cover"
          />
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite
                ? 'bg-red-500/90 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <div className="absolute bottom-3 left-3">
            <Badge variant="primary">{course.category}</Badge>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img
                src={course.teacher.avatar}
                alt={course.teacher.name}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-sm text-gray-600 truncate">{course.teacher.name}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>

          {/* 时间和人数 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600">
                {course.timeSlots[0]?.dayOfWeek}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {course.enrolled}/{course.capacity}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
