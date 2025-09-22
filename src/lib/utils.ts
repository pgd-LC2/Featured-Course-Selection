import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number): string {
  return `¥ ${price.toFixed(0)}`
}

export function formatTime(time: string): string {
  return time.replace(/:/g, ':')
}

export function checkTimeConflict(
  existingCourses: Array<{ timeSlot: string; dayOfWeek: string }>,
  newCourse: { timeSlot: string; dayOfWeek: string }
): boolean {
  return existingCourses.some(
    course => 
      course.timeSlot === newCourse.timeSlot && 
      course.dayOfWeek === newCourse.dayOfWeek
  )
}