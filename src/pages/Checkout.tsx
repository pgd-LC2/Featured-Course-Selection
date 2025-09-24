import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Clock, User, Calendar, AlertTriangle } from 'lucide-react'
import { useAppContext } from '../contexts/AppContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { formatPrice, checkTimeConflict } from '../lib/utils'
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

interface TimeConflict {
  newCourse: CartItem
  conflictCourses: (CartItem | CartItem)[]
}

export function Checkout() {
  const navigate = useNavigate()
  const { state, actions } = useAppContext()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conflicts, setConflicts] = useState<TimeConflict[]>([])
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [currentConflict, setCurrentConflict] = useState<TimeConflict | null>(null)

  // Get selected cart items (for demo, we'll use all cart items)
  const selectedItems = state.cartItems
  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.course.materialFee ?? 0), 0)

  const checkForConflicts = (): TimeConflict[] => {
    const foundConflicts: TimeConflict[] = []
    const existingCourses = [...state.selectedCourses]

    selectedItems.forEach(newItem => {
      const conflictingCourses = existingCourses.filter(existingItem => {
        const existingSlot = {
          timeSlot: `${existingItem.selectedTimeSlot.startTime}-${existingItem.selectedTimeSlot.endTime}`,
          dayOfWeek: existingItem.selectedTimeSlot.dayOfWeek
        }
        const newSlot = {
          timeSlot: `${newItem.selectedTimeSlot.startTime}-${newItem.selectedTimeSlot.endTime}`,
          dayOfWeek: newItem.selectedTimeSlot.dayOfWeek
        }
        return checkTimeConflict([existingSlot], newSlot)
      })

      if (conflictingCourses.length > 0) {
        foundConflicts.push({
          newCourse: newItem,
          conflictCourses: conflictingCourses
        })
      }
    })

    return foundConflicts
  }

  const handleSubmitOrder = () => {
    // 检查时间冲突
    const foundConflicts = checkForConflicts()
    if (foundConflicts.length > 0) {
      setConflicts(foundConflicts)
      setCurrentConflict(foundConflicts[0])
      setShowConflictModal(true)
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(async () => {
      await actions.selectCourses(selectedItems)
      setIsProcessing(false)
      setShowConfirmModal(true)
    }, 2000)
  }

  const handleResolveConflict = (keepNew: boolean) => {
    if (!currentConflict) return

    if (keepNew) {
      // 移除冲突的已选课程
      currentConflict.conflictCourses.forEach(() => {
      })
    } else {
      // 从购物车中移除新课程
      actions.removeFromCart(currentConflict.newCourse.courseId)
    }

    // 处理下一个冲突或继续提交
    const remainingConflicts = conflicts.slice(1)
    if (remainingConflicts.length > 0) {
      setConflicts(remainingConflicts)
      setCurrentConflict(remainingConflicts[0])
    } else {
      setShowConflictModal(false)
      setCurrentConflict(null)
      // 重新检查是否还有冲突，如果没有则提交订单
      setTimeout(() => handleSubmitOrder(), 100)
    }
  }

  const handleConfirmComplete = () => {
    setShowConfirmModal(false)
    navigate('/profile')
  }

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">没有要结算的课程</h2>
          <Button onClick={() => navigate('/cart')}>返回购物车</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">确认订单</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Selected Courses */}
        <Card className="p-4">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            选择的课程
          </h2>
          
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <motion.div
                key={item.courseId}
                className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <img
                  src={item.course.coverImage}
                  alt={item.course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.course.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {item.course.teacher.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {item.selectedTimeSlot.dayOfWeek} {item.selectedTimeSlot.startTime}-{item.selectedTimeSlot.endTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-blue-600">
                      {formatPrice(item.course.materialFee ?? 0)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Course Schedule Summary */}
        <Card className="p-4">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            课程时间安排
          </h2>
          
          <div className="space-y-2">
            {selectedItems.map((item) => (
              <div key={item.courseId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-900">{item.course.title}</span>
                <span className="text-sm text-gray-600">
                  {item.selectedTimeSlot.dayOfWeek} {item.selectedTimeSlot.startTime}-{item.selectedTimeSlot.endTime}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-4">
          <h2 className="font-semibold text-gray-900 mb-4">订单摘要</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">课程数量</span>
              <span>{selectedItems.length} 门</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
              <span>总计费用</span>
              <span className="text-blue-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500">材料费合计</div>
            <div className="text-xl font-bold text-blue-600">
              {formatPrice(totalPrice)}
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            {selectedItems.length} 门课程
          </div>
        </div>
        
        <Button
          className="w-full"
          onClick={handleSubmitOrder}
          disabled={isProcessing}
        >
          {isProcessing ? '处理中...' : '确认选课'}
        </Button>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={handleConfirmComplete}
        title="选课成功"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">恭喜，选课成功！</h3>
          <p className="text-gray-600 mb-6">
            您已成功选择 {selectedItems.length} 门课程
          </p>
          <div className="space-y-3">
            <Button className="w-full" onClick={handleConfirmComplete}>
              查看我的课程
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              继续选课
            </Button>
          </div>
        </div>
      </Modal>

      {/* Conflict Resolution Modal */}
      <Modal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        title="时间冲突"
      >
        {currentConflict && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">检测到时间冲突</h3>
              <p className="text-gray-600 mb-4">
                以下课程时间冲突，请选择要保留哪个：
              </p>
            </div>

            {/* 新课程 */}
            <div className="space-y-3">
              <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">新选择</span>
                  <span className="font-medium text-gray-900">{currentConflict.newCourse.course.title}</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {currentConflict.newCourse.selectedTimeSlot.dayOfWeek} {currentConflict.newCourse.selectedTimeSlot.startTime}-{currentConflict.newCourse.selectedTimeSlot.endTime}
                  </span>
                </div>
                <Button
                  className="w-full mt-3"
                  onClick={() => handleResolveConflict(true)}
                >
                  保留这个课程
                </Button>
              </div>

              {/* 冲突课程 */}
              {currentConflict.conflictCourses.map((conflictCourse, index) => (
                <div key={index} className="border-2 border-gray-200 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">已选择</span>
                    <span className="font-medium text-gray-900">{conflictCourse.course.title}</span>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {conflictCourse.selectedTimeSlot.dayOfWeek} {conflictCourse.selectedTimeSlot.startTime}-{conflictCourse.selectedTimeSlot.endTime}
                    </span>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleResolveConflict(false)}
              >
                保留已选课程，移除新课程
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
