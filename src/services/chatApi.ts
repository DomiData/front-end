import { auth } from '@/lib/firebase'
import api from './api'

export interface SourceReference {
  type: string
  detail: string
}

export interface ChatMessageResponse {
  answer: string
  sources: SourceReference[]
  disclaimer: string
}

export async function sendChatMessage(
  message: string
): Promise<ChatMessageResponse> {
  const user = auth.currentUser
  if (!user) {
    throw new Error('Usuário não autenticado.')
  }

  const token = await user.getIdToken()

  const response = await api.post<ChatMessageResponse>(
    '/chat/message',
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}
