import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import './Link.css'

interface LinkProps {
  children: React.ReactNode
  href: string
  className?: string
}

export const Link: React.FC<LinkProps> = ({
  className,
  children,
  href,
  ...props
}) => {
  // Se for link externo, usa <a>
  if (href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={`link ${className || ''}`} {...props}>
        {children}
      </a>
    )
  }

  // Para rotas internas, usa React Router
  return (
    <RouterLink to={href} className={`link ${className || ''}`} {...props}>
      {children}
    </RouterLink>
  )
}

Link.displayName = 'Link'
