import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-full font-medium transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500',
        {
          'bg-blue-600 text-white hover:bg-blue-700 shadow-md': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
          'border-2 border-blue-600 text-blue-600 hover:bg-blue-50': variant === 'outline',
          'text-gray-600 hover:bg-gray-100': variant === 'ghost',
          'bg-red-500 text-white hover:bg-red-600': variant === 'danger'
        },
        {
          'px-3 py-2 text-sm': size === 'sm',
          'px-4 py-3 text-base': size === 'md',
          'px-6 py-4 text-lg': size === 'lg'
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}