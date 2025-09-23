import { createAuthedClient, getAuthToken } from './supabase'

interface CartItem {
  student_id: string
  course_id: string
  time_slot_id: string
  selected_date?: string
}

interface SelectedCourse {
  student_id: string
  course_id: string
  time_slot_id: string
}

export async function getFavorites(studentId: string): Promise<string[]> {
  const token = getAuthToken()
  if (!token) throw new Error('未登录')
  
  const client = createAuthedClient(token)
  const { data, error } = await client
    .from('favorites')
    .select('course_id')
    .eq('student_id', studentId)
  
  if (error) throw error
  return data.map(item => item.course_id)
}

export async function addFavorite(studentId: string, courseId: string): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error('未登录')
  
  const client = createAuthedClient(token)
  const { error } = await client
    .from('favorites')
    .insert({ student_id: studentId, course_id: courseId })
  
  if (error) throw error
}

export async function removeFavorite(studentId: string, courseId: string): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error('未登录')
  
  const client = createAuthedClient(token)
  const { error } = await client
    .from('favorites')
    .delete()
    .eq('student_id', studentId)
    .eq('course_id', courseId)
  
  if (error) throw error
}

export async function getCartItems(studentId: string): Promise<any[]> {
  const token = getAuthToken()
  if (!token) throw new Error('未登录')
  
  const client = createAuthedClient(token)
  const { data, error } = await client
    .from('cart_items')
    .select(`
      course_id,
      time_slot_id,
      selected_date,
      courses (
        id,
        title,
        teacher,
        category,
        grade,
        price,
        material_fee,
        capacity,
        enrolled
      ),
      time_slots (
        id,
        day_of_week,
        start_time,
        end_time,
        available
      )
    `)
    .eq('student_id', studentId)
  
  if (error) throw error
  return data || []
}

export async function addToCart(
  studentId: string, 
  courseId: string, 
  timeSlotId: string, 
  selectedDate?: string
): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error('未登录')
  
  const client = createAuthedClient(token)
  const { error } = await client
    .from('cart_items')
    .upsert({
      student_id: studentId,
      course_id: courseId,
      time_slot_id: timeSlotId,
      selected_date: selectedDate
    })
  
  if (error) throw error
}

export async function updateCartItem(
  studentId: string,
  courseId: string,
  timeSlotId: string,
  selectedDate?: string
): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error('未登录')
  
  const client = createAuthedClient(token)
  const { error } = await client
    .from('cart_items')
    .update({
      time_slot_id: timeSlotId,
      selected_date: selectedDate
    })
    .eq('student_id', studentId)
    .eq('course_id', courseId)
  
  if (error) throw error
}

export async function removeFromCart(studentId: string, courseId: string): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error('未登录')
  
  const client = createAuthedClient(token)
  const { error } = await client
    .from('cart_items')
    .delete()
    .eq('student_id', studentId)
    .eq('course_id', courseId)
  
  if (error) throw error
}

export async function clearCart(studentId: string): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error('未登录')
  
  const client = createAuthedClient(token)
  const { error } = await client
    .from('cart_items')
    .delete()
    .eq('student_id', studentId)
  
  if (error) throw error
}

export async function getSelectedCourses(studentId: string): Promise<any[]> {
  const token = getAuthToken()
  if (!token) throw new Error('未登录')
  
  const client = createAuthedClient(token)
  const { data, error } = await client
    .from('selected_courses')
    .select(`
      course_id,
      time_slot_id,
      selected_at,
      courses (
        id,
        title,
        teacher,
        category,
        grade,
        price,
        material_fee,
        capacity,
        enrolled
      ),
      time_slots (
        id,
        day_of_week,
        start_time,
        end_time,
        available
      )
    `)
    .eq('student_id', studentId)
  
  if (error) throw error
  return data || []
}

export async function selectCourses(studentId: string, cartItems: CartItem[]): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error('未登录')
  
  const client = createAuthedClient(token)
  
  const selectedCourses = cartItems.map(item => ({
    student_id: studentId,
    course_id: item.course_id,
    time_slot_id: item.time_slot_id
  }))
  
  const { error: insertError } = await client
    .from('selected_courses')
    .insert(selectedCourses)
  
  if (insertError) throw insertError
  
  await clearCart(studentId)
}

export async function getCourses(): Promise<any[]> {
  const token = getAuthToken()
  const client = token ? createAuthedClient(token) : (await import('./supabase')).supabase
  
  const { data, error } = await client
    .from('courses')
    .select(`
      *,
      time_slots (
        id,
        day_of_week,
        start_time,
        end_time,
        available
      )
    `)
  
  if (error) throw error
  return data || []
}

export async function getInstructors(): Promise<any[]> {
  const token = getAuthToken()
  const client = token ? createAuthedClient(token) : (await import('./supabase')).supabase
  
  const { data, error } = await client
    .from('instructors')
    .select('*')
  
  if (error) throw error
  return data || []
}
