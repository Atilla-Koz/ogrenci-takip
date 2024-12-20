'use client'

import React from 'react'
import Calendar from '@/components/Calendar'
import { useLanguage } from '@/providers/LanguageProvider'

interface TeacherCalendarProps {
  teacher: {
    id: number
    name: string
    email: string
  }
}

export default function TeacherCalendar({ teacher }: TeacherCalendarProps) {
  const { t } = useLanguage()

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-purple-100 dark:border-purple-900">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
          {t('admin.teacherCalendar', { name: teacher.name })}
        </h2>
      </div>
      <Calendar teacherId={teacher.id} />
    </div>
  )
} 