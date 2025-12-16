import { createContext } from 'react'

export interface UserData {
  name: string
  email: string
}

export interface AuthContextType {
  user: UserData | null
  setUser: (userData: UserData | null) => void
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
