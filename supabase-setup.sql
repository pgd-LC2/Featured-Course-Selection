create table if not exists public.instructors (
  id text primary key,
  name text not null,
  avatar text not null,
  bio text not null,
  specialties text[] not null,
  rating numeric(3,2) not null check (rating >= 0 and rating <= 5),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.instructors enable row level security;

drop policy if exists "instructors_read_public" on public.instructors;
create policy "instructors_read_public"
on public.instructors for select
to anon, authenticated
using (true);

insert into public.instructors (id, name, avatar, bio, specialties, rating)
values 
  ('instructor-1', '王老师', '/avatars/teacher1.jpg', '数学教育专家，拥有15年教学经验，擅长启发式教学方法，帮助学生建立数学思维。', ARRAY['数学思维', '逻辑推理', '问题解决'], 4.8),
  ('instructor-2', '李老师', '/avatars/teacher2.jpg', '英语教育硕士，专注于口语和听力训练，曾在国外工作5年，具有丰富的跨文化交流经验。', ARRAY['英语口语', '听力训练', '跨文化交流'], 4.9),
  ('instructor-3', '张老师', '/avatars/teacher3.jpg', '科学教育博士，热爱实验教学，善于将复杂的科学概念通过有趣的实验展示给学生。', ARRAY['实验教学', '科学探索', '创新思维'], 4.7),
  ('instructor-4', '陈老师', '/avatars/teacher4.jpg', '艺术教育专家，毕业于中央美术学院，擅长培养学生的创造力和审美能力。', ARRAY['创意绘画', '色彩理论', '艺术鉴赏'], 4.6),
  ('instructor-5', '刘老师', '/avatars/teacher5.jpg', '体育教育学士，前专业运动员，专注于青少年体能训练和运动技能发展。', ARRAY['体能训练', '运动技能', '团队合作'], 4.5)
on conflict (id) do nothing;

update public.courses 
set teacher = 'instructor-1' 
where id = 'course-1' and teacher = '王老师';
