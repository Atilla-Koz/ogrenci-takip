import '@testing-library/jest-dom'
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}))

// Import the mocked prisma
import { prisma } from '@/lib/prisma'

beforeEach(() => {
  mockReset(prisma)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient> 