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
      const { searchParams } = new URL(req.url)
      const teacherId = searchParams.get("teacherId")

      if (!teacherId) {
        throw new ApiError(400, "Teacher ID is required")
      }

      const students = await prisma.student.findMany({
        where: {
          lessons: {
            some: {
              teacherId: parseInt(teacherId)
            }
          }
        },
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

      return NextResponse.json({ data: students, status: 200 })
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

      const student = await prisma.student.create({
        data: {
          studentId: data.studentId,
          firstName: data.firstName,
          lastName: data.lastName
        }
      })

      return NextResponse.json({ data: student, status: 201 })
    } catch (error) {
      return errorHandler(error, req)
    }
  })
} 