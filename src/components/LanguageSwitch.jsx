import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
      className="flex items-center space-x-1 px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
    >
      <span className="text-sm font-medium">
        {language.toUpperCase()}
      </span>
    </button>
  )
} 