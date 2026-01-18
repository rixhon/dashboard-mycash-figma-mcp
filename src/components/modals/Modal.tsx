/**
 * Componente: Modal Base
 * Componente reutilizável para modais do sistema
 * 
 * Variantes:
 * - centered: Modal centralizado com overlay escuro (padrão)
 * - fullscreen: Modal ocupando 100% da viewport
 * - slideUp: Modal que desliza de baixo (mobile)
 */

import { useEffect, useRef, ReactNode } from 'react'

// ============================================================================
// ÍCONES
// ============================================================================

export const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
)

// ============================================================================
// TIPOS
// ============================================================================

type ModalVariant = 'centered' | 'fullscreen' | 'slideUp'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  variant?: ModalVariant
  className?: string
  closeOnOverlayClick?: boolean
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function Modal({
  isOpen,
  onClose,
  children,
  variant = 'centered',
  className = '',
  closeOnOverlayClick = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Bloqueia scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  // Fecha com ESC
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Estilos base do overlay
  const overlayClasses = `
    fixed inset-0 z-50
    bg-black/50
    transition-opacity duration-300
    ${variant === 'fullscreen' ? 'bg-white' : ''}
  `

  // Estilos do container do modal baseado na variante
  const getContainerClasses = () => {
    switch (variant) {
      case 'fullscreen':
        return `
          fixed inset-0 z-50
          bg-white
          flex flex-col
          animate-fade-in
        `
      case 'slideUp':
        return `
          fixed inset-x-0 bottom-0 z-50
          bg-white
          rounded-t-[24px]
          max-h-[90vh]
          animate-slide-up
        `
      case 'centered':
      default:
        return `
          fixed inset-0 z-50
          flex items-center justify-center
          p-4
        `
    }
  }

  // Estilos do conteúdo do modal
  const getContentClasses = () => {
    switch (variant) {
      case 'fullscreen':
        return 'flex-1 flex flex-col overflow-hidden'
      case 'slideUp':
        return 'flex flex-col overflow-hidden'
      case 'centered':
      default:
        return `
          relative
          bg-white
          rounded-[20px]
          shadow-2xl
          w-full max-w-[600px]
          max-h-[90vh]
          overflow-hidden
          animate-scale-in
        `
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (variant === 'fullscreen') {
    return (
      <div className={`${getContainerClasses()} ${className}`} ref={modalRef}>
        {children}
      </div>
    )
  }

  if (variant === 'slideUp') {
    return (
      <>
        <div className={overlayClasses} onClick={handleOverlayClick} />
        <div className={`${getContainerClasses()} ${className}`} ref={modalRef}>
          {children}
        </div>
      </>
    )
  }

  // Centered (padrão)
  return (
    <div className={overlayClasses} onClick={handleOverlayClick}>
      <div className={`${getContainerClasses()} ${className}`}>
        <div ref={modalRef} className={getContentClasses()}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SUBCOMPONENTES
// ============================================================================

interface ModalHeaderProps {
  children: ReactNode
  onClose?: () => void
  showCloseButton?: boolean
  className?: string
  variant?: 'default' | 'fullscreen'
}

export function ModalHeader({
  children,
  onClose,
  showCloseButton = true,
  className = '',
  variant = 'default',
}: ModalHeaderProps) {
  const baseClasses = variant === 'fullscreen'
    ? 'flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white'
    : 'flex items-center justify-between p-6 border-b border-gray-100'

  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="flex-1">{children}</div>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="
            w-12 h-12
            flex items-center justify-center
            rounded-full
            text-gray-500
            hover:bg-gray-100
            hover:text-gray-700
            transition-colors
          "
          aria-label="Fechar"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}

interface ModalContentProps {
  children: ReactNode
  className?: string
}

export function ModalContent({ children, className = '' }: ModalContentProps) {
  return (
    <div className={`flex-1 overflow-y-auto p-6 ${className}`}>
      {children}
    </div>
  )
}

interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div className={`flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-white ${className}`}>
      {children}
    </div>
  )
}

// ============================================================================
// COMPONENTES DE BOTÃO
// ============================================================================

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  className?: string
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseClasses = `
    px-6 py-3
    rounded-full
    font-semibold
    text-[14px]
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variantClasses = {
    primary: 'bg-[#080B12] text-white hover:opacity-90',
    secondary: 'bg-white text-[#080B12] border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

// ============================================================================
// COMPONENTES DE FORMULÁRIO
// ============================================================================

interface InputProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'number' | 'email'
  error?: string
  required?: boolean
  disabled?: boolean
  prefix?: string
  className?: string
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  required = false,
  disabled = false,
  prefix,
  className = '',
}: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-[14px] font-medium text-[#080B12]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[14px]">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full h-[56px]
            ${prefix ? 'pl-12' : 'px-4'}
            pr-4
            rounded-[12px]
            border
            text-[14px]
            text-[#080B12]
            placeholder:text-gray-400
            transition-colors
            outline-none
            focus:border-[#080B12]
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
        />
      </div>
      {error && (
        <span className="text-[12px] text-red-500">{error}</span>
      )}
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; group?: string }[]
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  error,
  required = false,
  disabled = false,
  className = '',
}: SelectProps) {
  // Agrupa opções se houver grupos
  const groupedOptions = options.reduce((acc, opt) => {
    const group = opt.group || ''
    if (!acc[group]) acc[group] = []
    acc[group].push(opt)
    return acc
  }, {} as Record<string, typeof options>)

  const hasGroups = Object.keys(groupedOptions).some(g => g !== '')

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-[14px] font-medium text-[#080B12]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full h-[56px]
          px-4
          rounded-[12px]
          border
          text-[14px]
          text-[#080B12]
          bg-white
          transition-colors
          outline-none
          focus:border-[#080B12]
          disabled:bg-gray-100 disabled:cursor-not-allowed
          appearance-none
          bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
          bg-no-repeat
          bg-[right_12px_center]
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      >
        <option value="" disabled>{placeholder}</option>
        {hasGroups ? (
          Object.entries(groupedOptions).map(([group, opts]) => (
            group ? (
              <optgroup key={group} label={group}>
                {opts.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </optgroup>
            ) : (
              opts.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))
            )
          ))
        ) : (
          options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))
        )}
      </select>
      {error && (
        <span className="text-[12px] text-red-500">{error}</span>
      )}
    </div>
  )
}

interface ToggleButtonGroupProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ToggleButtonGroup({
  options,
  value,
  onChange,
  className = '',
}: ToggleButtonGroupProps) {
  return (
    <div className={`flex bg-gray-100 rounded-full p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            flex-1 py-3 px-6
            rounded-full
            text-[14px] font-semibold
            transition-all duration-200
            ${value === option.value
              ? 'bg-[#080B12] text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:text-gray-900'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

interface CheckboxProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className = '',
}: CheckboxProps) {
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5
            rounded
            border-2
            transition-all
            flex items-center justify-center
            ${checked ? 'bg-[#080B12] border-[#080B12]' : 'bg-white border-gray-300'}
          `}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[14px] font-medium text-[#080B12]">{label}</span>
        {description && (
          <span className="text-[12px] text-gray-500">{description}</span>
        )}
      </div>
    </label>
  )
}
