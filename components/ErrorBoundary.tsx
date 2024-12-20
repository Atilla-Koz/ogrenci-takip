'use client'

import React from 'react'
import { useLanguage } from '@/providers/LanguageProvider'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const { t } = useLanguage()
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error)
      setHasError(true)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('error.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t('error.message')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
          >
            {t('error.retry')}
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 