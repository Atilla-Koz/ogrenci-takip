import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"
import { dbMiddleware } from '@/middleware/db'
import { ApiError } from '@/utils/apiError'
import { errorHandler } from '@/utils/errorHandler'
import { ApiResponse } from '@/types/api'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  return dbMiddleware(req, async (req) => {
    try {
      const student = await prisma.student.findUnique({
        where: { studentId: params.id },
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
        throw new ApiError(404, "Student not found")
      }

      return NextResponse.json({ data: student, status: 200 })
    } catch (error) {
      return errorHandler(error, req)
    }
  })
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  return dbMiddleware(req, async (req) => {
    try {
      const session = await getServerSession(authOptions)
      if (!session) {
        throw new ApiError(401, "Unauthorized")
      }

      const data = await req.json()
      const id = parseInt(params.id)

      const student = await prisma.student.update({
        where: { id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          studentId: data.studentId
        }
      })

      return NextResponse.json({ data: student, status: 200 })
    } catch (error) {
      return errorHandler(error, req)
    }
  })
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  return dbMiddleware(req, async (req) => {
    try {
      const session = await getServerSession(authOptions)
      if (!session) {
        throw new ApiError(401, "Unauthorized")
      }

      const id = parseInt(params.id)

      await prisma.student.delete({
        where: { id }
      })

      return NextResponse.json({ status: 200, data: { success: true } })
    } catch (error) {
      return errorHandler(error, req)
    }
  })
} 