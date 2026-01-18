/**
 * Componente: ProximasDespesas
 * Widget de próximas despesas a vencer
 * 
 * Funcionalidades:
 * - Exibe lista cronológica de despesas pendentes (ordenadas por vencimento)
 * - Mostra apenas 5 contas visíveis com carrossel vertical para o restante
 * - Mostra: descrição, data de vencimento, conta/cartão de pagamento, valor
 * - Botão de adicionar nova despesa (abre modal de transação)
 * - Botão de marcar como paga com animação:
 *   - Hover: fundo verde claro, borda verde, ícone verde
 *   - Click: anima botão, remove item com fade out
 *   - Despesas recorrentes: agenda próxima ocorrência para o mês seguinte
 *   - Despesas parceladas: atualiza para próxima parcela
 *   - Despesas únicas: remove da lista
 *   - Exibe mensagem de confirmação
 * - Estado vazio com borda tracejada quando não há pendências
 */

import { useCallback, useState, useRef } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { Bill } from '@/types'
import { AddBillModal } from '@/components/modals'

// ============================================================================
// ÍCONES
// ============================================================================

// Ícone de cartão de crédito para o header
const CreditCardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6ZM4 8H20V6H4V8ZM4 18H20V10H4V18Z" />
  </svg>
)

// Ícone de mais/adicionar
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z" />
  </svg>
)

