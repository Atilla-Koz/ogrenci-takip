import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

function StudentList({ lessons, onEdit, onDelete }) {
  // Dersleri öğrenci bazında grupla
  const groupedLessons = lessons.reduce((acc, lesson) => {
    const studentKey = `${lesson.firstName}-${lesson.lastName}`
    if (!acc[studentKey]) {
      acc[studentKey] = {
        ...lesson,
        // İlk dersin tarihini başlangıç tarihi olarak al
        firstLessonDate: lesson.start
      }
    }
    return acc
  }, {})

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Öğrenci No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              İlk Ders Tarihi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ders Sıklığı
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ders Süresi
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.values(groupedLessons).map((lesson) => (
            <tr key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {lesson.studentId}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(lesson.firstLessonDate), 'PPP', { locale: tr })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {lesson.isRecurring ? (
                    lesson.frequency === 'weekly' ? 'Haftalık' :
                    lesson.frequency === 'biweekly' ? 'İki Haftada Bir' :
                    'Aylık'
                  ) : 'Tek Seferlik'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {lesson.lessonDuration} Saat
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(lesson)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
                      onDelete(lesson.id)
                    }
                  }}
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

StudentList.propTypes = {
  lessons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      isRecurring: PropTypes.bool,
      frequency: PropTypes.string,
      lessonDuration: PropTypes.number.isRequired
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default StudentList 