'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/providers/LanguageProvider'
import TeacherList from '@/components/TeacherList'

export default function AdminPanel() {
  const { data: session } = useSession()
  const { t } = useLanguage()

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TeacherList />
      </div>
    </div>
  )
} 