import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import tr from '../locales/tr'
import en from '../locales/en'

const LanguageContext = createContext()

const languages = {
  tr,
  en
}

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('tr')

  const value = {
    language: currentLanguage,
    setLanguage: setCurrentLanguage,
    t: (key) => {
      const keys = key.split('.')
      let value = languages[currentLanguage]
      
      for (const k of keys) {
        value = value[k]
      }
      
      return value
    }
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useLanguage = () => useContext(LanguageContext) 