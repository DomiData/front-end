import React from 'react'
import './ChatMessage.css'

interface SourceReference {
  type: string
  detail: string
}

interface ChatMessageProps {
  role: 'user' | 'bot'
  content: string
  sources?: SourceReference[]
  disclaimer?: string
  isLoading?: boolean
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  sources,
  disclaimer,
  isLoading = false,
}) => {
  return (
    <div className={`chat-message chat-message-${role}`}>
      <div className={`chat-bubble chat-bubble-${role}`}>
        {isLoading ? (
          <div className="chat-loading">
            <span className="chat-loading-dot"></span>
            <span className="chat-loading-dot"></span>
            <span className="chat-loading-dot"></span>
          </div>
        ) : (
          <>
            <div className="chat-content">{content}</div>
            {sources && sources.length > 0 && (
              <div className="chat-sources">
                {sources.map((source, index) => (
                  <span
                    key={index}
                    className={`chat-source-badge chat-source-${source.type === 'prediction_data' ? 'data' : 'general'}`}
                  >
                    {source.type === 'prediction_data'
                      ? 'Dados do Projeto'
                      : 'Conhecimento Geral'}
                  </span>
                ))}
              </div>
            )}
            {disclaimer && (
              <div className="chat-disclaimer">{disclaimer}</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
