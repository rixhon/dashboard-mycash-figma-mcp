/**
 * Página: Cartões e Contas
 * Gerenciamento de cartões de crédito e contas bancárias
 * 
 * Conforme wireframe:
 * - Header com título e descrição
 * - Seção de Cartões de Crédito com cards horizontais
 * - Seção de Contas Bancárias com cards horizontais
 * - Botões para adicionar novo cartão/conta
 * - Modais de detalhes e adição
 */

import { useState, useCallback } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CreditCard, BankAccount } from '@/types'
import { AddCardModal, CardDetailsModal, NewTransactionModal } from '@/components/modals'

// ============================================================================
// ÍCONES
// ============================================================================

const CardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6ZM4 8H20V6H4V8ZM4 18H20V10H4V18Z" />
  </svg>
)

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
)

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
)

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
// COMPONENTE: CreditCardItem
// ============================================================================

interface CreditCardItemProps {
  card: CreditCard
  onClick: () => void
}

function CreditCardItem({ card, onClick }: CreditCardItemProps) {
  return (
    <div
      onClick={onClick}
      className="
        bg-white
        rounded-[16px]
        border border-gray-200
        p-5
        min-w-[280px]
        cursor-pointer
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-1
      "
    >
      {/* Header do card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Logo do banco (placeholder colorido) */}
          <div className="w-4 h-4 rounded bg-gray-400" />
          <span className="text-[14px] text-gray-600">{card.name}</span>
          <span className="text-[14px] text-gray-400">•••• {card.lastDigits || '****'}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation() }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreIcon />
        </button>
      </div>

      {/* Valor da fatura */}
      <p className="text-[24px] font-bold text-[#080B12] mb-1">
        {formatCurrency(card.currentBill)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-gray-500">
          Vence dia {card.dueDay}
        </span>
        {/* Indicador circular (placeholder) */}
        <div className="w-8 h-8 rounded-full border-2 border-gray-200" />
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE: BankAccountItem
// ============================================================================

interface BankAccountItemProps {
  account: BankAccount
  onClick: () => void
}

function BankAccountItem({ account, onClick }: BankAccountItemProps) {
  return (
    <div
      onClick={onClick}
      className="
        bg-white
        rounded-[16px]
        border border-gray-200
        p-5
        min-w-[280px]
        cursor-pointer
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-1
      "
    >
      {/* Header do card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Logo do banco (placeholder colorido) */}
          <div className="w-4 h-4 rounded bg-gray-400" />
          <span className="text-[14px] text-gray-600">{account.name}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation() }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreIcon />
        </button>
      </div>

      {/* Valor do saldo */}
      <p className="text-[24px] font-bold text-[#080B12] mb-1">
        {formatCurrency(account.balance)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-gray-500">
          Saldo atualizado {formatDate(account.updatedAt)}
        </span>
        {/* Indicador circular (placeholder) */}
        <div className="w-8 h-8 rounded-full border-2 border-gray-200" />
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE: AddNewCard
// ============================================================================

interface AddNewCardProps {
  label: string
  onClick: () => void
}

function AddNewCard({ label, onClick }: AddNewCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        bg-white
        rounded-[16px]
        border-2 border-dashed border-gray-300
        p-5
        min-w-[200px]
        min-h-[140px]
        flex items-center justify-center gap-2
        text-[14px] font-medium text-gray-500
        cursor-pointer
        transition-all duration-200
        hover:border-gray-400 hover:text-gray-700
      "
    >
      <PlusIcon />
      {label}
    </button>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function Cards() {
  const { creditCards, bankAccounts } = useFinance()

  // Estados dos modais
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [addCardType, setAddCardType] = useState<'bankAccount' | 'creditCard'>('creditCard')
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)

  // Handlers
  const handleAddCard = useCallback((type: 'bankAccount' | 'creditCard') => {
    setAddCardType(type)
    setShowAddCardModal(true)
  }, [])

  const handleCardClick = useCallback((card: CreditCard) => {
    setSelectedCard(card)
    setShowCardDetailsModal(true)
  }, [])

  const handleAccountClick = useCallback((account: BankAccount) => {
    // TODO: Implementar modal de detalhes da conta
    console.log('Account clicked:', account)
  }, [])

  const handleAddExpense = useCallback(() => {
    setShowCardDetailsModal(false)
    setShowTransactionModal(true)
  }, [])

  return (
    <>
      <div className="w-full min-h-screen bg-background-secondary">
        <div className="px-[16px] py-[12px] md:px-[24px] lg:px-[32px] lg:py-[24px] flex flex-col gap-[32px]">
          {/* Header da página */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[12px] border border-gray-200 flex items-center justify-center text-gray-600 bg-white">
              <CardIcon />
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-[#080B12]">Cartões</h1>
              <p className="text-[14px] text-gray-500">
                Gerencia seus cartões e contas bancárias
              </p>
            </div>
          </div>

          {/* Seção de Cartões de Crédito */}
          <section>
            <h2 className="text-[20px] font-bold text-[#080B12] mb-4">Cartões</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {creditCards.map((card) => (
                <CreditCardItem
                  key={card.id}
                  card={card}
                  onClick={() => handleCardClick(card)}
                />
              ))}
              <AddNewCard 
                label="Novo cartão" 
                onClick={() => handleAddCard('creditCard')} 
              />
            </div>
          </section>

          {/* Seção de Contas Bancárias */}
          <section>
            <h2 className="text-[20px] font-bold text-[#080B12] mb-4">Contas bancárias</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {bankAccounts.map((account) => (
                <BankAccountItem
                  key={account.id}
                  account={account}
                  onClick={() => handleAccountClick(account)}
                />
              ))}
              <AddNewCard 
                label="Nova conta" 
                onClick={() => handleAddCard('bankAccount')} 
              />
            </div>
          </section>
        </div>
      </div>

      {/* Modais */}
      <AddCardModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        initialType={addCardType}
      />

      <CardDetailsModal
        isOpen={showCardDetailsModal}
        onClose={() => setShowCardDetailsModal(false)}
        card={selectedCard}
        onAddExpense={handleAddExpense}
        onEditCard={() => {
          setShowCardDetailsModal(false)
          setShowAddCardModal(true)
        }}
      />

      <NewTransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />
    </>
  )
}
