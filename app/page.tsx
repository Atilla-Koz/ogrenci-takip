import { Suspense } from 'react'
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Calendar from "@/components/Calendar"
import LoginForm from "@/components/LoginForm"
import AdminPanel from "@/components/AdminPanel"
import PageLoading from '@/components/PageLoading'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <LoginForm />
  }

  if (session.user.role === 'ADMIN') {
    return (
      <Suspense fallback={<PageLoading />}>
        <AdminPanel />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<PageLoading />}>
      <Calendar />
    </Suspense>
  )
} 