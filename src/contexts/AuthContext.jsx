import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

// Geçici kullanıcı verileri
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
  
  const [studentView, setStudentView] = useState(null)
  
  const [lessons, setLessons] = useState(() => {
    const savedLessons = localStorage.getItem('lessons')
    return savedLessons ? JSON.parse(savedLessons) : []
  })

  // Dersleri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('lessons', JSON.stringify(lessons))
  }, [lessons])

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
    setStudentView(null)
    localStorage.removeItem('user')
  }

  const getAllTeachers = () => {
    return TEMP_USERS.filter(user => user.role === 'teacher')
      .map(({ password: _, ...teacher }) => teacher)
  }

  const queryStudentLessons = (studentId) => {
    const studentLessons = lessons.filter(lesson => 
      lesson.studentId && lesson.studentId.toString() === studentId.toString()
    )
    
    if (studentLessons.length > 0) {
      const formattedLessons = studentLessons.map(lesson => ({
        ...lesson,
        start: new Date(lesson.start),
        end: new Date(lesson.end)
      }))
      
      setStudentView({
        studentId,
        lessons: formattedLessons
      })
      return true
    }
    return false
  }

  const value = {
    currentUser,
    login,
    logout,
    getAllTeachers,
    isAdmin: currentUser?.role === 'admin',
    queryStudentLessons,
    studentView,
    lessons,
    setLessons
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 