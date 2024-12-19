import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [studentId, setStudentId] = useState('')
  const [error, setError] = useState('')
  const [isStudentQuery, setIsStudentQuery] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { login, queryStudentLessons, studentView } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const success = login(email, password)
    if (!success) {
      setError(t('login.invalidCredentials'))
    }
  }

  const handleStudentQuery = (e) => {
    e.preventDefault()
    setError('')
    
    if (!studentId.trim()) {
      setError(t('login.studentIdRequired'))
      return
    }

    const success = queryStudentLessons(studentId)
    if (success) {
      setShowSuccessModal(true)
    } else {
      setError('Bu öğrenci numarasına ait ders bulunamadı.')
    }
  }

  const handleContinue = () => {
    setShowSuccessModal(false)
    // studentView zaten set edilmiş durumda, App otomatik olarak takvimi gösterecek
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setIsStudentQuery(false)
              setError('')
            }}
            className={`px-4 py-2 rounded-md ${
              !isStudentQuery 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {t('login.teacherLogin')}
          </button>
          <button
            onClick={() => {
              setIsStudentQuery(true)
              setError('')
            }}
            className={`px-4 py-2 rounded-md ${
              isStudentQuery 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {t('login.studentQuery')}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isStudentQuery ? t('login.queryTitle') : t('login.title')}
          </h2>

          {isStudentQuery ? (
            <form className="mt-8 space-y-6" onSubmit={handleStudentQuery}>
              <div>
                <label htmlFor="student-id" className="sr-only">
                  {t('login.studentId')}
                </label>
                <input
                  id="student-id"
                  name="studentId"
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder={t('login.studentId')}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/20 p-2 rounded">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {t('login.queryButton')}
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    {t('login.email')}
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                    placeholder={t('login.email')}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    {t('login.password')}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                    placeholder={t('login.password')}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {t('login.signIn')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Başarılı Sorgu Modalı */}
      {showSuccessModal && studentView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Ders Bilgileri Bulundu
            </h3>
            <div className="space-y-3 mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                Öğrenci No: {studentView.studentId}
              </p>
              <div className="max-h-48 overflow-y-auto">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ders Tarihleri:
                </p>
                <ul className="space-y-2">
                  {studentView.lessons.map((lesson, index) => (
                    <li 
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded"
                    >
                      {format(new Date(lesson.start), 'PPP - HH:mm', { locale: tr })}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleContinue}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
              >
                Takvimi Görüntüle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 