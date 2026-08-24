import React from 'react'

/**
 * Reusable Button Component for VidyaScope
 * Provides standardized hover, active, focus-visible, and touch states.
 *
 * @param {'primary' | 'secondary' | 'outline' | 'accent' | 'ghost' | 'dark' | 'text'} variant
 * @param {'sm' | 'md' | 'lg'} size
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    dark: 'btn-dark',
    text: 'btn-text',
  }[variant] || 'btn-primary'

  const sizeClass = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }[size] || 'btn-md'

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${variantClass} ${variant !== 'text' ? sizeClass : ''} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      )}
    </button>
  )
}

export default Button
