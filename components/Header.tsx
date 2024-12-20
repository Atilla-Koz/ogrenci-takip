'use client'

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useLanguage } from '@/providers/LanguageProvider'
import LanguageSwitch from '@/components/LanguageSwitch'
import ThemeSwitch from '@/components/ThemeSwitch'

export default function Header() {
  const { data: session } = useSession()
  const { t } = useLanguage()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('calendar.title')}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <span className="text-gray-700 dark:text-gray-300">
                {session.user.name}
              </span>
            )}
            <LanguageSwitch />
            <ThemeSwitch />
            {session?.user && (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                {t('header.logout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 