'use client'

import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useLanguage } from '@/providers/LanguageProvider'

interface StudentFormProps {
  onSubmit: (values: StudentFormValues) => Promise<void>
  initialValues?: StudentFormValues
}

interface StudentFormValues {
  firstName: string
  lastName: string
  studentId: string
  startDate: string
  endDate: string
  isRecurring: boolean
  frequency?: string
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('İsim gerekli'),
  lastName: Yup.string().required('Soyisim gerekli'),
  studentId: Yup.string().required('Öğrenci no gerekli'),
  startDate: Yup.date().required('Başlangıç tarihi gerekli'),
  endDate: Yup.date().required('Bitiş tarihi gerekli'),
  isRecurring: Yup.boolean(),
  frequency: Yup.string().when('isRecurring', {
    is: true,
    then: (schema) => schema.required('Tekrar sıklığı gerekli')
  })
})

export default function StudentForm({ onSubmit, initialValues }: StudentFormProps) {
  const { t } = useLanguage()
  const [error, setError] = React.useState('')

  const formik = useFormik({
    initialValues: initialValues || {
      firstName: '',
      lastName: '',
      studentId: '',
      startDate: '',
      endDate: '',
      isRecurring: false,
      frequency: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Bir hata oluştu')
      }
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('studentForm.fields.firstName')}
        </label>
        <input
          id="firstName"
          type="text"
          {...formik.getFieldProps('firstName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formik.errors.firstName}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('studentForm.fields.lastName')}
        </label>
        <input
          id="lastName"
          type="text"
          {...formik.getFieldProps('lastName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formik.errors.lastName}</p>
        )}
      </div>

      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('studentForm.fields.studentId')}
        </label>
        <input
          id="studentId"
          type="text"
          {...formik.getFieldProps('studentId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {formik.touched.studentId && formik.errors.studentId && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formik.errors.studentId}</p>
        )}
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('studentForm.fields.startDate')}
        </label>
        <input
          id="startDate"
          type="datetime-local"
          {...formik.getFieldProps('startDate')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {formik.touched.startDate && formik.errors.startDate && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formik.errors.startDate}</p>
        )}
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('studentForm.fields.endDate')}
        </label>
        <input
          id="endDate"
          type="datetime-local"
          {...formik.getFieldProps('endDate')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {formik.touched.endDate && formik.errors.endDate && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formik.errors.endDate}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isRecurring"
          type="checkbox"
          {...formik.getFieldProps('isRecurring')}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          {t('studentForm.fields.recurring')}
        </label>
      </div>

      {formik.values.isRecurring && (
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('studentForm.fields.frequency')}
          </label>
          <select
            id="frequency"
            {...formik.getFieldProps('frequency')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{t('studentForm.frequency.select')}</option>
            <option value="weekly">{t('studentForm.frequency.weekly')}</option>
            <option value="biweekly">{t('studentForm.frequency.biweekly')}</option>
            <option value="monthly">{t('studentForm.frequency.monthly')}</option>
          </select>
          {formik.touched.frequency && formik.errors.frequency && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formik.errors.frequency}</p>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          {t('studentForm.buttons.save')}
        </button>
      </div>
    </form>
  )
} 