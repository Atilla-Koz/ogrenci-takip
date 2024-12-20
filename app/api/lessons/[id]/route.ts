import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"
import { dbMiddleware } from '@/middleware/db'
import { ApiError } from '@/utils/apiError'
import { errorHandler } from '@/utils/errorHandler'
import { ApiResponse } from '@/types/api'

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

      const lesson = await prisma.lesson.update({
        where: { id },
        data: {
          teacherId: parseInt(data.teacherId),
          studentId: parseInt(data.studentId),
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          isRecurring: data.isRecurring,
          frequency: data.frequency
        }
      })

      return NextResponse.json({ data: lesson, status: 200 })
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

      await prisma.lesson.delete({
        where: { id }
      })

      return NextResponse.json({ status: 200, data: { success: true } })
    } catch (error) {
      return errorHandler(error, req)
    }
  })
} 