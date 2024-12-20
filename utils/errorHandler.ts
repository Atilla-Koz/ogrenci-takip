import { NextResponse } from 'next/server'
import { ApiError } from './apiError'
import { ApiResponse } from '@/types/api'

export async function errorHandler(
  error: unknown,
  req: Request
): Promise<NextResponse<ApiResponse>> {
  console.error('Error:', error)

  if (error instanceof ApiError) {
    return NextResponse.json({
      error: error.message,
      status: error.statusCode
    })
  }

  if (error instanceof Error) {
    return NextResponse.json({
      error: 'Internal Server Error',
      status: 500
    })
  }

  return NextResponse.json({
    error: 'Something went wrong',
    status: 500
  })
} 