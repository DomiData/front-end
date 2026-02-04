import { useState } from 'react'
import type { User } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from './firebase'

const API_URL = import.meta.env.API_URL || 'http://localhost:8000'
export interface AuthCredentials {
  email: string
  password: string
  name?: string
}

export interface AuthError {
  code: string
  message: string
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const syncUserWithBackend = async (firebaseUser: User) => {
    try {
      const token = await firebaseUser.getIdToken()

      const response = await fetch(`${API_URL}/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Falha ao sincronizar usuário com o sistema.')
      }

      const dbUser = await response.json()
      return dbUser
    } catch (err) {
      // Silently log the error - sync failure shouldn't block registration
      console.warn('Erro no sync (backend pode estar offline):', err)
      // Don't throw - allow registration to proceed without backend sync
      return null
    }
  }

  const signup = async (credentials: AuthCredentials) => {
    setLoading(true)
    setError(null)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )
      syncUserWithBackend(userCredential.user)

      // Atualiza o displayName do usuário no Firebase
      if (credentials.name) {
        await updateProfile(userCredential.user, {
          displayName: credentials.name,
        })
      }

      setUser(userCredential.user)
      return userCredential.user
    } catch (err) {
      const firebaseError = err as { code: string; message: string }
      const errorMessage = getErrorMessage(firebaseError.code)
      setError({
        code: firebaseError.code,
        message: errorMessage,
      })
      throw firebaseError
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: AuthCredentials) => {
    setLoading(true)
    setError(null)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )

      await syncUserWithBackend(userCredential.user)

      setUser(userCredential.user)
      return userCredential.user
    } catch (err) {
      const firebaseError = err as { code: string; message: string }
      const errorMessage = getErrorMessage(firebaseError.code)
      setError({
        code: firebaseError.code,
        message: errorMessage,
      })
      throw firebaseError
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    setError(null)
    try {
      await signOut(auth)
      setUser(null)
    } catch (err) {
      const firebaseError = err as { code: string; message: string }
      setError({
        code: firebaseError.code,
        message: firebaseError.message,
      })
      throw firebaseError
    } finally {
      setLoading(false)
    }
  }

  return {
    signup,
    login,
    logout,
    loading,
    error,
    user,
  }
}

// Função auxiliar para traduzir códigos de erro do Firebase
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Email inválido',
    'auth/user-disabled': 'Usuário desabilitado',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'Email já está em uso',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/weak-password': 'Senha muito fraca',
    'auth/network-request-failed': 'Erro de conexão',
  }

  return errorMessages[errorCode] || 'Erro ao processar solicitação'
}
