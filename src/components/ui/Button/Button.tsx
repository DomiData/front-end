import React from 'react'
import './Button.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`button button-${variant} button-${size} ${fullWidth ? 'button-full-width' : ''} ${className || ''}`}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <span className="button-loader">...</span> : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