// Ícone de check (com cor dinâmica)
const CheckIcon = ({ color = '#15BE78' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
)

// Ícone de check circular (estado vazio)
const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#15BE78" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Formata valor monetário brasileiro
 */
function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Formata data de vencimento
 */
function formatDueDate(date: Date | string | number | undefined): string {
  if (!date) return 'Sem data'
  // Se for um número (dueDay), formata como dia do mês
  if (typeof date === 'number') {
    return `Vence dia ${date.toString().padStart(2, '0')}`
  }
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  return `Vence dia ${day}/${month}`
}

/**
 * Retorna nome do método de pagamento baseado no accountId
 * - Conta bancária: "Nubank conta"
 * - Cartão de crédito: "Crédito Nubank **** 5897"
 */
function getPaymentMethodName(
  accountId: string | null,
  creditCards: { id: string; name: string; lastDigits?: string }[],
  bankAccounts: { id: string; name: string }[]
): string {
  if (!accountId) return 'Não definido'
  
  // Procura nos cartões
  const card = creditCards.find(c => c.id === accountId)
  if (card) {
    return `Crédito ${card.name} **** ${card.lastDigits || '****'}`
  }
  
  // Procura nas contas
  const account = bankAccounts.find(a => a.id === accountId)
  if (account) {
    return `${account.name} conta`
  }
  
  return 'Não definido'
}

// ============================================================================
// COMPONENTE: DespesaItemCard
// ============================================================================

interface DespesaItemCardProps {
  bill: Bill
  paymentMethod: string
  onMarkAsPaid: () => void
  isRemoving: boolean
}

function DespesaItemCard({ bill, paymentMethod, onMarkAsPaid, isRemoving }: DespesaItemCardProps) {
  const [isClicked, setIsClicked] = useState(false)

  // Monta descrição com parcela se aplicável
  const description = bill.installments && bill.currentInstallment
    ? `${bill.description} (${bill.currentInstallment}/${bill.installments})`
    : bill.description

  const handleClick = () => {
    setIsClicked(true)
    // Delay para mostrar animação antes de remover
    setTimeout(() => {
      onMarkAsPaid()
    }, 300)
  }

  return (
    <div 
      className={`
        flex items-start justify-between gap-[16px]
        py-[16px]
        border-b border-gray-100 last:border-b-0
        transition-all duration-300 ease-out
        ${isRemoving || isClicked ? 'opacity-0 transform -translate-x-4' : 'opacity-100'}
      `}
    >
      {/* Informações da despesa - lado esquerdo */}
      <div className="flex flex-col gap-[4px] flex-1 min-w-0">
        {/* Título/descrição - texto negrito médio */}
        <p className="text-[16px] font-bold leading-[24px] text-text-primary truncate">
          {description}
        </p>
        {/* Data de vencimento - texto menor cinza escuro */}
        <p className="text-[12px] font-medium leading-[16px] tracking-[0.3px] text-gray-600">
          {formatDueDate(bill.dueDate)}
        </p>
        {/* Conta/cartão - texto pequeno cinza claro */}
        <p className="text-[12px] font-normal leading-[16px] tracking-[0.3px] text-gray-400 truncate">
          {paymentMethod}
        </p>
      </div>
      
      {/* Valor e botão de check - lado direito */}
      <div className="flex flex-col items-end gap-[8px] shrink-0">
        {/* Valor - texto grande negrito */}
        <p className="text-[18px] font-bold leading-[24px] text-text-primary">
          {formatCurrency(bill.value)}
        </p>
        {/* Botão de check - 32px com animação de hover */}
        <button
          onClick={handleClick}
          disabled={isClicked}
          className={`
            w-8 h-8
            rounded-full
            flex items-center justify-center
            transition-all duration-200 ease-out
            cursor-pointer
            ${isClicked 
              ? 'bg-[#15BE78] border-[#15BE78] border-2 scale-110' 
              : 'bg-transparent border border-gray-300 hover:bg-[#E8F8F0] hover:border-[#15BE78]'
            }
          `}
          aria-label="Marcar como pago"
          title="Marcar como pago"
        >
          <CheckIcon color={isClicked ? '#FFFFFF' : '#15BE78'} />
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE: Estado Vazio
// ============================================================================

function EmptyState() {
  return (
    <div 
      className="
        flex flex-col items-center justify-center 
        py-12 px-6
        border-2 border-dashed border-gray-200
        rounded-[16px]
        gap-4
      "
    >
      <CheckCircleIcon />
      <p className="text-[14px] font-medium text-gray-400 text-center">
        Nenhuma despesa pendente
      </p>
    </div>
  )
}

// ============================================================================
// COMPONENTE: Toast de Confirmação
// ============================================================================

interface ToastProps {
  message: string
  isVisible: boolean
}

function Toast({ message, isVisible }: ToastProps) {
  return (
    <div
      className={`
        fixed bottom-6 left-1/2 transform -translate-x-1/2
        px-6 py-3
        bg-[#080B12]
        text-white
        text-[14px] font-medium
        rounded-full
        shadow-lg
        transition-all duration-300 ease-out
        z-50
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      {message}
    </div>
  )
}

// ============================================================================
// CONSTANTES
// ============================================================================

const VISIBLE_ITEMS = 5
const ITEM_HEIGHT = 88 // Altura aproximada de cada item em pixels

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ProximasDespesas() {
  const { 
    getPendingBills, 
    markBillAsPaid, 
    creditCards, 
    bankAccounts 
  } = useFinance()

  // Estado para controlar itens sendo removidos
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())
  
  // Estado para toast de confirmação
  const [showToast, setShowToast] = useState(false)

  // Estado para modal de adicionar despesa
  const [showAddBillModal, setShowAddBillModal] = useState(false)

  // Ref para o container scrollável
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Obtém bills pendentes ordenadas por vencimento
  const pendingBills = getPendingBills()

  // Verifica se precisa de scroll (mais de 5 itens)
  const needsScroll = pendingBills.length > VISIBLE_ITEMS

  // Handler de adicionar despesa
  const handleAddBill = useCallback(() => {
    setShowAddBillModal(true)
  }, [])

  // Handler de marcar como paga
  const handleMarkAsPaid = useCallback((billId: string) => {
    // Adiciona à lista de removendo para animação
    setRemovingIds(prev => new Set(prev).add(billId))
    
    // Executa a remoção após animação
    setTimeout(() => {
      markBillAsPaid(billId)
      setRemovingIds(prev => {
        const next = new Set(prev)
        next.delete(billId)
        return next
      })
      
      // Mostra toast de confirmação
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    }, 300)
  }, [markBillAsPaid])

  return (
    <>
      <div
        className="
          bg-background-primary
          rounded-[20px]
          border border-border-light
          w-full
          min-w-0
          flex-1
          flex flex-col
        "
      >
        <div className="flex flex-col gap-[24px] p-[32px] flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex gap-[8px] items-center">
              <span className="text-text-primary">
                <CreditCardIcon />
              </span>
              <h3 className="text-[20px] font-bold leading-[28px] text-text-primary">
                Próximas despesas
              </h3>
            </div>
            {/* Botão circular 40px com borda clara */}
            <button
              onClick={handleAddBill}
              className="
                w-10 h-10
                flex items-center justify-center
                rounded-full
                border border-gray-200
                bg-white
                text-text-primary
                hover:bg-gray-50
                hover:border-gray-300
                transition-all duration-200
              "
              aria-label="Adicionar despesa"
              title="Adicionar nova transação"
            >
              <PlusIcon />
            </button>
          </div>

          {/* Lista de despesas ou estado vazio */}
          {pendingBills.length > 0 ? (
            <div className="relative">
              {/* Container scrollável com altura máxima para 5 itens */}
              <div
                ref={scrollContainerRef}
                className={`
                  flex flex-col
                  ${needsScroll ? 'overflow-y-auto scrollbar-hide' : ''}
                `}
                style={{
                  maxHeight: needsScroll ? `${VISIBLE_ITEMS * ITEM_HEIGHT}px` : 'auto',
                }}
              >
                {pendingBills.map((bill) => (
                  <DespesaItemCard
                    key={bill.id}
                    bill={bill}
                    paymentMethod={getPaymentMethodName(bill.accountId, creditCards, bankAccounts)}
                    onMarkAsPaid={() => handleMarkAsPaid(bill.id)}
                    isRemoving={removingIds.has(bill.id)}
                  />
                ))}
              </div>

              {/* Indicador de scroll (gradiente na parte inferior) */}
              {needsScroll && (
                <div 
                  className="
                    absolute bottom-0 left-0 right-0 
                    h-8 
                    bg-gradient-to-t from-white to-transparent
                    pointer-events-none
                  "
                />
              )}
            </div>
          ) : (
            <EmptyState />
          )}

          {/* Indicador de quantidade total */}
          {pendingBills.length > VISIBLE_ITEMS && (
            <p className="text-[12px] text-gray-400 text-center">
              Mostrando {VISIBLE_ITEMS} de {pendingBills.length} despesas • Role para ver mais
            </p>
          )}
        </div>
      </div>

      {/* Toast de confirmação */}
      <Toast message="Despesa marcada como paga!" isVisible={showToast} />

      {/* Modal de adicionar despesa */}
      <AddBillModal
        isOpen={showAddBillModal}
        onClose={() => setShowAddBillModal(false)}
      />
    </>
  )
}
