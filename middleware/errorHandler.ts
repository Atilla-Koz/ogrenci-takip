import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function errorHandler(
  error: unknown,
  req: Request
): Promise<NextResponse> {
  console.error('Error:', error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Something went wrong' },
    { status: 500 }
  )
} 