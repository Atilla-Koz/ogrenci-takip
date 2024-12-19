import { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, addDays, addWeeks, addMonths } from 'date-fns'
import { tr, enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import StudentForm from './components/StudentForm'
import StudentList from './components/StudentList'
import LanguageSwitch from './components/LanguageSwitch'
import { useLanguage } from './contexts/LanguageContext'
import Header from './components/Header'
import { useAuth } from './contexts/AuthContext'
import LoginForm from './components/LoginForm'
import AdminPanel from './components/AdminPanel'
import PropTypes from 'prop-types'

const messages = {
  tr: {
    date: 'Tarih',
    time: 'Saat',
    event: 'Etkinlik',
    allDay: 'Tüm Gün',
    week: 'Hafta',
    work_week: 'İş Haftası',
    day: 'Gün',
    month: 'Ay',
    previous: 'Önceki',
    next: 'Sonraki',
    yesterday: 'Dün',
    tomorrow: 'Yarın',
    today: 'Bugün',
    agenda: 'Ajanda',
    noEventsInRange: 'Bu aralıkta ders bulunmuyor.',
    showMore: total => `+${total} ders daha`
  },
  en: {
    date: 'Date',
    time: 'Time',
    event: 'Event',
    allDay: 'All Day',
    week: 'Week',
    work_week: 'Work Week',
    day: 'Day',
    month: 'Month',
    previous: 'Previous',
    next: 'Next',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    today: 'Today',
    agenda: 'Agenda',
    noEventsInRange: 'There are no lessons in this range.',
    showMore: total => `+${total} more`
  }
}

const locales = {
  'tr': tr,
  'en': enUS
}

function App({ teacherMode = false, teacherId = null }) {
  const { t, language } = useLanguage()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { currentUser, isAdmin, studentView, lessons, setLessons } = useAuth()
  const [currentView, setCurrentView] = useState('calendar')
  const [editingLesson, setEditingLesson] = useState(null)

  useEffect(() => {
    localStorage.setItem('lessons', JSON.stringify(lessons))
  }, [lessons])

  const generateRecurringLessons = (lessonData) => {
    const lessons = []
    const startDate = new Date(lessonData.startDate)
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 6) // 6 aylık tekrar
    let currentDate = startDate

    while (currentDate <= endDate) {
      const lessonEnd = new Date(currentDate)
      lessonEnd.setHours(currentDate.getHours() + 1) // Her ders 1 saat

      lessons.push({
        id: Date.now() + lessons.length,
        teacherId: lessonData.teacherId,
        title: `${lessonData.firstName} ${lessonData.lastName}`,
        start: new Date(currentDate),
        end: lessonEnd
      })

      switch (lessonData.frequency) {
        case 'weekly':
          currentDate = addWeeks(currentDate, 1)
          break
        case 'biweekly':
          currentDate = addWeeks(currentDate, 2)
          break
        case 'monthly':
          currentDate = addMonths(currentDate, 1)
          break
        default:
          currentDate = addDays(currentDate, 7)
      }
    }

    return lessons
  }

  const handleAddLesson = (lessonData) => {
    const currentTeacherId = teacherId || currentUser.id
    const startDate = new Date(lessonData.startDate)
    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + 1)

    const newLesson = {
      id: Date.now(),
      teacherId: currentTeacherId,
      studentId: lessonData.studentId ? Number(lessonData.studentId) : null,
      ...lessonData,
      title: `${lessonData.firstName} ${lessonData.lastName}`,
      start: startDate,
      end: endDate,
      lessonDuration: 1
    }

    if (lessonData.isRecurring) {
      const recurringLessons = generateRecurringLessons({
        ...newLesson,
        teacherId: currentTeacherId
      })
      setLessons([...lessons, ...recurringLessons.map(lesson => ({
        ...lesson,
        teacherId: currentTeacherId,
        studentId: lessonData.studentId ? Number(lessonData.studentId) : null,
        firstName: lessonData.firstName,
        lastName: lessonData.lastName,
        isRecurring: true,
        frequency: lessonData.frequency
      }))])
    } else {
      setLessons([...lessons, newLesson])
    }
    setIsFormOpen(false)
  }

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson)
    setIsFormOpen(true)
  }

  const handleDeleteLesson = (lessonId) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId))
  }

  const handleUpdateLesson = (updatedData) => {
    setLessons(lessons.map(lesson => 
      lesson.id === editingLesson.id ? { ...lesson, ...updatedData } : lesson
    ))
    setEditingLesson(null)
    setIsFormOpen(false)
  }

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { [language]: locales[language] }
  })

  // Event başlığını özelleştirme
  const formats = {
    eventTimeRangeFormat: () => '', // Saat aralığını gizle
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, 'HH:mm', culture),
  }

  // Admin paneli gösterimi
  if (currentUser && isAdmin && !teacherMode) {
    return <AdminPanel />
  }

  // Normal takvim gösterimi
  if (!currentUser) {
    return <LoginForm />
  }

  // Dersleri filtreleme (admin için öğretmen bazlı)
  const filteredLessons = (teacherMode 
    ? lessons.filter(lesson => lesson.teacherId === teacherId)
    : lessons.filter(lesson => lesson.teacherId === currentUser.id)
  ).map(lesson => ({
    ...lesson,
    start: new Date(lesson.start), // String tarihleri Date objesine çeviriyoruz
    end: new Date(lesson.end)
  }))

  // Öğrenci görünümü için
  if (studentView) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {`Öğrenci No: ${studentView.studentId}`}
              </h2>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Çıkış
              </button>
            </div>
            <Calendar
              localizer={localizer}
              events={studentView.lessons}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 'calc(100vh - 200px)' }}
              culture={language}
              messages={messages[language]}
              views={['month', 'week', 'day']}
              defaultView="month"
              min={new Date(2024, 0, 1, 7, 0, 0)}
              max={new Date(2024, 0, 1, 23, 0, 0)}
              formats={formats}
              components={{
                event: (props) => (
                  <div className="text-white text-sm p-1 truncate">
                    Ders
                  </div>
                )
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {!teacherMode && <Header />}
      <main className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => setCurrentView('calendar')}
                className={`px-4 py-2 rounded-md ${
                  currentView === 'calendar' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                {t('calendar.tabs.calendar')}
              </button>
              <button
                onClick={() => setCurrentView('students')}
                className={`px-4 py-2 rounded-md ${
                  currentView === 'students' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                {t('calendar.tabs.students')}
              </button>
              <button
                onClick={() => {
                  setEditingLesson(null)
                  setIsFormOpen(true)
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {t('calendar.tabs.newStudent')}
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            {currentView === 'calendar' ? (
              <Calendar
                localizer={localizer}
                events={filteredLessons}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 200px)' }}
                culture={language}
                messages={messages[language]}
                views={['month', 'week', 'day', 'agenda']}
                defaultView="month"
                min={new Date(2024, 0, 1, 7, 0, 0)}
                max={new Date(2024, 0, 1, 23, 0, 0)}
                step={60}
                timeslots={1}
                formats={formats}
                components={{
                  event: (props) => (
                    <div className="text-white text-sm p-1 truncate">
                      {`${props.event.firstName} ${props.event.lastName}`}
                    </div>
                  )
                }}
              />
            ) : (
              <StudentList 
                lessons={filteredLessons}
                onEdit={handleEditLesson}
                onDelete={handleDeleteLesson}
              />
            )}
          </div>

          <StudentForm 
            isOpen={isFormOpen} 
            onClose={() => {
              setIsFormOpen(false)
              setEditingLesson(null)
            }}
            onSubmit={editingLesson ? handleUpdateLesson : handleAddLesson}
            initialValues={editingLesson}
          />
        </div>
      </main>
    </div>
  )
}

App.propTypes = {
  teacherMode: PropTypes.bool,
  teacherId: PropTypes.number
}

export default App