import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

// Geçici kullanıcı verileri (daha sonra backend'e taşınacak)
const TEMP_USERS = [
  {
    id: 1,
    email: 'hoca1@example.com',
    password: '123456',
    name: 'Ahmet Yılmaz',
    role: 'teacher'
  },
  {
    id: 2,
    email: 'hoca2@example.com',
    password: '123456',
    name: 'Ayşe Demir',
    role: 'teacher'
  },
  {
    id: 3,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin'
  }
]

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = (email, password) => {
    const user = TEMP_USERS.find(
      u => u.email === email && u.password === password
    )
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      setCurrentUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('user')
  }

  const getAllTeachers = () => {
    return TEMP_USERS.filter(user => user.role === 'teacher')
  }

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout,
      getAllTeachers,
      isAdmin: currentUser?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useAuth = () => useContext(AuthContext) 