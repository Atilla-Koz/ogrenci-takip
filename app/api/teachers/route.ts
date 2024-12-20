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
      if (session?.user?.role !== 'ADMIN') {
        throw new ApiError(401, "Unauthorized")
      }

      const teachers = await prisma.user.findMany({
        where: {
          role: 'TEACHER'
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      return NextResponse.json({ data: teachers, status: 200 })
    } catch (error) {
      return errorHandler(error, req)
    }
  })
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  return dbMiddleware(req, async (req) => {
    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.role !== 'ADMIN') {
        throw new ApiError(401, "Unauthorized")
      }

      const data = await req.json()

      const teacher = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: data.password,
          role: 'TEACHER'
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      return NextResponse.json({ data: teacher, status: 201 })
    } catch (error) {
      return errorHandler(error, req)
    }
  })
} 