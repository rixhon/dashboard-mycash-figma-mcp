/**
 * Componente: AddBillModal
 * Modal para adicionar nova despesa/conta a pagar
 * 
 * Funcionalidades:
 * - Campos: descrição, valor, data de vencimento, conta/cartão
 * - Opção de despesa recorrente
 * - Opção de parcelamento
 * - Validação completa
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import Modal, { 
  ModalHeader, 
  ModalContent, 
  ModalFooter, 
  Button, 
  Input,
  Select,
  Checkbox
} from './Modal'

// ============================================================================
// ÍCONES
// ============================================================================

const WalletIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
)

// ============================================================================
// TIPOS
// ============================================================================

interface AddBillModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormErrors {
  description?: string
  value?: string
  dueDate?: string
  accountId?: string
}

// ============================================================================
// CONSTANTES
// ============================================================================

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: `Dia ${i + 1}`,
}))

const INSTALLMENT_OPTIONS = [
  { value: '1', label: 'À vista (1x)' },
  ...Array.from({ length: 11 }, (_, i) => ({
    value: String(i + 2),
    label: `${i + 2}x`,
  })),
]

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function AddBillModal({ isOpen, onClose }: AddBillModalProps) {
  const { bankAccounts, creditCards, addBill } = useFinance()

  // Estado do formulário
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [accountId, setAccountId] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [installments, setInstallments] = useState('1')

  // Estado de erros e toast
  const [errors, setErrors] = useState<FormErrors>({})
  const [showToast, setShowToast] = useState(false)

  // Reset form quando abre/fecha
  useEffect(() => {
    if (isOpen) {
      setDescription('')
      setValue('')
      setDueDay('')
      setAccountId('')
      setIsRecurring(false)
      setInstallments('1')
      setErrors({})
    }
  }, [isOpen])

  // Opções de conta/cartão agrupadas
  const accountOptions = useMemo(() => {
    const options: { value: string; label: string; group?: string }[] = []
    
    bankAccounts.forEach(acc => {
      options.push({ value: acc.id, label: acc.name, group: 'Contas Bancárias' })
    })
    
    creditCards.forEach(card => {
      options.push({ value: card.id, label: card.name, group: 'Cartões de Crédito' })
    })
    
    return options
  }, [bankAccounts, creditCards])

  // Verifica se conta selecionada é cartão de crédito
  const isCardSelected = useMemo(() => {
    return creditCards.some(card => card.id === accountId)
  }, [creditCards, accountId])

  // Mostra parcelamento apenas se conta = cartão
  const showInstallments = isCardSelected

  // Formata valor como moeda
  const handleValueChange = useCallback((val: string) => {
    const numbers = val.replace(/\D/g, '')
    if (!numbers) {
      setValue('')
      return
    }
    
    const numValue = parseInt(numbers) / 100
    const formatted = numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    setValue(formatted)
  }, [])

  // Handler para checkbox de recorrente
  const handleRecurringChange = useCallback((checked: boolean) => {
    setIsRecurring(checked)
    if (checked) {
      setInstallments('1') // Força à vista se recorrente
    }
  }, [])

  // Handler para parcelamento
  const handleInstallmentsChange = useCallback((val: string) => {
    setInstallments(val)
    if (parseInt(val) > 1) {
      setIsRecurring(false) // Desabilita recorrente se parcelado
    }
  }, [])

  // Validação
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    
    if (!description || description.trim().length < 3) {
      newErrors.description = 'Descrição deve ter pelo menos 3 caracteres'
    }
    
    const numValue = value ? parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) : 0
    if (!value || isNaN(numValue) || numValue <= 0) {
      newErrors.value = 'Valor deve ser maior que zero'
    }
    
    if (!dueDay) {
      newErrors.dueDate = 'Selecione o dia de vencimento'
    }
    
    if (!accountId) {
      newErrors.accountId = 'Selecione uma conta ou cartão'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [description, value, dueDay, accountId])

  // Submit
  const handleSubmit = useCallback(() => {
    if (!validate()) return

    const numValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'))
    const numInstallments = parseInt(installments)
    
    // Calcula a data de vencimento (próximo mês se o dia já passou)
    const now = new Date()
    const dueDayNum = parseInt(dueDay)
    let dueDate = new Date(now.getFullYear(), now.getMonth(), dueDayNum)
    
    // Se o dia já passou neste mês, agenda para o próximo
    if (dueDate < now) {
      dueDate = new Date(now.getFullYear(), now.getMonth() + 1, dueDayNum)
    }

    addBill({
      description: description.trim(),
      value: numValue,
      dueDate,
      type: isCardSelected ? 'card' : 'fixed',
      status: 'pending',
      accountId,
      isRecurring,
      installments: numInstallments > 1 ? numInstallments : undefined,
      currentInstallment: numInstallments > 1 ? 1 : undefined,
    })

    // Mostra toast
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      onClose()
    }, 1500)
  }, [validate, description, value, dueDay, accountId, isRecurring, installments, isCardSelected, addBill, onClose])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} variant="centered">
        {/* Header */}
        <ModalHeader onClose={onClose}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[12px] border border-gray-200 flex items-center justify-center text-gray-600">
              <WalletIcon />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#080B12]">Nova despesa</h2>
              <p className="text-[14px] text-gray-500">
                Adicione uma conta a pagar ou despesa futura.
              </p>
            </div>
          </div>
        </ModalHeader>

        {/* Conteúdo */}
        <ModalContent className="bg-white">
          <div className="flex flex-col gap-6">
            {/* Descrição */}
            <Input
              label="Descrição"
              value={description}
              onChange={setDescription}
              placeholder="Ex: Conta de luz, Netflix, Aluguel..."
              error={errors.description}
              required
            />

            {/* Valor e Dia de Vencimento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Valor"
                value={value}
                onChange={handleValueChange}
                placeholder="0,00"
                prefix="R$"
                error={errors.value}
                required
              />
              <Select
                label="Dia de vencimento"
                value={dueDay}
                onChange={setDueDay}
                options={DAY_OPTIONS}
                placeholder="Selecione o dia"
                error={errors.dueDate}
                required
              />
            </div>

            {/* Conta/Cartão */}
            <Select
              label="Conta / Cartão de pagamento"
              value={accountId}
              onChange={setAccountId}
              options={accountOptions}
              placeholder="Selecione onde será debitado"
              error={errors.accountId}
              required
            />

            {/* Parcelamento - só aparece para cartão */}
            {showInstallments && (
              <div className="animate-fade-in">
                <Select
                  label="Parcelas"
                  value={installments}
                  onChange={handleInstallmentsChange}
                  options={INSTALLMENT_OPTIONS}
                  disabled={isRecurring}
                />
                {isRecurring && (
                  <p className="text-[12px] text-gray-500 italic mt-1">
                    Parcelamento desabilitado para despesas recorrentes
                  </p>
                )}
              </div>
            )}

            {/* Checkbox Despesa Recorrente */}
            <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-4">
              <Checkbox
                label="Despesa recorrente"
                description={
                  parseInt(installments) > 1
                    ? "Não disponível para compras parceladas"
                    : "Contas que se repetem todo mês (luz, água, assinaturas, etc)."
                }
                checked={isRecurring}
                onChange={handleRecurringChange}
                disabled={parseInt(installments) > 1}
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
            Adicionar despesa
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
            <span className="text-[14px] font-medium">Despesa adicionada com sucesso!</span>
          </div>
        </div>
      )}
    </>
  )
}
