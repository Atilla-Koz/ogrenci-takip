'use client'

import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/providers/LanguageProvider'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Geçerli bir email adresi giriniz')
    .required('Email adresi gerekli'),
  password: Yup.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre gerekli')
})

export default function LoginForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true)
        setError('')
        
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
          callbackUrl: '/'
        })

        if (result?.error) {
          setError(t('login.invalidCredentials'))
        } else if (result?.url) {
          router.push(result.url)
        }
      } catch (error) {
        setError('Bir hata oluştu')
        console.error('Login error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('login.title')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('login.email')}
            </label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formik.errors.password}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || formik.isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isLoading ? 'Giriş yapılıyor...' : t('login.signIn')}
          </button>
        </form>
      </div>
    </div>
  )
} 