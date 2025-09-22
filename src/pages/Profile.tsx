import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings, Heart, Calendar, Clock, Star, Edit3, Trophy, BookOpen, Target, TrendingUp, LogOut } from 'lucide-react'
import { useAppContext } from '../contexts/AppContext'
import { mockCourses } from '../data/mockData'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { TimeSlotSelector } from '../components/course/TimeSlotSelector'
import { formatPrice } from '../lib/utils'

export function Profile() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const [activeTab, setActiveTab] = useState<'selected' | 'favorites'>('selected')
  const [editingCourse, setEditingCourse] = useState<any>(null)

  const favoriteCourses = mockCourses.filter(course => 
    state.favorites.includes(course.id)
  )

  const handleEditCourse = (courseItem: any) => {
    setEditingCourse(courseItem)
  }

  const handleRemoveFromFavorites = (courseId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: courseId })
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 px-4 py-8 text-white relative overflow-hidden">
        {/* 装饰圆圈 */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-24 -left-8 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 right-8 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-2xl font-bold">学</span>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{state.user?.name}</h1>
              <p className="text-white/80">继续你的学习之旅</p>
              <p className="text-white/60 text-sm">学号：{state.user?.studentId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button 
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-sm border border-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-6 h-6" />
            </motion.button>
            <motion.button 
              onClick={handleLogout}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-2xl backdrop-blur-sm border border-red-400/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <motion.div 
            className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-6 h-6 text-white/80" />
              <div className="text-3xl font-bold">{state.selectedCourses.length}</div>
            </div>
            <div className="text-sm text-white/80">已选课程</div>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-6 h-6 text-white/80" />
              <div className="text-3xl font-bold">{state.favorites.length}</div>
            </div>
            <div className="text-sm text-white/80">收藏课程</div>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('selected')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
              activeTab === 'selected'
                ? 'text-blue-600 border-b-3 border-blue-600 bg-gradient-to-t from-blue-50 to-transparent'
                : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              我的课程
            </div>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
              activeTab === 'favorites'
                ? 'text-pink-600 border-b-3 border-pink-600 bg-gradient-to-t from-pink-50 to-transparent'
                : 'text-gray-600 hover:text-pink-500 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              收藏课程
            </div>
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        {activeTab === 'selected' && (
          <div className="space-y-4">
            {state.selectedCourses.length > 0 ? (
              state.selectedCourses.map((item) => (
                <motion.div
                  key={item.courseId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Card className="overflow-hidden bg-gradient-to-r from-white to-blue-50/30 border border-blue-100/50 shadow-lg">
                    <div className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.course.coverImage}
                          alt={item.course.title}
                          className="w-20 h-20 rounded-xl object-cover shadow-md"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.course.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {item.course.teacher.name}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="primary" className="bg-gradient-to-r from-blue-500 to-blue-600">{item.course.category}</Badge>
                            <Badge variant="secondary">{item.course.grade}</Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>{item.selectedTimeSlot.dayOfWeek}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-green-500" />
                                <span>
                                  {item.selectedTimeSlot.startTime}-{item.selectedTimeSlot.endTime}
                                </span>
                              </div>
                            </div>
                            
                            <motion.button
                              onClick={() => handleEditCourse(item)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit3 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无选择课程</h3>
                <p className="text-gray-500 mb-8">去选择你感兴趣的课程吧 📚</p>
                <Button 
                  onClick={() => navigate('/')} 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  开始选课
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-4">
            {favoriteCourses.length > 0 ? (
              favoriteCourses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Card className="overflow-hidden bg-gradient-to-r from-white to-pink-50/30 border border-pink-100/50 shadow-lg">
                    <div className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          className="w-20 h-20 rounded-xl object-cover shadow-md"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {course.teacher.name}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="primary" className="bg-gradient-to-r from-pink-500 to-rose-600">{course.category}</Badge>
                            <Badge variant="secondary">{course.grade}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{course.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-blue-600">
                              {formatPrice(course.materialFee)}
                            </span>
                            
                            <motion.button
                              onClick={() => handleRemoveFromFavorites(course.id)}
                              className="p-2 text-pink-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-pink-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无收藏课程</h3>
                <p className="text-gray-500">收藏感兴趣的课程，方便以后查看 💕</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <Modal
          isOpen={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          title="修改课程时间"
        >
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">{editingCourse.course.title}</h3>
            <p className="text-sm text-gray-500">{editingCourse.course.teacher.name}</p>
          </div>
          
          <TimeSlotSelector
            timeSlots={editingCourse.course.timeSlots}
            selectedSlot={editingCourse.selectedTimeSlot}
            onSelect={() => {}} // For demo purposes
          />
          
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setEditingCourse(null)}
            >
              取消
            </Button>
            <Button
              className="flex-1"
              onClick={() => setEditingCourse(null)}
            >
              保存修改
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}