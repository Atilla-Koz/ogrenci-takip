import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

function StudentList({ lessons, onEdit, onDelete }) {
  // Tekrarlanan dersleri grupla
  const uniqueLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.id]) {
      acc[lesson.id] = lesson
    }
    return acc
  }, {})

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Öğrenci
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Başlangıç Tarihi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ders Sıklığı
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ders Süresi
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.values(uniqueLessons).map((lesson) => (
            <tr key={lesson.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {lesson.firstName} {lesson.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {format(new Date(lesson.start), 'PPP', { locale: tr })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {lesson.isRecurring ? (
                    lesson.frequency === 'weekly' ? 'Haftalık' :
                    lesson.frequency === 'biweekly' ? 'İki Haftada Bir' :
                    'Aylık'
                  ) : 'Tek Seferlik'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {lesson.lessonDuration} Saat
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(lesson)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
                      onDelete(lesson.id)
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
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
  lessons: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default StudentList 