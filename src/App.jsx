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
  const [lessons, setLessons] = useState(() => {
    const savedLessons = localStorage.getItem('lessons')
    return savedLessons ? JSON.parse(savedLessons) : []
  })
  const [currentView, setCurrentView] = useState('calendar') // 'calendar' veya 'students'
  const [editingLesson, setEditingLesson] = useState(null)
  const { currentUser, isAdmin } = useAuth()

  useEffect(() => {
    localStorage.setItem('lessons', JSON.stringify(lessons))
  }, [lessons])

  const generateRecurringLessons = (lessonData) => {
    const lessons = []
    const startDate = new Date(lessonData.startDate)
    const endDate = lessonData.hasNoEndDate 
      ? new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()) // Varsayılan olarak 1 yıl
      : new Date(lessonData.endDate)
    let currentDate = startDate

    while (currentDate <= endDate) {
      const lessonEnd = new Date(currentDate)
      lessonEnd.setHours(lessonEnd.getHours() + lessonData.lessonDuration)

      lessons.push({
        id: Date.now() + lessons.length, // Benzersiz ID oluştur
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
    const currentTeacherId = teacherId || currentUser.id // Öğretmen ID'sini al

    const newLesson = {
      id: Date.now(),
      teacherId: currentTeacherId, // Öğretmen ID'sini ekle
      ...lessonData,
      title: `${lessonData.firstName} ${lessonData.lastName}`,
    }

    if (lessonData.isRecurring) {
      const recurringLessons = generateRecurringLessons({
        ...newLesson,
        teacherId: currentTeacherId
      })
      setLessons([...lessons, ...recurringLessons.map(lesson => ({
        ...lesson,
        teacherId: currentTeacherId,
        firstName: lessonData.firstName,
        lastName: lessonData.lastName,
        isRecurring: true,
        frequency: lessonData.frequency,
        lessonDuration: lessonData.lessonDuration
      }))])
    } else {
      const lessonEnd = new Date(lessonData.startDate)
      lessonEnd.setHours(lessonEnd.getHours() + lessonData.lessonDuration)

      setLessons([...lessons, {
        ...newLesson,
        start: new Date(lessonData.startDate),
        end: lessonEnd,
      }])
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

  // Admin paneli gösterimi
  if (currentUser && isAdmin && !teacherMode) {
    return <AdminPanel />
  }

  // Normal takvim gösterimi
  if (!currentUser) {
    return <LoginForm />
  }

  // Dersleri filtreleme (admin için öğretmen bazlı)
  const filteredLessons = teacherMode 
    ? lessons.filter(lesson => lesson.teacherId === teacherId)
    : lessons.filter(lesson => lesson.teacherId === currentUser.id)

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