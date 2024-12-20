'use client'

import React from 'react'
import { useLanguage } from '@/providers/LanguageProvider'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Student {
  id: number
  studentId: string
  firstName: string
  lastName: string
  lessons: Array<{
    startDate: string
    endDate: string
    isRecurring: boolean
    frequency?: string
  }>
}

export default function StudentList() {
  const { t } = useLanguage()
  const [students, setStudents] = React.useState<Student[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students')
        const data = await res.json()
        setStudents(data.data)
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('studentForm.fields.studentId')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('studentForm.fields.firstName')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('studentForm.fields.lastName')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('studentForm.fields.startDate')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('studentForm.fields.frequency')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {student.studentId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {student.firstName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {student.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {student.lessons[0] && format(new Date(student.lessons[0].startDate), 'PPp', { locale: tr })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {student.lessons[0]?.isRecurring 
                  ? t(`studentForm.frequency.${student.lessons[0].frequency}`) 
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 