import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Calendar from '@/components/Calendar'
import { ApiError } from '@/utils/apiError'

interface StudentPageProps {
  params: {
    id: string
  }
}

async function getStudent(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { studentId },
      include: {
        lessons: {
          include: {
            teacher: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!student) {
      notFound()
    }

    return student
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch student')
  }
}

export default async function StudentPage({ params }: StudentPageProps) {
  const student = await getStudent(params.id)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {`${student.firstName} ${student.lastName}`}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {`Öğrenci No: ${student.studentId}`}
              </p>
            </div>
            <a
              href="/"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              Çıkış
            </a>
          </div>
          <Calendar studentId={parseInt(student.studentId)} />
        </div>
      </div>
    </div>
  )
} 