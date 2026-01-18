/**
 * Componente: AddMemberModal
 * Modal para adicionar novo membro da família
 * 
 * Conforme PROMPT 13:
 * - Campos: nome completo, função/papel, avatar (URL ou upload), renda mensal
 * - Validação de nome (mín 3 chars) e função (obrigatória)
 * - Sugestões de funções comuns
 * - Toast de sucesso ao adicionar
 */

import { useState, useCallback, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import Modal, { 
  ModalHeader, 
  ModalContent, 
  ModalFooter, 
  Button, 
  Input
} from './Modal'

// ============================================================================
// ÍCONES
// ============================================================================

const UserIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
)

// ============================================================================
// CONSTANTES
// ============================================================================

const ROLE_SUGGESTIONS = ['Pai', 'Mãe', 'Filho', 'Filha', 'Avô', 'Avó', 'Tio', 'Tia']

// ============================================================================
// TIPOS
// ============================================================================

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormErrors {
  name?: string
  role?: string
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const { addFamilyMember } = useFinance()

  // Estado do formulário
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)

  // Estado de erros e toast
  const [errors, setErrors] = useState<FormErrors>({})
  const [showToast, setShowToast] = useState(false)

  // Reset form quando abre/fecha
  useEffect(() => {
    if (isOpen) {
      setName('')
      setRole('')
      setAvatarUrl('')
      setMonthlyIncome('')
      setErrors({})
      setShowRoleSuggestions(false)
    }
  }, [isOpen])

  // Validação
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    
    if (!name || name.trim().length < 3) {
      newErrors.name = 'Por favor, insira um nome válido (mínimo 3 caracteres)'
    }
    
    if (!role || role.trim().length === 0) {
      newErrors.role = 'Por favor, informe a função na família'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name, role])

  // Formata valor como moeda
  const handleIncomeChange = useCallback((val: string) => {
    const numbers = val.replace(/\D/g, '')
    if (!numbers) {
      setMonthlyIncome('')
      return
    }
    
    const numValue = parseInt(numbers) / 100
    const formatted = numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    setMonthlyIncome(formatted)
  }, [])

  // Submit
  const handleSubmit = useCallback(() => {
    if (!validate()) return

    const incomeValue = monthlyIncome 
      ? parseFloat(monthlyIncome.replace(/[^\d,]/g, '').replace(',', '.'))
      : 0

    addFamilyMember({
      name: name.trim(),
      role: role.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      monthlyIncome: incomeValue || undefined,
    })

    // Mostra toast
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      onClose()
    }, 1500)
  }, [validate, name, role, avatarUrl, monthlyIncome, addFamilyMember, onClose])

  // Handler para selecionar sugestão de função
  const handleRoleSuggestion = useCallback((suggestion: string) => {
    setRole(suggestion)
    setShowRoleSuggestions(false)
  }, [])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} variant="centered">
        {/* Header */}
        <ModalHeader onClose={onClose}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[12px] border border-gray-200 flex items-center justify-center text-gray-600">
              <UserIcon />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#080B12]">Novo familiar</h2>
              <p className="text-[14px] text-gray-500">
                Adicione alguém para participar do controle financeiro.
              </p>
            </div>
          </div>
        </ModalHeader>

        {/* Conteúdo */}
        <ModalContent className="bg-white">
          <div className="flex flex-col gap-6">
            {/* Nome */}
            <Input
              label="Nome"
              value={name}
              onChange={setName}
              placeholder="Nome do familiar"
              error={errors.name}
              required
            />

            {/* Função/Papel e Renda */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Função com sugestões */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[14px] font-medium text-[#080B12]">
                  Função / Parentesco <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onFocus={() => setShowRoleSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 200)}
                  placeholder="Membro"
                  className={`
                    w-full h-[56px] px-4
                    rounded-[12px] border
                    text-[14px] text-[#080B12]
                    placeholder:text-gray-400
                    outline-none focus:border-[#080B12]
                    ${errors.role ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                {errors.role && (
                  <span className="text-[12px] text-red-500">{errors.role}</span>
                )}
                
                {/* Dropdown de sugestões */}
                {showRoleSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg z-10 overflow-hidden">
                    {ROLE_SUGGESTIONS.filter(s => 
                      s.toLowerCase().includes(role.toLowerCase())
                    ).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={() => handleRoleSuggestion(suggestion)}
                        className="w-full px-4 py-3 text-left text-[14px] text-[#080B12] hover:bg-gray-50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Renda */}
              <Input
                label="Renda"
                value={monthlyIncome}
                onChange={handleIncomeChange}
                placeholder="0,00"
                prefix="R$"
              />
            </div>
          </div>
        </ModalContent>

        {/* Footer */}
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Salvar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Toast de sucesso */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
          <div className="flex items-center gap-3 px-6 py-3 bg-[#080B12] text-white rounded-full shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#15BE78">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            <span className="text-[14px] font-medium">Membro adicionado com sucesso!</span>
          </div>
        </div>
      )}
    </>
  )
}
