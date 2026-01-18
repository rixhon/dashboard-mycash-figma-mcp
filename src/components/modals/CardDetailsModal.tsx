/**
 * Componente: CardDetailsModal
 * Modal para exibir detalhes completos de um cartão de crédito
 * 
 * Conforme PROMPT 15:
 * - Informações do cartão (limite, fatura, disponível, percentual de uso)
 * - Gráfico donut de uso do limite
 * - Lista de despesas vinculadas ao cartão
 * - Botões de ação (ver extrato, adicionar despesa, editar)
 */

import { useState, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CreditCard } from '@/types'
import Modal, { 
  ModalHeader, 
  ModalContent, 
  Button
} from './Modal'

// ============================================================================
// ÍCONES
// ============================================================================

const CardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6ZM4 8H20V6H4V8ZM4 18H20V10H4V18Z" />
  </svg>
)

// ============================================================================
// TIPOS
// ============================================================================

interface CardDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  card: CreditCard | null
  onAddExpense?: () => void
  onEditCard?: () => void
}

// ============================================================================
// HELPERS
// ============================================================================

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

// ============================================================================
// COMPONENTE: DonutChart
// ============================================================================

interface DonutChartProps {
  percentage: number
  size?: number
}

function DonutChart({ percentage, size = 120 }: DonutChartProps) {
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={percentage > 80 ? '#EF4444' : percentage > 50 ? '#F59E0B' : '#15BE78'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[24px] font-bold text-[#080B12]">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE: InfoCard
// ============================================================================

interface InfoCardProps {
  label: string
  value: string
  highlight?: boolean
}

function InfoCard({ label, value, highlight = false }: InfoCardProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] text-gray-500">{label}</span>
      <span className={`text-[16px] font-bold ${highlight ? 'text-[#15BE78]' : 'text-[#080B12]'}`}>
        {value}
      </span>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function CardDetailsModal({ 
  isOpen, 
  onClose, 
  card,
  onAddExpense,
  onEditCard,
}: CardDetailsModalProps) {
  const { getTransactionsByCard } = useFinance()
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // Calcula métricas do cartão
  const metrics = useMemo(() => {
    if (!card) return null
    
    const available = card.limit - card.currentBill
    const usagePercentage = (card.currentBill / card.limit) * 100
    
    return {
      limit: card.limit,
      currentBill: card.currentBill,
      available,
      usagePercentage,
    }
  }, [card])

  // Busca despesas do cartão
  const expenses = useMemo(() => {
    if (!card) return []
    return getTransactionsByCard(card.id)
      .filter(tx => tx.type === 'expense')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [card, getTransactionsByCard])

  // Paginação
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return expenses.slice(start, start + ITEMS_PER_PAGE)
  }, [expenses, currentPage])

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE)

  if (!card || !metrics) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="centered" className="max-w-[700px]">
      {/* Header */}
      <ModalHeader onClose={onClose}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <CardIcon />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#080B12]">{card.name}</h2>
            {card.lastDigits && (
              <p className="text-[14px] text-gray-500">•••• {card.lastDigits}</p>
            )}
          </div>
        </div>
      </ModalHeader>

      {/* Conteúdo */}
      <ModalContent className="bg-gray-50 p-0">
        {/* Seção de métricas */}
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Gráfico Donut */}
            <DonutChart percentage={metrics.usagePercentage} />
            
            {/* Grid de informações */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <InfoCard label="Limite total" value={formatCurrency(metrics.limit)} />
              <InfoCard label="Fatura atual" value={formatCurrency(metrics.currentBill)} />
              <InfoCard label="Disponível" value={formatCurrency(metrics.available)} highlight />
              <InfoCard label="Uso do limite" value={`${metrics.usagePercentage.toFixed(1)}%`} />
              <InfoCard label="Fechamento" value={`Dia ${card.closingDay}`} />
              <InfoCard label="Vencimento" value={`Dia ${card.dueDay}`} />
            </div>
          </div>
        </div>

        {/* Seção de despesas */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#080B12]">
              Despesas do cartão
            </h3>
            <span className="text-[12px] text-gray-500">
              {expenses.length} transações
            </span>
          </div>

          {expenses.length > 0 ? (
            <>
              {/* Tabela de despesas */}
              <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase">Data</th>
                      <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase">Descrição</th>
                      <th className="text-left px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase hidden sm:table-cell">Categoria</th>
                      <th className="text-right px-4 py-3 text-[12px] font-semibold text-gray-500 uppercase">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedExpenses.map((tx, index) => (
                      <tr 
                        key={tx.id}
                        className={`
                          border-b border-gray-100 last:border-b-0
                          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                          hover:bg-gray-100 transition-colors
                        `}
                      >
                        <td className="px-4 py-3 text-[14px] text-gray-600">
                          {formatDate(new Date(tx.date))}
                        </td>
                        <td className="px-4 py-3 text-[14px] font-medium text-[#080B12]">
                          {tx.description}
                          {(tx.installments || tx.total_installments || 1) > 1 && (
                            <span className="text-gray-500 ml-1">
                              ({tx.installmentNumber || tx.installment_number || 1}/{tx.installments || tx.total_installments})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="px-2 py-1 text-[12px] bg-gray-100 text-gray-600 rounded-full">
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[14px] font-bold text-[#080B12] text-right">
                          {formatCurrency(tx.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-[14px] rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-[14px] text-gray-600">
                    {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-[14px] rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-[12px] border border-gray-200 p-8 text-center">
              <p className="text-[14px] text-gray-500">
                Nenhuma despesa registrada neste cartão ainda.
              </p>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="p-6 pt-0 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={onAddExpense} className="flex-1 sm:flex-none">
            Adicionar Despesa
          </Button>
          <Button variant="secondary" onClick={onEditCard} className="flex-1 sm:flex-none">
            Editar Cartão
          </Button>
          <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none">
            Fechar
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}
