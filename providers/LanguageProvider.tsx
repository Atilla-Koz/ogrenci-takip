'use client'

import React from 'react'
import { createContext, useContext, useState } from 'react'
import tr from '@/locales/tr'
import en from '@/locales/en'

type Languages = {
  tr: typeof tr
  en: typeof en
}

const languages: Languages = { tr, en }

type LanguageContextType = {
  language: keyof Languages
  setLanguage: (lang: keyof Languages) => void
  t: (key: string, params?: Record<string, any>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<keyof Languages>('tr')

  const value = {
    language: currentLanguage,
    setLanguage: setCurrentLanguage,
    t: (key: string, params?: Record<string, any>) => {
      const keys = key.split('.')
      let value: any = languages[currentLanguage]
      
      for (const k of keys) {
        if (value === undefined) return key
        if (typeof value === 'function') return value(params)
        value = value[k]
      }
      
      if (typeof value === 'function') return value(params)
      if (typeof value === 'string') return value
      return key
    }
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 