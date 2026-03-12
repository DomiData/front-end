import { createContext } from 'react'

export interface UserData {
  name: string
  email: string
}

export interface AuthContextType {
  user: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
