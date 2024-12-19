import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useLanguage } from '../contexts/LanguageContext'

function StudentForm({ isOpen, onClose, onSubmit, initialValues }) {
  const { t } = useLanguage()

  const validationSchema = Yup.object({
    firstName: Yup.string().required(t('studentForm.validation.required.firstName')),
    lastName: Yup.string().required(t('studentForm.validation.required.lastName')),
    startDate: Yup.date().required(t('studentForm.validation.required.startDate')),
    endDate: Yup.date().when('hasNoEndDate', {
      is: false,
      then: () => Yup.date()
        .required(t('studentForm.validation.required.endDate'))
        .min(Yup.ref('startDate'), t('studentForm.validation.endDateAfterStart')),
      otherwise: () => Yup.date().nullable()
    }),
    hasNoEndDate: Yup.boolean(),
    isRecurring: Yup.boolean(),
    frequency: Yup.string().when('isRecurring', {
      is: true,
      then: () => Yup.string().required(t('studentForm.validation.required.frequency'))
    }),
    lessonDuration: Yup.number()
      .required(t('studentForm.validation.required.lessonDuration'))
      .min(1, t('studentForm.validation.minDuration'))
  })

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {t('studentForm.title')}
                </Dialog.Title>

                <Formik
                  initialValues={initialValues || {
                    firstName: '',
                    lastName: '',
                    startDate: '',
                    endDate: '',
                    hasNoEndDate: false,
                    isRecurring: false,
                    frequency: 'weekly',
                    lessonDuration: 1
                  }}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  enableReinitialize
                >
                  {({ errors, touched, values }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          {t('studentForm.fields.firstName')}
                        </label>
                        <Field
                          name="firstName"
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.firstName && touched.firstName && (
                          <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          {t('studentForm.fields.lastName')}
                        </label>
                        <Field
                          name="lastName"
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.lastName && touched.lastName && (
                          <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                          Başlangıç Tarihi
                        </label>
                        <Field
                          name="startDate"
                          type="datetime-local"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.startDate && touched.startDate && (
                          <div className="text-red-500 text-sm mt-1">{errors.startDate}</div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2 mb-2">
                          <Field
                            type="checkbox"
                            name="hasNoEndDate"
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm font-medium text-gray-700">Süresiz Ders</span>
                        </label>

                        {!values.hasNoEndDate && (
                          <>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                              Bitiş Tarihi
                            </label>
                            <Field
                              name="endDate"
                              type="datetime-local"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.endDate && touched.endDate && (
                              <div className="text-red-500 text-sm mt-1">{errors.endDate}</div>
                            )}
                          </>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <Field
                            type="checkbox"
                            name="isRecurring"
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm font-medium text-gray-700">Tekrarlanan Ders</span>
                        </label>
                      </div>

                      {values.isRecurring && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tekrar Sıklığı
                          </label>
                          <Field
                            as="select"
                            name="frequency"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="weekly">Haftalık</option>
                            <option value="biweekly">İki Haftada Bir</option>
                            <option value="monthly">Aylık</option>
                          </Field>
                          {errors.frequency && touched.frequency && (
                            <div className="text-red-500 text-sm mt-1">{errors.frequency}</div>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ders Süresi (Saat)
                        </label>
                        <Field
                          type="number"
                          name="lessonDuration"
                          min="1"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.lessonDuration && touched.lessonDuration && (
                          <div className="text-red-500 text-sm mt-1">{errors.lessonDuration}</div>
                        )}
                      </div>

                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                          onClick={onClose}
                        >
                          {t('studentForm.buttons.cancel')}
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          {t('studentForm.buttons.save')}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

StudentForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object
}

export default StudentForm 