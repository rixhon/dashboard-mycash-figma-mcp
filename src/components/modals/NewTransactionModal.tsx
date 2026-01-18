/**
 * Componente: NewTransactionModal
 * Modal fullscreen para adicionar nova transação
 * 
 * Conforme PROMPT 12:
 * - Header fixo com ícone que muda conforme tipo (receita/despesa)
 * - Toggle de tipo (Receita/Despesa)
 * - Campos: valor, descrição, categoria, membro, conta/cartão
 * - Parcelamento condicional (só para cartão + despesa)
 * - Checkbox de despesa recorrente
 * - Validação completa antes de salvar
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useFinance, CATEGORIES } from '@/contexts/FinanceContext'
import Modal, { 
  Button, 
  Input, 
  Select, 
  ToggleButtonGroup,
  Checkbox,
  CloseIcon 
} from './Modal'

// ============================================================================
// ÍCONES
// ============================================================================

const ArrowDownIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z" />
  </svg>
)

const ArrowUpIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 20V7.83l5.59 5.59L20 12l-8-8-8 8 1.41 1.41L11 7.83V20h2z" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
)

// ============================================================================
// TIPOS
// ============================================================================

interface NewTransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormErrors {
  value?: string
  description?: string
  category?: string
  accountId?: string
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
  const {
    familyMembers,
    bankAccounts,
    creditCards,
    addTransaction,
  } = useFinance()

  // Estado do formulário
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [memberId, setMemberId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [installments, setInstallments] = useState('1')
  const [isRecurring, setIsRecurring] = useState(false)
  const [date, setDate] = useState(() => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  })
  
  // Estado para nova categoria
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [customCategories, setCustomCategories] = useState<{ income: string[]; expense: string[] }>({
    income: [],
    expense: [],
  })

  // Estado de erros
  const [errors, setErrors] = useState<FormErrors>({})
  const [showToast, setShowToast] = useState(false)

  // Reset form quando abre/fecha
  useEffect(() => {
    if (isOpen) {
      setType('expense')
      setValue('')
      setDescription('')
      setCategory('')
      setMemberId('')
      setAccountId('')
      setInstallments('1')
      setIsRecurring(false)
      setDate(new Date().toISOString().split('T')[0])
      setErrors({})
      setShowNewCategory(false)
      setNewCategoryName('')
    }
  }, [isOpen])

  // Verifica se conta selecionada é cartão de crédito
  const isCardSelected = useMemo(() => {
    return creditCards.some(card => card.id === accountId)
  }, [creditCards, accountId])

  // Mostra parcelamento apenas se: tipo = despesa E conta = cartão
  const showInstallments = type === 'expense' && isCardSelected

  // Categorias disponíveis baseadas no tipo
  const availableCategories = useMemo(() => {
    const baseCategories = type === 'income' ? CATEGORIES.income : CATEGORIES.expense
    const custom = type === 'income' ? customCategories.income : customCategories.expense
    return [...baseCategories, ...custom]
  }, [type, customCategories])

  // Opções de membros
  const memberOptions = useMemo(() => [
    { value: '', label: 'Família (Geral)' },
    ...familyMembers.map(m => ({ value: m.id, label: m.name }))
  ], [familyMembers])

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

  // Opções de parcelamento
  const installmentOptions = useMemo(() => {
    const options = [{ value: '1', label: 'À vista (1x)' }]
    for (let i = 2; i <= 12; i++) {
      options.push({ value: String(i), label: `${i}x` })
    }
    return options
  }, [])

  // Handler para adicionar nova categoria
  const handleAddCategory = useCallback(() => {
    if (newCategoryName.trim().length >= 2) {
      setCustomCategories(prev => ({
        ...prev,
        [type]: [...prev[type], newCategoryName.trim()]
      }))
      setCategory(newCategoryName.trim())
      setNewCategoryName('')
      setShowNewCategory(false)
    }
  }, [newCategoryName, type])

  // Handler para mudança de tipo
  const handleTypeChange = useCallback((newType: string) => {
    setType(newType as 'income' | 'expense')
    setCategory('') // Reset categoria ao mudar tipo
    if (newType === 'income') {
      setIsRecurring(false)
      setInstallments('1')
    }
  }, [])

  // Handler para checkbox de recorrente
  const handleRecurringChange = useCallback((checked: boolean) => {
    setIsRecurring(checked)
    if (checked) {
      setInstallments('1') // Força à vista se recorrente
    }
  }, [])

  // Handler para parcelamento
  const handleInstallmentsChange = useCallback((value: string) => {
    setInstallments(value)
    if (parseInt(value) > 1) {
      setIsRecurring(false) // Desabilita recorrente se parcelado
    }
  }, [])

  // Validação
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    
    const numValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'))
    if (!value || isNaN(numValue) || numValue <= 0) {
      newErrors.value = 'Valor deve ser maior que zero'
    }
    
    if (!description || description.trim().length < 3) {
      newErrors.description = 'Descrição deve ter pelo menos 3 caracteres'
    }
    
    if (!category) {
      newErrors.category = 'Selecione uma categoria'
    }
    
    if (!accountId) {
      newErrors.accountId = 'Selecione uma conta ou cartão'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [value, description, category, accountId])

  // Submit
  const handleSubmit = useCallback(() => {
    if (!validate()) return

    const numValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'))
    const numInstallments = parseInt(installments)

    addTransaction({
      type,
      value: numValue,
      description: description.trim(),
      category,
      date: new Date(date),
      accountId,
      memberId: memberId || null,
      installments: numInstallments,
      currentInstallment: 1,
      status: 'completed',
      isRecurring,
      isPaid: false,
    })

    // Mostra toast
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      onClose()
    }, 1500)
  }, [validate, value, description, category, date, accountId, memberId, installments, isRecurring, type, addTransaction, onClose])

  // Formata valor como moeda
  const handleValueChange = useCallback((val: string) => {
    // Remove tudo exceto números
    const numbers = val.replace(/\D/g, '')
    if (!numbers) {
      setValue('')
      return
    }
    
    // Converte para número e formata
    const numValue = parseInt(numbers) / 100
    const formatted = numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    setValue(formatted)
  }, [])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} variant="fullscreen">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            {/* Ícone que muda conforme tipo */}
            <div
              className={`
                w-16 h-16 rounded-full
                flex items-center justify-center
                ${type === 'income' 
                  ? 'bg-[#C4E703] text-[#080B12]' 
                  : 'bg-[#080B12] text-white'
                }
              `}
            >
              {type === 'income' ? <ArrowDownIcon /> : <ArrowUpIcon />}
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-[#080B12]">Nova transação</h1>
              <p className="text-[14px] text-gray-500">
                Registre entradas e saídas para manter seu controle.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-[600px] mx-auto py-8 px-6">
            <div className="flex flex-col gap-6">
              {/* Toggle Receita/Despesa */}
              <ToggleButtonGroup
                options={[
                  { value: 'income', label: 'Receita' },
                  { value: 'expense', label: 'Despesas' },
                ]}
                value={type}
                onChange={handleTypeChange}
              />

              {/* Valor e Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Valor da transação"
                  value={value}
                  onChange={handleValueChange}
                  placeholder="0,00"
                  prefix="R$"
                  error={errors.value}
                  required
                />
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-[#080B12]">
                    Data
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="
                        w-full h-[56px] px-4 pr-12
                        rounded-[12px] border border-gray-300
                        text-[14px] text-[#080B12]
                        outline-none focus:border-[#080B12]
                      "
                    />
                    <CalendarIcon />
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <Input
                label="Descrição"
                value={description}
                onChange={setDescription}
                placeholder="EX: Supermercado Semanal"
                error={errors.description}
                required
              />

              {/* Categoria */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[14px] font-medium text-[#080B12]">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(!showNewCategory)}
                    className="text-[12px] font-medium text-[#080B12] hover:underline flex items-center gap-1"
                  >
                    <PlusIcon /> Nova categoria
                  </button>
                </div>
                
                {showNewCategory ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Nome da categoria"
                      className="
                        flex-1 h-[56px] px-4
                        rounded-[12px] border border-gray-300
                        text-[14px] text-[#080B12]
                        outline-none focus:border-[#080B12]
                      "
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="h-[56px] px-4 rounded-[12px] bg-[#080B12] text-white font-medium"
                    >
                      <PlusIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategory(false)
                        setNewCategoryName('')
                      }}
                      className="h-[56px] px-4 rounded-[12px] border border-gray-300 text-gray-600"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ) : (
                  <Select
                    label=""
                    value={category}
                    onChange={setCategory}
                    options={availableCategories.map(c => ({ value: c, label: c }))}
                    placeholder="Selecione a categoria"
                    error={errors.category}
                  />
                )}
              </div>

              {/* Responsável e Conta/Cartão */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Responsável"
                  value={memberId}
                  onChange={setMemberId}
                  options={memberOptions}
                  placeholder="Família (Geral)"
                />
                <Select
                  label="Conta / cartão"
                  value={accountId}
                  onChange={setAccountId}
                  options={accountOptions}
                  placeholder="Selecione..."
                  error={errors.accountId}
                  required
                />
              </div>

              {/* Parcelamento - só aparece para despesa + cartão */}
              {showInstallments && (
                <div className="animate-fade-in">
                  <Select
                    label="Parcelas"
                    value={installments}
                    onChange={handleInstallmentsChange}
                    options={installmentOptions}
                    disabled={isRecurring}
                  />
                  {isRecurring && (
                    <p className="text-[12px] text-gray-500 italic mt-1">
                      Parcelamento desabilitado para despesas recorrentes
                    </p>
                  )}
                </div>
              )}

              {/* Checkbox Despesa Recorrente - só para despesas */}
              {type === 'expense' && (
                <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-4 animate-fade-in">
                  <Checkbox
                    label="Despesa recorrente"
                    description={
                      parseInt(installments) > 1
                        ? "Não disponível para compras parceladas"
                        : "Contas que se repetem todo mês (Netflix, Spotify, Academia, etc)."
                    }
                    checked={isRecurring}
                    onChange={handleRecurringChange}
                    disabled={parseInt(installments) > 1}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-gray-100 bg-white">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="min-w-[180px]">
            Salvar transação
          </Button>
        </div>
      </Modal>

      {/* Toast de sucesso */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
          <div className="flex items-center gap-3 px-6 py-3 bg-[#080B12] text-white rounded-full shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#15BE78">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            <span className="text-[14px] font-medium">Transação registrada com sucesso!</span>
          </div>
        </div>
      )}
    </>
  )
}
