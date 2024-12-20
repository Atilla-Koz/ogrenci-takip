import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Aradığınız sayfa bulunamadı.
        </p>
        <Link
          href="/"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
} 