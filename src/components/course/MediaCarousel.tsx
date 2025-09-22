import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Image } from 'lucide-react'
import { MediaItem } from '../../data/mockData'

interface MediaCarouselProps {
  mediaItems: MediaItem[]
  className?: string
}

export function MediaCarousel({ mediaItems, className = '' }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">暂无媒体内容</p>
        </div>
      </div>
    )
  }

  const currentItem = mediaItems[currentIndex]
  const showControls = mediaItems.length > 1

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {currentItem.type === 'image' ? (
              <img
                src={currentItem.url}
                alt={currentItem.title || `媒体内容 ${currentIndex + 1}`}
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="relative">
                <video
                  src={currentItem.url}
                  poster={currentItem.thumbnail}
                  controls
                  className="w-full h-auto"
                  preload="metadata"
                >
                  您的浏览器不支持视频播放
                </video>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {showControls && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter */}
        {showControls && (
          <div className="absolute top-3 right-3">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 z-10 flex items-center justify-center">
              <span className="text-white text-xs leading-none">
                {currentIndex + 1} / {mediaItems.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dots indicator */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex gap-2">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
