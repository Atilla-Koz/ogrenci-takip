"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { Calendar as BigCalendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { tr, enUS } from 'date-fns/locale'
import { useLanguage } from '@/providers/LanguageProvider'
import LoadingSpinner from '@/components/LoadingSpinner'

interface CalendarProps {
  teacherId?: number
  studentId?: number
}

interface CalendarEvent extends Event {
  id: number
  title: string
  start: Date
  end: Date
  teacherId: number
  studentId: number
}

const locales = {
  tr,
  enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function Calendar({ teacherId, studentId }: CalendarProps) {
  const { data: session } = useSession()
  const { language } = useLanguage()
  const [lessons, setLessons] = React.useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true)
        const queryParam = teacherId 
          ? `teacherId=${teacherId}` 
          : studentId 
          ? `studentId=${studentId}`
          : `teacherId=${session?.user.id}`

        const res = await fetch(`/api/lessons?${queryParam}`)
        const data = await res.json()
        setLessons(data.data.map((lesson: any) => ({
          ...lesson,
          start: new Date(lesson.startDate),
          end: new Date(lesson.endDate)
        })))
      } catch (error) {
        console.error('Error fetching lessons:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user.id || teacherId || studentId) {
      fetchLessons()
    }
  }, [session?.user.id, teacherId, studentId])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="h-screen p-4">
      <BigCalendar
        localizer={localizer}
        events={lessons}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 100px)" }}
        culture={language}
      />
    </div>
  )
} 