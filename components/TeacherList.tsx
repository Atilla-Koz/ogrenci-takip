'use client'

import React from 'react'
import { useLanguage } from '@/providers/LanguageProvider'
import Calendar from '@/components/Calendar'

interface Teacher {
  id: number
  name: string
  email: string
}

export default function TeacherList() {
  const { t } = useLanguage()
  const [teachers, setTeachers] = React.useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch('/api/teachers')
        const data = await res.json()
        setTeachers(data.data)
      } catch (error) {
        console.error('Error fetching teachers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeachers()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (selectedTeacher) {
    return (
      <div>
        <button
          onClick={() => setSelectedTeacher(null)}
          className="mb-4 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
        >
          {t('admin.backToList')}
        </button>
        <Calendar teacherId={selectedTeacher.id} />
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teachers.map((teacher) => (
        <div
          key={teacher.id}
          onClick={() => setSelectedTeacher(teacher)}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {teacher.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {teacher.email}
          </p>
        </div>
      ))}
    </div>
  )
} 