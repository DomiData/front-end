import React, { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { AuthContext, type AuthContextType, type UserData } from './authTypes'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getDisplayName = (displayName: string | null, email: string | null) => {
    if (displayName?.trim()) {
      return displayName.trim()
    }

    if (email) {
      return email.split('@')[0]
    }

    return 'Usuário'
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        setUser({
          name: getDisplayName(firebaseUser.displayName, firebaseUser.email),
          email: firebaseUser.email || '',
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
