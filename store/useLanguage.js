import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLanguage = create(
  persist(
    (set) => ({
      language: 'en',
      languageName: 'English',
      
      setLanguage: (lang, name) => set({ language: lang, languageName: name }),
      
      getLanguages: () => [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'hi', name: 'Hindi', native: 'हिंदी' },
        { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
        { code: 'te', name: 'Telugu', native: 'తెలుగు' },
        { code: 'bn', name: 'Bengali', native: 'বাংলা' },
        { code: 'mr', name: 'Marathi', native: 'मराठी' },
        { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
        { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
        { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
        { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
      ]
    }),
    {
      name: 'language-storage'
    }
  )
)
