import { render, screen } from '@testing-library/react'
import Calendar from '@/components/Calendar'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/providers/LanguageProvider'

jest.mock('next-auth/react')
jest.mock('@/providers/LanguageProvider')

describe('Calendar', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: '1', name: 'Test User' } },
      status: 'authenticated'
    })

    (useLanguage as jest.Mock).mockReturnValue({
      language: 'tr',
      t: (key: string) => key
    })
  })

  it('renders calendar component', () => {
    render(<Calendar />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<Calendar />)
    expect(screen.getByText('Yükleniyor...')).toBeInTheDocument()
  })
}) 