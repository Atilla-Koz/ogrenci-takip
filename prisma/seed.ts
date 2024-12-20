import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Önce mevcut verileri temizle
  await prisma.lesson.deleteMany()
  await prisma.student.deleteMany()
  await prisma.user.deleteMany()

  // Admin kullanıcısı
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  // Örnek öğretmen
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  await prisma.user.create({
    data: {
      email: 'teacher@example.com',
      name: 'Örnek Öğretmen',
      password: teacherPassword,
      role: 'TEACHER'
    }
  })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 