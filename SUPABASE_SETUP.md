# Supabase Integration Setup Guide

## Overview
This project integrates with Supabase for backend data management including user authentication, favorites, shopping cart, and course selection features.

## Prerequisites
1. Supabase project with the following environment variables configured
2. Edge Function `login_by_student` deployed (from PR #2)
3. Database tables created using the provided SQL schema

## Environment Variables
Create a `.env` file in the project root with your actual Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Setup
Run the SQL commands in `supabase-setup.sql` to create the instructors table:

```sql
-- Creates instructors table with RLS policies
-- Inserts sample instructor data from mockData.ts
-- Links instructors to existing courses
```

## Features Integrated

### 1. JWT Authentication (Already implemented in PR #2)
- Login with student ID + name
- 24-hour JWT token expiry
- Automatic token refresh and persistence

### 2. Favorites System
- Add/remove courses from favorites
- Persisted in `favorites` table with RLS
- Real-time sync with Supabase

### 3. Shopping Cart
- Add courses with time slot selection
- Update cart items (change time slots)
- Remove individual items or clear entire cart
- Persisted in `cart_items` table with RLS

### 4. Course Selection
- Move cart items to selected courses
- Track enrollment history
- Persisted in `selected_courses` table with RLS

### 5. Instructors Management
- New `instructors` table with full instructor profiles
- Public read access for course browsing
- Linked to courses for detailed teacher information

## Testing Instructions

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Login Flow
1. Navigate to http://localhost:5173
2. Enter student ID and name (e.g., "20250001", "张三")
3. Verify JWT token is stored in localStorage
4. Confirm successful login and navigation to main app

### 3. Test Favorites
1. Browse courses on home page
2. Click heart icon to add/remove favorites
3. Verify favorites persist after page refresh
4. Check Supabase dashboard for `favorites` table entries

### 4. Test Shopping Cart
1. Click "加入购物车" on course cards
2. Select time slots in the modal
3. Navigate to cart page (/cart)
4. Modify time slots or remove items
5. Verify changes persist in `cart_items` table

### 5. Test Course Selection
1. Add items to cart
2. Navigate to checkout (/checkout)
3. Complete course selection process
4. Verify items move from cart to `selected_courses` table
5. Check that cart is cleared after selection

### 6. Test Data Persistence
1. Perform actions (favorites, cart, selection)
2. Refresh browser or restart dev server
3. Login again with same credentials
4. Verify all data is restored from Supabase

## Database Schema

### Tables Created
- `users` - Student information with RLS
- `courses` - Course catalog (public read)
- `time_slots` - Available time slots (public read)
- `favorites` - User favorites with RLS
- `cart_items` - Shopping cart with RLS
- `selected_courses` - Enrolled courses with RLS
- `instructors` - Teacher profiles (public read)

### Row Level Security (RLS)
All user-specific tables use RLS policies that check:
```sql
(auth.jwt() ->> 'student_id') = student_id
```

This ensures users can only access their own data.

## API Service Layer
The `supabaseService.ts` file provides:
- JWT-authenticated API functions
- Error handling for all database operations
- Type-safe interfaces for all data structures
- Consistent patterns for CRUD operations

## Troubleshooting

### Common Issues
1. **Invalid Supabase URL**: Ensure environment variables are set correctly
2. **Authentication errors**: Verify Edge Function is deployed and accessible
3. **RLS policy errors**: Check JWT token is valid and contains student_id
4. **Network errors**: Confirm Supabase project is accessible

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify network requests in browser DevTools
3. Check Supabase dashboard for table data
4. Validate JWT token in localStorage

## Development Notes
- All async operations include loading states
- Error handling prevents app crashes
- State management maintains consistency between local and remote data
- Components automatically re-render when data changes
