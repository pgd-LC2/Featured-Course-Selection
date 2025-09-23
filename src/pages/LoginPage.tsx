import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, User, Hash } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

interface LoginPageProps {
  onLogin: (userData: { name: string; studentId: string; token: string }) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !studentId.trim()) return

    setIsLoading(true)
    setError(null)
    try {
      const url = import.meta.env.VITE_SUPABASE_URL as string
      const endpoint = `${url}/functions/v1/login_by_student`
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId.trim(), name: name.trim() })
      })
      let data: unknown = null
      try { data = await resp.json() } catch { data = null }
      if (!resp.ok) {
        let msg = `登录失败 (${resp.status})`
        if (typeof data === 'object' && data !== null) {
          const obj = data as Record<string, unknown>
          if (typeof obj.error === 'string') msg = obj.error
          else if (typeof obj.message === 'string') msg = obj.message
        }
        setError(msg)
        return
      }
      const obj = (typeof data === 'object' && data !== null ? data as Record<string, unknown> : {}) as Record<string, unknown>
      const token = typeof obj.token === 'string' ? obj.token : null
      if (token) {
        localStorage.setItem('jwt', token)
        localStorage.setItem('user', JSON.stringify({ name: name.trim(), studentId: studentId.trim() }))
        onLogin({ name: name.trim(), studentId: studentId.trim(), token })
      } else {
        throw new Error('未获取到令牌')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '登录失败，请稍后重试'
      setError(message)
      console.error('login error', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 flex items-center justify-center p-4">
      {/* 装饰背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-32 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo 和欢迎文字 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-2"
          >
            特色课程选择
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/80"
          >
            请输入信息开始选课
          </motion.p>
        </div>

        {/* 登录表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 姓名输入 */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  姓名
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入你的姓名"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                  />
                </div>
              </div>

              {/* 学号输入 */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  学号
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="请输入你的学号"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                  />
                </div>
              </div>

{error && (
  <div className="mt-3 text-sm text-red-200 text-center">
    {error}
  </div>
)}

              {/* 登录按钮 */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:bg-white/20 disabled:text-white/60 disabled:hover:scale-100"
                disabled={!name.trim() || !studentId.trim() || isLoading}
              >
                {isLoading ? '登录中...' : '开始选课'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-white/70 text-sm">
            首次使用？输入信息即可快速开始
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
