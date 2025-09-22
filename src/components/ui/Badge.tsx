import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  children: React.ReactNode
}

export function Badge({ variant = 'secondary', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        {
          'bg-blue-100 text-blue-800': variant === 'primary',
          'bg-gray-100 text-gray-800': variant === 'secondary',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'error'
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}