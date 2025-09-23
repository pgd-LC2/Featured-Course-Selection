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

-- Add media fields to courses table
alter table public.courses add column if not exists cover_image text;
alter table public.courses add column if not exists video_preview text;
alter table public.courses add column if not exists media_content jsonb default '[]'::jsonb;
alter table public.courses add column if not exists rating numeric(3,2) default 4.5;
alter table public.courses add column if not exists review_count integer default 0;
alter table public.courses add column if not exists tags text[] default '{}';
alter table public.courses add column if not exists description text;

-- Update courses table to link with instructors properly
alter table public.courses add column if not exists instructor_id text references public.instructors(id);

-- Update existing course to use instructor_id instead of teacher string
update public.courses set instructor_id = 'instructor-1' where id = 'course-1';
update public.courses set instructor_id = 'instructor-2' where id = 'course-2';
update public.courses set instructor_id = 'instructor-3' where id = 'course-3';
update public.courses set instructor_id = 'instructor-1' where id = 'course-4';
update public.courses set instructor_id = 'instructor-1' where id = 'course-5';

update public.courses set 
  cover_image = 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
  video_preview = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  media_content = '[
    {"id":"1","type":"image","url":"https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600","title":"课堂环境"},
    {"id":"1-2","type":"image","url":"https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=600","title":"学习环境"},
    {"id":"1-3","type":"video","url":"https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4","thumbnail":"https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=600","title":"课程预览视频"}
  ]'::jsonb,
  rating = 4.8,
  review_count = 156,
  tags = ARRAY['名师授课', '小班教学', '考试重点'],
  description = '针对高中数学重难点进行系统性讲解，提升解题能力和数学思维。课程涵盖函数、几何、概率统计等核心知识点。'
where id = 'course-1';

insert into public.courses (id, title, teacher, category, grade, price, material_fee, capacity, enrolled, cover_image, media_content, rating, review_count, tags, description)
values 
  ('course-2', '英语口语实战营', 'instructor-2', '英语', '初中', 0, 30, 15, 12, 
   'https://images.pexels.com/photos/5427673/pexels-photo-5427673.jpeg?auto=compress&cs=tinysrgb&w=600',
   '[{"id":"2-1","type":"image","url":"https://images.pexels.com/photos/5427673/pexels-photo-5427673.jpeg?auto=compress&cs=tinysrgb&w=600","title":"英语口语课堂"}]'::jsonb,
   4.9, 203, ARRAY['外教授课', '实战对话', '小班制'], '全英文沉浸式教学环境，通过情景对话、角色扮演等方式快速提升英语口语表达能力。'),
  ('course-3', 'Python编程启蒙', 'instructor-3', '编程', '小学', 0, 80, 12, 8,
   'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
   '[{"id":"3-1","type":"image","url":"https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600","title":"编程学习环境"}]'::jsonb,
   4.7, 89, ARRAY['零基础', '趣味学习', '项目实战'], '零基础Python编程入门课程，通过趣味项目学习编程思维，为孩子打开科技世界的大门。'),
  ('course-4', '物理实验探索班', 'instructor-1', '物理', '初中', 0, 0, 16, 10,
   'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=600',
   '[{"id":"4-1","type":"image","url":"https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=600","title":"物理实验室"}]'::jsonb,
   4.6, 127, ARRAY['实验教学', '科学启蒙', '动手实践'], '通过有趣的物理实验，让学生深入理解物理概念，培养科学思维和动手能力。'),
  ('course-5', '免费体验课：数学思维启蒙', 'instructor-1', '数学', '小学', 0, 0, 25, 20,
   'https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg?auto=compress&cs=tinysrgb&w=600',
   '[{"id":"5-1","type":"image","url":"https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg?auto=compress&cs=tinysrgb&w=600","title":"数学游戏课堂"}]'::jsonb,
   4.9, 245, ARRAY['免费体验', '思维启蒙', '数学游戏'], '免费体验课程，通过有趣的数学游戏和思维训练，激发孩子对数学的兴趣，培养逻辑思维能力。')
on conflict (id) do nothing;

insert into public.time_slots (id, course_id, day_of_week, start_time, end_time, available)
values
  ('slot-3', 'course-2', 3, '19:00', '20:30', true),
  ('slot-4', 'course-2', 5, '19:00', '20:30', true),
  ('slot-5', 'course-3', 2, '16:00', '17:30', true),
  ('slot-6', 'course-3', 4, '16:00', '17:30', true),
  ('slot-7', 'course-4', 6, '14:00', '16:00', true),
  ('slot-8', 'course-5', 7, '10:00', '11:30', true)
on conflict (id) do nothing;
