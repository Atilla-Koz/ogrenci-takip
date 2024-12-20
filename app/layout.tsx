import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'
import { LanguageProvider } from '@/providers/LanguageProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Öğretmen Takvimi',
  description: 'Öğretmen ders takip sistemi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <ErrorBoundary>
                <Header />
                {children}
              </ErrorBoundary>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 