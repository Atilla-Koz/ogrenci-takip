import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

export async function dbMiddleware(
  req: Request,
  handler: (req: Request) => Promise<NextResponse<ApiResponse>>
): Promise<NextResponse<ApiResponse>> {
  try {
    await prisma.$connect()
    return await handler(req)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({
      error: 'Database connection failed',
      status: 500
    })
  } finally {
    await prisma.$disconnect()
  }
} 