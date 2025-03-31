import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

import { auth } from '@/lib'

interface AuthContextType {
  user: User | null
  loading: boolean
  isGoogleSignIn: boolean
  // eslint-disable-next-line no-unused-vars
  login: (email: string, password: string) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  register: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!user) {
        setUser(null)
        setIsGoogleSignIn(false)
        setLoading(false)
        return
      }
      const isGoogle = user.providerData.some(provider => provider.providerId === 'google.com')
      setIsGoogleSignIn(isGoogle)
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const register = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    setIsGoogleSignIn(true)
  }

  const logout = async () => {
    await signOut(auth)
    setIsGoogleSignIn(false)
  }

  const value = {
    user,
    loading,
    isGoogleSignIn,
    login,
    register,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
