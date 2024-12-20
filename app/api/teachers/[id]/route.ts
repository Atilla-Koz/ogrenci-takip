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
      const session = await getServerSession(authOptions)
      if (session?.user?.role !== 'ADMIN') {
        throw new ApiError(401, "Unauthorized")
      }

      const teacher = await prisma.user.findUnique({
        where: { id: parseInt(params.id) },
        select: {
          id: true,
          name: true,
          email: true,
          lessons: {
            include: {
              student: true
            }
          }
        }
      })

      if (!teacher) {
        throw new ApiError(404, "Teacher not found")
      }

      return NextResponse.json({ data: teacher, status: 200 })
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
      if (session?.user?.role !== 'ADMIN') {
        throw new ApiError(401, "Unauthorized")
      }

      const data = await req.json()
      const id = parseInt(params.id)

      const teacher = await prisma.user.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      return NextResponse.json({ data: teacher, status: 200 })
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
      if (session?.user?.role !== 'ADMIN') {
        throw new ApiError(401, "Unauthorized")
      }

      const id = parseInt(params.id)

      await prisma.user.delete({
        where: { id }
      })

      return NextResponse.json({ status: 200, data: { success: true } })
    } catch (error) {
      return errorHandler(error, req)
    }
  })
} 