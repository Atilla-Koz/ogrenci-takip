import PropTypes from 'prop-types'
import { useLanguage } from '../contexts/LanguageContext'
import App from '../App'

export default function TeacherCalendar({ teacher }) {
  const { t } = useLanguage()

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-purple-100 dark:border-purple-900">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
          {t('admin.teacherCalendar', { name: teacher.name })}
        </h2>
      </div>
      <App teacherMode={true} teacherId={teacher.id} />
    </div>
  )
}

TeacherCalendar.propTypes = {
  teacher: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
} 