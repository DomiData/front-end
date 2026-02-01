import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui'
import { ChatMessage } from '@/components/ChatMessage'
import './Chat.css'

const API_URL = import.meta.env.API_URL || 'http://localhost:8000'

interface SourceReference {
  type: string
  detail: string
}

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  sources?: SourceReference[]
  disclaimer?: string
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'bot',
  content:
    'Ola! Sou o assistente de saude do Domidata. Posso ajudar com informacoes sobre doencas, ' +
    'tendencias epidemiologicas e previsoes de casos na Paraiba. Como posso ajudar?',
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    setError(null)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        navigate('/login')
        return
      }

      const token = await currentUser.getIdToken()

      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: trimmed }),
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.answer,
        sources: data.sources,
        disclaimer: data.disclaimer,
      }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Erro ao enviar mensagem.'
      setError(errorMsg)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="chat-header-left">
          <h1>Assistente de Saude</h1>
          <span className="chat-header-badge">Domidata AI</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/home')}>
          Voltar
        </Button>
      </header>

      <main className="chat-messages">
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            sources={msg.sources}
            disclaimer={msg.disclaimer}
          />
        ))}
        {loading && <ChatMessage role="bot" content="" isLoading />}
        <div ref={messagesEndRef} />
      </main>

      {error && <div className="chat-error">{error}</div>}

      <footer className="chat-input-area">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Digite sua pergunta sobre saude..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          maxLength={2000}
        />
        <Button
          variant="primary"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          loading={loading}
        >
          Enviar
        </Button>
      </footer>
    </div>
  )
}
