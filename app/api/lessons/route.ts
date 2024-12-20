import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"
import { dbMiddleware } from '@/middleware/db'
import { ApiError } from '@/utils/apiError'
import { errorHandler } from '@/utils/errorHandler'
import { ApiResponse } from '@/types/api'

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  return dbMiddleware(req, async (req) => {
    try {
      const session = await getServerSession(authOptions)
      if (!session) {
        throw new ApiError(401, "Unauthorized")
      }

      const { searchParams } = new URL(req.url)
      const teacherId = searchParams.get("teacherId")
      const studentId = searchParams.get("studentId")

      const where = {
        ...(teacherId && { teacherId: parseInt(teacherId) }),
        ...(studentId && { studentId: parseInt(studentId) })
      }

      if (!where.teacherId && !where.studentId) {
        throw new ApiError(400, "Teacher ID or Student ID is required")
      }

      const lessons = await prisma.lesson.findMany({
        where,
        include: {
          student: true,
          teacher: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      return NextResponse.json({ data: lessons, status: 200 })
    } catch (error) {
      return errorHandler(error, req)
    }
  })
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  return dbMiddleware(req, async (req) => {
    try {
      const session = await getServerSession(authOptions)
      if (!session) {
        throw new ApiError(401, "Unauthorized")
      }

      const data = await req.json()

      const lesson = await prisma.lesson.create({
        data: {
          teacherId: parseInt(data.teacherId),
          studentId: parseInt(data.studentId),
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          isRecurring: data.isRecurring,
          frequency: data.frequency
        }
      })

      return NextResponse.json({ data: lesson, status: 201 })
    } catch (error) {
      return errorHandler(error, req)
    }
  })
} 