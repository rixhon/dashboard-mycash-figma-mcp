/**
 * Componente: AddCardModal
 * Modal para adicionar conta bancária ou cartão de crédito
 * 
 * Conforme PROMPT 14:
 * - Toggle entre Conta Bancária e Cartão de Crédito
 * - Campos condicionais baseados no tipo
 * - Seleção de tema visual para cartões
 * - Validação completa
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CreditCardTheme } from '@/types'
import Modal, { 
  ModalHeader, 
  ModalContent, 
  ModalFooter, 
  Button, 
  Input,
  Select,
  ToggleButtonGroup
} from './Modal'

// ============================================================================
// ÍCONES
// ============================================================================

const CardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6ZM4 8H20V6H4V8ZM4 18H20V10H4V18Z" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
)

// ============================================================================
// TIPOS
// ============================================================================

type AccountType = 'bankAccount' | 'creditCard'

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: AccountType
}

interface FormErrors {
  name?: string
  holderId?: string
  balance?: string
  closingDay?: string
  dueDay?: string
  limit?: string
  theme?: string
}

// ============================================================================
// CONSTANTES
// ============================================================================

const THEME_OPTIONS: { value: CreditCardTheme; label: string; bgColor: string; textColor: string }[] = [
  { value: 'black', label: 'Black', bgColor: '#080B12', textColor: '#FFFFFF' },
  { value: 'lime', label: 'Lime', bgColor: '#C4E703', textColor: '#080B12' },
  { value: 'white', label: 'White', bgColor: '#FFFFFF', textColor: '#080B12' },
]

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}))

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function AddCardModal({ isOpen, onClose, initialType = 'bankAccount' }: AddCardModalProps) {
  const { familyMembers, addBankAccount, addCreditCard } = useFinance()

  // Estado do formulário
  const [type, setType] = useState<AccountType>(initialType)
  const [name, setName] = useState('')
  const [holderId, setHolderId] = useState('')
  
  // Campos de conta bancária
  const [balance, setBalance] = useState('')
  
  // Campos de cartão de crédito
  const [closingDay, setClosingDay] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [limit, setLimit] = useState('')
  const [lastDigits, setLastDigits] = useState('')
  const [theme, setTheme] = useState<CreditCardTheme>('black')

  // Estado de erros e toast
  const [errors, setErrors] = useState<FormErrors>({})
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Reset form quando abre/fecha
  useEffect(() => {
    if (isOpen) {
      setType(initialType)
      setName('')
      setHolderId('')
      setBalance('')
      setClosingDay('')
      setDueDay('')
      setLimit('')
      setLastDigits('')
      setTheme('black')
      setErrors({})
    }
  }, [isOpen, initialType])

  // Opções de membros
  const memberOptions = useMemo(() => 
    familyMembers.map(m => ({ value: m.id, label: m.name })),
    [familyMembers]
  )

  // Formata valor como moeda
  const handleCurrencyChange = useCallback((setter: (val: string) => void) => (val: string) => {
    const numbers = val.replace(/\D/g, '')
    if (!numbers) {
      setter('')
      return
    }
    
    const numValue = parseInt(numbers) / 100
    const formatted = numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    setter(formatted)
  }, [])

  // Handler para últimos 4 dígitos
  const handleLastDigitsChange = useCallback((val: string) => {
    const numbers = val.replace(/\D/g, '').slice(0, 4)
    setLastDigits(numbers)
  }, [])

  // Validação
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    
    if (!name || name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }
    
    if (!holderId) {
      newErrors.holderId = 'Selecione um titular'
    }
    
    if (type === 'bankAccount') {
      if (!balance) {
        newErrors.balance = 'Informe o saldo inicial'
      }
    } else {
      if (!closingDay) {
        newErrors.closingDay = 'Selecione o dia de fechamento'
      }
      if (!dueDay) {
        newErrors.dueDay = 'Selecione o dia de vencimento'
      }
      const limitValue = limit ? parseFloat(limit.replace(/[^\d,]/g, '').replace(',', '.')) : 0
      if (!limit || limitValue <= 0) {
        newErrors.limit = 'Limite deve ser maior que zero'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name, holderId, type, balance, closingDay, dueDay, limit])

  // Submit
  const handleSubmit = useCallback(() => {
    if (!validate()) return

    if (type === 'bankAccount') {
      const balanceValue = parseFloat(balance.replace(/[^\d,]/g, '').replace(',', '.'))
      
      addBankAccount({
        name: name.trim(),
        holderId,
        balance: balanceValue,
      })
      
      setToastMessage('Conta adicionada com sucesso!')
    } else {
      const limitValue = parseFloat(limit.replace(/[^\d,]/g, '').replace(',', '.'))
      
      addCreditCard({
        name: name.trim(),
        holderId,
        closingDay: parseInt(closingDay),
        dueDay: parseInt(dueDay),
        limit: limitValue,
        currentBill: 0,
        theme,
        lastDigits: lastDigits || undefined,
      })
      
      setToastMessage('Cartão adicionado com sucesso!')
    }

    // Mostra toast
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      onClose()
    }, 1500)
  }, [validate, type, name, holderId, balance, closingDay, dueDay, limit, theme, lastDigits, addBankAccount, addCreditCard, onClose])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} variant="centered">
        {/* Header */}
        <ModalHeader onClose={onClose}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[12px] border border-gray-200 flex items-center justify-center text-gray-600">
              <CardIcon />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#080B12]">
                {type === 'bankAccount' ? 'Nova conta' : 'Novo cartão'}
              </h2>
              <p className="text-[14px] text-gray-500">
                {type === 'bankAccount' 
                  ? 'Adicione uma nova conta bancária' 
                  : 'Adicione um novo cartão de crédito'
                }
              </p>
            </div>
          </div>
        </ModalHeader>

        {/* Conteúdo */}
        <ModalContent className="bg-white">
          <div className="flex flex-col gap-6">
            {/* Toggle Conta/Cartão */}
            <ToggleButtonGroup
              options={[
                { value: 'bankAccount', label: 'Conta bancária' },
                { value: 'creditCard', label: 'Cartão de crédito' },
              ]}
              value={type}
              onChange={(val) => setType(val as AccountType)}
            />

            {/* Nome */}
            <Input
              label={type === 'bankAccount' ? 'Nome da conta' : 'Apelido do cartão'}
              value={name}
              onChange={setName}
              placeholder={type === 'bankAccount' ? 'Ex: Conta corrente Nubank' : 'Ex: XP black'}
              error={errors.name}
              required
            />

            {/* Campos específicos de Cartão */}
            {type === 'creditCard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Banco"
                  value={name.split(' ')[0] || ''}
                  onChange={() => {}}
                  placeholder="XP"
                  disabled
                />
                <Input
                  label="Número final"
                  value={lastDigits ? `**** ${lastDigits}` : ''}
                  onChange={handleLastDigitsChange}
                  placeholder="**** 5843"
                />
              </div>
            )}

            {/* Campos condicionais */}
            {type === 'bankAccount' ? (
              /* Campos de Conta Bancária */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Tipo"
                  value="corrente"
                  onChange={() => {}}
                  options={[
                    { value: 'corrente', label: 'Conta corrente' },
                    { value: 'poupanca', label: 'Poupança' },
                    { value: 'investimento', label: 'Investimento' },
                  ]}
                />
                <Input
                  label="Saldo inicial"
                  value={balance}
                  onChange={handleCurrencyChange(setBalance)}
                  placeholder="0,00"
                  prefix="R$"
                  error={errors.balance}
                  required
                />
              </div>
            ) : (
              /* Campos de Cartão de Crédito */
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Limite total"
                    value={limit}
                    onChange={handleCurrencyChange(setLimit)}
                    placeholder="0,00"
                    prefix="R$"
                    error={errors.limit}
                    required
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[14px] font-medium text-[#080B12]">
                        Responsável <span className="text-red-500">*</span>
                      </label>
                      <button className="text-[12px] font-medium text-[#080B12] hover:underline">
                        + Novo membro
                      </button>
                    </div>
                    <Select
                      label=""
                      value={holderId}
                      onChange={setHolderId}
                      options={memberOptions}
                      placeholder="Familiar"
                      error={errors.holderId}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Fechamento"
                    value={closingDay}
                    onChange={setClosingDay}
                    options={DAY_OPTIONS}
                    placeholder="Dia"
                    error={errors.closingDay}
                    required
                  />
                  <Select
                    label="Vencimento"
                    value={dueDay}
                    onChange={setDueDay}
                    options={DAY_OPTIONS}
                    placeholder="Dia"
                    error={errors.dueDay}
                    required
                  />
                </div>
              </>
            )}

            {/* Responsável para conta bancária */}
            {type === 'bankAccount' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[14px] font-medium text-[#080B12]">
                    Responsável <span className="text-red-500">*</span>
                  </label>
                  <button className="text-[12px] font-medium text-[#080B12] hover:underline">
                    + Novo membro
                  </button>
                </div>
                <Select
                  label=""
                  value={holderId}
                  onChange={setHolderId}
                  options={memberOptions}
                  placeholder="Familiar"
                  error={errors.holderId}
                />
              </div>
            )}

            {/* Cor de identificação */}
            <div className="flex flex-col gap-3">
              <label className="text-[14px] font-medium text-[#080B12]">
                Cor de identificação
              </label>
              <div className="flex gap-3">
                {THEME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={`
                      w-10 h-10 rounded-full
                      flex items-center justify-center
                      border-2 transition-all
                      ${theme === option.value 
                        ? 'border-[#080B12] scale-110' 
                        : 'border-gray-200 hover:border-gray-400'
                      }
                    `}
                    style={{ backgroundColor: option.bgColor }}
                  >
                    {theme === option.value && (
                      <span style={{ color: option.textColor }}>
                        <CheckIcon />
                      </span>
                    )}
                  </button>
                ))}
              </div>
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
            <span className="text-[14px] font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  )
}
