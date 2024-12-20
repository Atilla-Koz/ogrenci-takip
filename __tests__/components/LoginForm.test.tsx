import { render, screen, fireEvent } from '@testing-library/react'
import LoginForm from '@/components/LoginForm'
import { signIn } from 'next-auth/react'
import { useLanguage } from '@/providers/LanguageProvider'

jest.mock('next-auth/react')
jest.mock('@/providers/LanguageProvider')

describe('LoginForm', () => {
  beforeEach(() => {
    (useLanguage as jest.Mock).mockReturnValue({
      t: (key: string) => key
    })
  })

  it('renders login form', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /giriş yap/i })).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: null })

    render(<LoginForm />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }))
    
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirect: false
    })
  })
}) 