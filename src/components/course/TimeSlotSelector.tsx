import { motion } from 'framer-motion'
import { Clock, CheckCircle } from 'lucide-react'
interface TimeSlot {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  available: boolean
}

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[]
  selectedSlot?: TimeSlot
  onSelect: (slot: TimeSlot) => void
}

export function TimeSlotSelector({ timeSlots, selectedSlot, onSelect }: TimeSlotSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        选择上课时间
      </h3>
      
      <div className="grid gap-3">
        {timeSlots.map((slot) => (
          <motion.button
            key={slot.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(slot)}
            disabled={!slot.available}
            className={`p-4 rounded-xl border-2 text-left transition-colors ${
              selectedSlot?.id === slot.id
                ? 'border-blue-600 bg-blue-50'
                : slot.available
                ? 'border-gray-200 hover:border-gray-300 bg-white'
                : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  {slot.dayOfWeek}
                </div>
                <div className="text-sm text-gray-500">
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>
              
              {selectedSlot?.id === slot.id && (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              )}
              
              {!slot.available && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  已满
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
