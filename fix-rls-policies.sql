
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
on public.users for select
to authenticated
using ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
on public.users for update
to authenticated
using ((select auth.jwt() ->> 'student_id') = student_id)
with check ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own"
on public.favorites for select
to authenticated
using ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own"
on public.favorites for insert
to authenticated
with check ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own"
on public.favorites for delete
to authenticated
using ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "cart_select_own" on public.cart_items;
create policy "cart_select_own"
on public.cart_items for select
to authenticated
using ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "cart_insert_own" on public.cart_items;
create policy "cart_insert_own"
on public.cart_items for insert
to authenticated
with check ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "cart_update_own" on public.cart_items;
create policy "cart_update_own"
on public.cart_items for update
to authenticated
using ((select auth.jwt() ->> 'student_id') = student_id)
with check ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "cart_delete_own" on public.cart_items;
create policy "cart_delete_own"
on public.cart_items for delete
to authenticated
using ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "sel_select_own" on public.selected_courses;
create policy "sel_select_own"
on public.selected_courses for select
to authenticated
using ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "sel_insert_own" on public.selected_courses;
create policy "sel_insert_own"
on public.selected_courses for insert
to authenticated
with check ((select auth.jwt() ->> 'student_id') = student_id);

drop policy if exists "sel_delete_own" on public.selected_courses;
create policy "sel_delete_own"
on public.selected_courses for delete
to authenticated
using ((select auth.jwt() ->> 'student_id') = student_id);
