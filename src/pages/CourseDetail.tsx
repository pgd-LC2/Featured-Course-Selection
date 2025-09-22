import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Users, Clock, Heart, ShoppingCart } from 'lucide-react'
import { mockCourses, TimeSlot } from '../data/mockData'
import { useAppContext } from '../contexts/AppContext'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { TimeSlotSelector } from '../components/course/TimeSlotSelector'
import { TeacherInfo } from '../components/course/TeacherInfo'
import { CourseCard } from '../components/course/CourseCard'
import { MediaCarousel } from '../components/course/MediaCarousel'
import { formatPrice } from '../lib/utils'

export function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const [showTimeSelector, setShowTimeSelector] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>()

  const course = mockCourses.find(c => c.id === id)
  const isFavorite = course && state.favorites.includes(course.id)
  const isInCart = course && state.cartItems.some(item => item.courseId === course.id)
  
  // Get recommended courses (excluding current course)
  const recommendedCourses = mockCourses
    .filter(c => c.id !== id && c.category === course?.category)
    .slice(0, 2)

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">课程未找到</h2>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    const isModifying = isInCart
    
    if (!selectedTimeSlot || isModifying) {
      // 如果是修改操作，预选当前时间段
      if (isModifying && !selectedTimeSlot) {
        const currentCartItem = state.cartItems.find(item => item.courseId === course.id)
        if (currentCartItem) {
          setSelectedTimeSlot(currentCartItem.selectedTimeSlot)
        }
      }
      setShowTimeSelector(true)
      return
    }

    const cartItem = {
      courseId: course.id,
      course,
      selectedTimeSlot,
      selectedDate: new Date().toISOString().split('T')[0]
    }

    dispatch({ type: 'ADD_TO_CART', payload: cartItem })
    
    // Show success feedback
    const button = document.getElementById('add-to-cart-btn')
    if (button) {
      button.textContent = isModifying ? '时间已修改' : '已添加到购物车'
      setTimeout(() => {
        button.textContent = isInCart ? '修改时间' : '加入购物车'
      }, 1500)
    }
  }

  const handleTimeSlotConfirm = () => {
    if (selectedTimeSlot) {
      const isModifying = isInCart
      setShowTimeSelector(false)
      
      const cartItem = {
        courseId: course.id,
        course,
        selectedTimeSlot,
        selectedDate: new Date().toISOString().split('T')[0]
      }

      dispatch({ type: 'ADD_TO_CART', payload: cartItem })
      
      // Show success feedback
      const button = document.getElementById('add-to-cart-btn')
      if (button) {
        button.textContent = isModifying ? '时间已修改' : '已添加到购物车'
        setTimeout(() => {
          button.textContent = isInCart ? '修改时间' : '加入购物车'
        }, 1500)
      }
    }
  }

  const handleFavoriteToggle = () => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: course.id })
  }

  return (
    <div className="min-h-screen bg-white pb-32 hide-scrollbar overflow-y-auto">
      {/* Header with Back and Favorite buttons */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Media Carousel */}
      <div className="px-4 py-4">
        <MediaCarousel
          mediaItems={course.mediaContent}
          className="w-full rounded-xl overflow-hidden"
        />
      </div>

      {/* Course Basic Info */}
      <div className="px-4 pb-4">
        <Badge variant="primary" className="mb-3">
          {course.category}
        </Badge>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
            <span className="text-sm text-gray-500">({course.reviewCount}评价)</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Price and Basic Info */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg text-gray-700">
              <span className="text-sm text-gray-500">所需</span>
              <span className="ml-1 font-semibold text-gray-900">
                {formatPrice(course.materialFee)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {course.enrolled}/{course.capacity}人
              </span>
            </div>
          </div>
        </div>

          {/* Course Tags */}
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">课程介绍</h3>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              上课时间
            </h3>
            <div className="grid gap-2">
              {course.timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{slot.dayOfWeek}</span>
                    <span className="text-gray-500 ml-2">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <Badge variant={slot.available ? "success" : "secondary"}>
                    {slot.available ? "可选" : "已满"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">授课老师</h3>
            <TeacherInfo teacher={course.teacher} />
          </div>

          {/* Recommended Courses */}
          {recommendedCourses.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">相关推荐</h3>
              <div className="space-y-4">
                {recommendedCourses.map((recommendedCourse) => (
                  <CourseCard
                    key={recommendedCourse.id}
                    course={recommendedCourse}
                    onClick={() => navigate(`/course/${recommendedCourse.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 bg-transparent px-4 py-4">
          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              size="md"
              className="flex-1 flex items-center justify-center bg-white/50 backdrop-blur-md"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              购物车({state.cartItems.length})
            </Button>
            <Button
              id="add-to-cart-btn"
              size="md"
              className="flex-1 flex items-center justify-center"
              onClick={handleAddToCart}
              disabled={!course.timeSlots.some(slot => slot.available)}
            >
              {isInCart ? '修改时间' : '加入购物车'}
            </Button>
          </div>
        </div>

        {/* Time Slot Selector Modal */}
        <Modal
          isOpen={showTimeSelector}
          onClose={() => setShowTimeSelector(false)}
          title="选择上课时间"
        >
          <TimeSlotSelector
            timeSlots={course.timeSlots}
            selectedSlot={selectedTimeSlot}
            onSelect={setSelectedTimeSlot}
          />
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowTimeSelector(false)}
            >
              取消
            </Button>
            <Button
              className="flex-1"
              onClick={handleTimeSlotConfirm}
              disabled={!selectedTimeSlot}
            >
              确认选择
            </Button>
          </div>
        </Modal>

    </div>
  )
}
