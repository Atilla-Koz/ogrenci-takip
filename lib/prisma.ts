import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Test bağlantısı
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('Database connection successful')
    
    // Kullanıcıları listele
    const users = await prisma.user.findMany()
    console.log('Users:', users)
    
  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

export { prisma }