import React from 'react'
import { Star, Award } from 'lucide-react'
import { Teacher } from '../../data/mockData'
import { Badge } from '../ui/Badge'

interface TeacherInfoProps {
  teacher: Teacher
}

export function TeacherInfo({ teacher }: TeacherInfoProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-4 mb-3">
        <img
          src={teacher.avatar}
          alt={teacher.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{teacher.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{teacher.rating}</span>
            </div>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{teacher.bio}</p>
      
      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">擅长领域：</div>
        <div className="flex flex-wrap gap-2">
          {teacher.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}