import React from 'react'
import './Logo.css'

interface LogoProps {
  text?: string
  className?: string
}

export const Logo: React.FC<LogoProps> = ({
  text = 'Your Logo',
  className,
}) => {
  return <div className={`logo ${className || ''}`}>{text}</div>
}
