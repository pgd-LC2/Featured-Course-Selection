import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trash2, Edit3, ShoppingBag } from 'lucide-react'
import { useAppContext } from '../contexts/AppContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { TimeSlotSelector } from '../components/course/TimeSlotSelector'
import { formatPrice } from '../lib/utils'
import { CartItem, TimeSlot } from '../data/mockData'

export function ShoppingCart() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [editingItem, setEditingItem] = useState<CartItem | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>()

  const totalPrice = state.cartItems
    .filter(item => selectedItems.includes(item.courseId))
    .reduce((sum, item) => sum + (item.course.materialFee ?? 0), 0)

  const handleSelectAll = () => {
    if (selectedItems.length === state.cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(state.cartItems.map(item => item.courseId))
    }
  }

  const handleSelectItem = (courseId: string) => {
    setSelectedItems(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  const handleRemoveItem = (courseId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: courseId })
    setSelectedItems(prev => prev.filter(id => id !== courseId))
  }

  const handleRemoveSelected = () => {
    selectedItems.forEach(courseId => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: courseId })
    })
    setSelectedItems([])
  }

  const handleEditTime = (item: CartItem) => {
    setEditingItem(item)
    setSelectedTimeSlot(item.selectedTimeSlot)
  }

  const handleConfirmTimeEdit = () => {
    if (editingItem && selectedTimeSlot) {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: {
          courseId: editingItem.courseId,
          timeSlot: selectedTimeSlot
        }
      })
      setEditingItem(null)
      setSelectedTimeSlot(undefined)
    }
  }

  const handleCheckout = () => {
    if (selectedItems.length > 0) {
      navigate('/checkout')
    }
  }

  if (state.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white px-4 py-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">购物车</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">购物车为空</h2>
            <p className="text-gray-500 mb-8">快去选择你喜欢的课程吧</p>
            <Button onClick={() => navigate('/')}>
              去选课
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              购物车 ({state.cartItems.length})
            </h1>
          </div>
          
          {state.cartItems.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="text-blue-600 text-sm font-medium"
              >
                {selectedItems.length === state.cartItems.length ? '取消全选' : '全选'}
              </button>
              {selectedItems.length > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  className="text-red-500 text-sm font-medium ml-4"
                >
                  删除选中
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-6 space-y-4">
        <AnimatePresence>
          {state.cartItems.map((item) => (
            <motion.div
              key={item.courseId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleSelectItem(item.courseId)}
                      className="mt-1"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedItems.includes(item.courseId)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedItems.includes(item.courseId) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>

                    {/* Course Image */}
                    <img
                      src={item.course.coverImage}
                      alt={item.course.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {item.course.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.course.teacher.name}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-blue-50 px-2 py-1 rounded text-xs text-blue-600">
                          {item.selectedTimeSlot.dayOfWeek}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.selectedTimeSlot.startTime} - {item.selectedTimeSlot.endTime}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-semibold text-blue-600">
                            {formatPrice(item.course.materialFee ?? 0)}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTime(item)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.courseId)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm"
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectedItems.length === state.cartItems.length
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedItems.length === state.cartItems.length && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span>全选</span>
            </button>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">
              总计 {selectedItems.length} 门课程
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {formatPrice(totalPrice ?? 0)}
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
        >
          确认选课 ({selectedItems.length})
        </Button>
      </div>

      {/* Edit Time Modal */}
      {editingItem && (
        <Modal
          isOpen={!!editingItem}
          onClose={() => {
            setEditingItem(null)
            setSelectedTimeSlot(undefined)
          }}
          title="修改上课时间"
        >
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">{editingItem.course.title}</h3>
            <p className="text-sm text-gray-500">{editingItem.course.teacher.name}</p>
          </div>
          
          <TimeSlotSelector
            timeSlots={editingItem.course.timeSlots}
            selectedSlot={selectedTimeSlot}
            onSelect={setSelectedTimeSlot}
          />
          
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setEditingItem(null)
                setSelectedTimeSlot(undefined)
              }}
            >
              取消
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirmTimeEdit}
              disabled={!selectedTimeSlot}
            >
              确认修改
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
