import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}