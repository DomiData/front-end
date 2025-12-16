import React from 'react'
import './Link.css'

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a ref={ref} className={`link ${className || ''}`} {...props}>
        {children}
      </a>
    )
  }
)

Link.displayName = 'Link'
