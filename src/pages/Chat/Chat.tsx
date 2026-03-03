import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Send, Bot, User, Loader2, Info, Sparkles } from 'lucide-react'
import { sendChatMessage, type ChatMessageResponse } from '@/services/chatApi'
import './Chat.css'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: ChatMessageResponse['sources']
  disclaimer?: string
  timestamp: Date
}

const SUGGESTIONS = [
  'Quais doenças tiveram mais casos este ano?',
  'Qual a previsão de dengue para o próximo mês?',
  'Quais municípios têm mais casos de chikungunya?',
  'Mostre a tendência de leptospirose na Paraíba',
]

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await sendChatMessage(messageText)

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        disclaimer: response.disclaimer,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Messages Area */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">
                <Sparkles size={48} />
              </div>
              <h3>Assistente Epidemiológico</h3>
              <p>
                Faça perguntas sobre dados epidemiológicos, previsões de doenças
                e tendências de saúde pública.
              </p>

              <div className="chat-suggestions">
                {SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`chat-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-avatar">
                  {message.role === 'user' ? (
                    <User size={18} />
                  ) : (
                    <Bot size={18} />
                  )}
                </div>

                <div className="message-content">
                  <div className="message-bubble">
                    {message.role === 'assistant' ? (
                      <div className="markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="message-text">{message.content}</p>
                    )}
                  </div>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="message-sources">
                      <span className="sources-label">
                        <Info size={12} /> Fontes:
                      </span>
                      {message.sources.map((source, idx) => (
                        <span key={idx} className="source-tag">
                          {source.detail}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Disclaimer */}
                  {message.disclaimer && (
                    <div className="message-disclaimer">
                      <Info size={12} />
                      <span>{message.disclaimer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="chat-message assistant-message">
              <div className="message-avatar">
                <Bot size={18} />
              </div>
              <div className="message-content">
                <div className="message-bubble loading-bubble">
                  <Loader2 size={18} className="loading-spinner" />
                  <span>Analisando dados...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Pergunte sobre dados epidemiológicos..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              title="Enviar mensagem"
            >
              <Send size={18} />
            </button>
          </div>
          <span className="chat-disclaimer-footer">
            As respostas são geradas por IA e podem conter imprecisões. Sempre
            consulte fontes oficiais.
          </span>
        </div>
      </div>
    </div>
  )
}

export default Chat
