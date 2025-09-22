export interface Course {
  id: string
  title: string
  teacher: Teacher
  timeSlots: TimeSlot[]
  materialFee: number
  category: string
  grade: string
  description: string
  coverImage: string
  mediaContent: MediaItem[]
  videoPreview?: string
  rating: number
  reviewCount: number
  tags: string[]
  capacity: number
  enrolled: number
}

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title?: string
}
export interface Teacher {
  id: string
  name: string
  avatar: string
  bio: string
  specialties: string[]
  rating: number
}

export interface TimeSlot {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  available: boolean
}

export interface CartItem {
  courseId: string
  course: Course
  selectedTimeSlot: TimeSlot
  selectedDate: string
}

export const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: '张老师',
    avatar: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: '资深数学教师，拥有10年教学经验，擅长启发式教学',
    specialties: ['高中数学', '竞赛辅导', '解题技巧'],
    rating: 4.8
  },
  {
    id: '2', 
    name: '李老师',
    avatar: 'https://images.pexels.com/photos/8200019/pexels-photo-8200019.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: '英语专业八级，海外留学经历，注重实用口语训练',
    specialties: ['英语口语', '雅思托福', '商务英语'],
    rating: 4.9
  },
  {
    id: '3',
    name: '王老师', 
    avatar: 'https://images.pexels.com/photos/8199185/pexels-photo-8199185.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: '编程教育专家，专注青少年编程启蒙教育',
    specialties: ['Python编程', 'Scratch', '算法思维'],
    rating: 4.7
  }
]

export const mockCourses: Course[] = [
  {
    id: '1',
    title: '高中数学提升班',
    teacher: mockTeachers[0],
    timeSlots: [
      { id: '1', dayOfWeek: '周六', startTime: '09:00', endTime: '11:00', available: true },
      { id: '2', dayOfWeek: '周日', startTime: '14:00', endTime: '16:00', available: true }
    ],
    materialFee: 50,
    category: '数学',
    grade: '高中',
    description: '针对高中数学重难点进行系统性讲解，提升解题能力和数学思维。课程涵盖函数、几何、概率统计等核心知识点。',
    coverImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
    mediaContent: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '课堂环境'
      },
      {
        id: '1-2',
        type: 'image',
        url: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '学习环境'
      },
      {
        id: '1-3',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnail: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '课程预览视频'
      }
    ],
    rating: 4.8,
    reviewCount: 156,
    tags: ['名师授课', '小班教学', '考试重点'],
    capacity: 20,
    enrolled: 15
  },
  {
    id: '2',
    title: '英语口语实战营',
    teacher: mockTeachers[1],
    timeSlots: [
      { id: '3', dayOfWeek: '周三', startTime: '19:00', endTime: '20:30', available: true },
      { id: '4', dayOfWeek: '周五', startTime: '19:00', endTime: '20:30', available: true }
    ],
    materialFee: 30,
    category: '英语',
    grade: '初中',
    description: '全英文沉浸式教学环境，通过情景对话、角色扮演等方式快速提升英语口语表达能力。',
    coverImage: 'https://images.pexels.com/photos/5427673/pexels-photo-5427673.jpeg?auto=compress&cs=tinysrgb&w=600',
    mediaContent: [
      {
        id: '2-1',
        type: 'image',
        url: 'https://images.pexels.com/photos/5427673/pexels-photo-5427673.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '英语口语课堂'
      },
      {
        id: '2-2',
        type: 'image',
        url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '小组讨论'
      },
      {
        id: '2-3',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
        thumbnail: 'https://images.pexels.com/photos/8200019/pexels-photo-8200019.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '口语练习演示'
      }
    ],
    rating: 4.9,
    reviewCount: 203,
    tags: ['外教授课', '实战对话', '小班制'],
    capacity: 15,
    enrolled: 12
  },
  {
    id: '3',
    title: 'Python编程启蒙',
    teacher: mockTeachers[2],
    timeSlots: [
      { id: '5', dayOfWeek: '周二', startTime: '16:00', endTime: '17:30', available: true },
      { id: '6', dayOfWeek: '周四', startTime: '16:00', endTime: '17:30', available: true }
    ],
    materialFee: 80,
    category: '编程',
    grade: '小学',
    description: '零基础Python编程入门课程，通过趣味项目学习编程思维，为孩子打开科技世界的大门。',
    coverImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
    mediaContent: [
      {
        id: '3-1',
        type: 'image',
        url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '编程学习环境'
      },
      {
        id: '3-2',
        type: 'image',
        url: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '编程实践'
      },
      {
        id: '3-3',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
        thumbnail: 'https://images.pexels.com/photos/8199185/pexels-photo-8199185.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '编程教学演示'
      }
    ],
    rating: 4.7,
    reviewCount: 89,
    tags: ['零基础', '趣味学习', '项目实战'],
    capacity: 12,
    enrolled: 8
  },
  {
    id: '4',
    title: '物理实验探索班',
    teacher: mockTeachers[0],
    timeSlots: [
      { id: '7', dayOfWeek: '周六', startTime: '14:00', endTime: '16:00', available: true }
    ],
    materialFee: 0,
    category: '物理',
    grade: '初中',
    description: '通过有趣的物理实验，让学生深入理解物理概念，培养科学思维和动手能力。',
    coverImage: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=600',
    mediaContent: [
      {
        id: '4-1',
        type: 'image',
        url: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '物理实验室'
      },
      {
        id: '4-2',
        type: 'image',
        url: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '实验器材'
      },
      {
        id: '4-3',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4',
        thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '物理实验演示'
      }
    ],
    rating: 4.6,
    reviewCount: 127,
    tags: ['实验教学', '科学启蒙', '动手实践'],
    capacity: 16,
    enrolled: 10
  },
  {
    id: '5',
    title: '免费体验课：数学思维启蒙',
    teacher: mockTeachers[0],
    timeSlots: [
      { id: '8', dayOfWeek: '周日', startTime: '10:00', endTime: '11:30', available: true }
    ],
    materialFee: 0,
    category: '数学',
    grade: '小学',
    description: '免费体验课程，通过有趣的数学游戏和思维训练，激发孩子对数学的兴趣，培养逻辑思维能力。',
    coverImage: 'https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg?auto=compress&cs=tinysrgb&w=600',
    mediaContent: [
      {
        id: '5-1',
        type: 'image',
        url: 'https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '数学游戏课堂'
      },
      {
        id: '5-2',
        type: 'image',
        url: 'https://images.pexels.com/photos/1181681/pexels-photo-1181681.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '思维训练'
      },
      {
        id: '5-3',
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_480x360_1mb.mp4',
        thumbnail: 'https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg?auto=compress&cs=tinysrgb&w=600',
        title: '数学思维游戏'
      }
    ],
    rating: 4.9,
    reviewCount: 245,
    tags: ['免费体验', '思维启蒙', '数学游戏'],
    capacity: 25,
    enrolled: 20
  }
]

export const categories = ['全部', '数学', '英语', '编程', '物理', '化学', '语文']
export const grades = ['全部', '小学', '初中', '高中']
export const courseTypes = ['全部', '基础班', '提升班', '竞赛班', '兴趣班']