import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'soft' | 'danger'
  size?: 'sm' | 'md' | 'icon'
  icon?: ReactNode
}

export function Button({ className, variant = 'ghost', size = 'md', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-[var(--accent)] text-white shadow-lift hover:bg-[var(--accent-strong)]',
        variant === 'soft' && 'bg-[var(--surface-muted)] text-[var(--text)] hover:bg-[var(--surface-hover)]',
        variant === 'ghost' && 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]',
        variant === 'danger' && 'text-[var(--danger)] hover:bg-[var(--danger-soft)]',
        size === 'sm' && 'h-8 px-2.5 text-xs',
        size === 'md' && 'h-10 px-3 text-sm',
        size === 'icon' && 'h-8 w-8 p-0',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
