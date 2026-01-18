/**
 * Componente: ExtratoDetalhado
 * Tabela de extrato com busca, filtros e paginação
 * 
 * Funcionalidades:
 * - Busca em tempo real por descrição OU categoria
 * - Filtro por tipo (Todos, Receitas, Despesas)
 * - Respeita filtros globais (membro, período)
 * - Ordenação por data decrescente (mais recente primeiro)
 * - Paginação com 5 itens por página
 * - Navegação inteligente com reticências quando muitas páginas
 * - Estado vazio quando não há resultados
 * - Zebra striping e hover nas linhas
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'

// ============================================================================
// CONSTANTES
// ============================================================================

const ITEMS_PER_PAGE = 5

// ============================================================================
// ÍCONES
// ============================================================================

// Ícone de documento/extrato
const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" />
    <path d="M7 7H17V9H7V7Z" />
    <path d="M7 11H17V13H7V11Z" />
    <path d="M7 15H13V17H7V15Z" />
  </svg>
)

// Ícone de busca
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
  </svg>
)

// Ícone de chevron para baixo
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
  </svg>
)

// Ícone de seta para cima-direita (despesa)
const ExpenseArrowIcon = () => (
  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
    <svg width="12" height="12" viewBox="0 0 16 16" fill="#E61E32">
      <path d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
    </svg>
  </div>
)

// Ícone de seta para baixo-esquerda (receita)
const IncomeArrowIcon = () => (
  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
    <svg width="12" height="12" viewBox="0 0 16 16" fill="#15BE78">
      <path d="M8 4a.5.5 0 0 0-.5.5v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5A.5.5 0 0 0 8 4z" />
    </svg>
  </div>
)

// Ícone de usuário genérico
const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
  </svg>
)

// Ícone de chevron para esquerda
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
  </svg>
)

// Ícone de chevron para direita
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
  </svg>
)

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Formata valor monetário com sinal
 */
function formatValueWithSign(value: number, type: 'income' | 'expense'): string {
  const formatted = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  return type === 'income' ? `+${formatted}` : `-${formatted}`
}

/**
 * Formata data como DD/MM/AAAA
 */
function formatDate(date: Date): string {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Retorna nome da conta/cartão
 */
function getAccountName(
  accountId: string | null,
  creditCards: { id: string; name: string }[],
  bankAccounts: { id: string; name: string }[]
): string {
  if (!accountId) return 'Desconhecido'
  
  const account = bankAccounts.find(a => a.id === accountId)
  if (account) return account.name
  
  const card = creditCards.find(c => c.id === accountId)
  if (card) return card.name
  
  return 'Desconhecido'
}

/**
 * Gera array de páginas para exibição com reticências
 */
function generatePageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []
  
  // Sempre mostra primeira página
  pages.push(1)
  
  if (currentPage > 3) {
    pages.push('...')
  }
  
  // Páginas ao redor da atual
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  
  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }
  
  if (currentPage < totalPages - 2) {
    pages.push('...')
  }
  
  // Sempre mostra última página
  if (!pages.includes(totalPages)) {
    pages.push(totalPages)
  }
  
  return pages
}

// ============================================================================
// TIPOS
// ============================================================================

type FilterType = 'all' | 'income' | 'expense'

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ExtratoDetalhado() {
  const { 
    getFilteredTransactions, 
    familyMembers, 
    creditCards, 
    bankAccounts 
  } = useFinance()

  // Estados locais
  const [localSearch, setLocalSearch] = useState('')
  const [localTypeFilter, setLocalTypeFilter] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  
  // Ref para scroll
  const tableRef = useRef<HTMLDivElement>(null)

  // Obtém transações já filtradas pelos filtros globais
  const globalFilteredTransactions = getFilteredTransactions()

  // Aplica filtros locais e ordenação
  const filteredTransactions = useMemo(() => {
    let result = [...globalFilteredTransactions]

    // Filtro local por tipo
    if (localTypeFilter !== 'all') {
      result = result.filter(tx => tx.type === localTypeFilter)
    }

    // Filtro local por busca (descrição OU categoria)
    if (localSearch.trim()) {
      const searchLower = localSearch.toLowerCase().trim()
      result = result.filter(tx => 
        tx.description.toLowerCase().includes(searchLower) ||
        tx.category.toLowerCase().includes(searchLower)
      )
    }

    // Ordenação por data decrescente (mais recente primeiro)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return result
  }, [globalFilteredTransactions, localTypeFilter, localSearch])

  // Cálculos de paginação
  const totalItems = filteredTransactions.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [localSearch, localTypeFilter, globalFilteredTransactions])

  // Handler de mudança de página
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    // Scroll suave para o topo da tabela
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Handler de busca
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value)
  }, [])

  // Handler de filtro de tipo
  const handleTypeFilterChange = useCallback((type: FilterType) => {
    setLocalTypeFilter(type)
    setShowTypeDropdown(false)
  }, [])

  // Obtém membro pelo ID
  const getMemberInfo = useCallback((memberId: string | null) => {
    if (!memberId) return null
    return familyMembers.find(m => m.id === memberId)
  }, [familyMembers])

  // Labels para o dropdown
  const typeLabels: Record<FilterType, string> = {
    all: 'Todos',
    income: 'Receitas',
    expense: 'Despesas',
  }

  return (
    <div
      ref={tableRef}
      className="
        bg-background-primary
        rounded-[20px]
        border border-border-light
        w-full
      "
    >
      <div className="flex flex-col gap-[32px] p-[32px]">
        {/* Header */}
        <div className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-[8px] items-center">
            <DocumentIcon />
            <h3 className="text-[20px] font-bold leading-[28px] text-text-primary">
              Extrato detalhado
            </h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-[16px] items-stretch sm:items-center">
            {/* Campo de busca - 256px desktop, 100% mobile */}
            <div className="relative w-full sm:w-[256px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Buscar lançamentos..."
                className="
                  w-full
                  pl-10 pr-4 py-3
                  rounded-full
                  border border-gray-300
                  bg-white
                  text-[14px] text-text-primary
                  placeholder:text-gray-400
                  focus:outline-none focus:border-gray-500
                  transition-colors
                "
              />
            </div>
            
            {/* Filtro de tipo - 140px desktop, 100% mobile */}
            <div className="relative w-full sm:w-[140px]">
              <button 
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="
                  w-full
                  flex gap-[8px] items-center justify-between
                  px-4 py-3
                  rounded-full
                  border border-gray-300
                  bg-white
                  text-text-primary
                  hover:border-gray-400
                  transition-colors
                "
              >
                <span className="text-[14px] font-medium">{typeLabels[localTypeFilter]}</span>
                <ChevronDownIcon />
              </button>
              
              {/* Dropdown */}
              {showTypeDropdown && (
                <div className="
                  absolute top-full left-0 right-0 mt-2
                  bg-white
                  border border-gray-200
                  rounded-xl
                  shadow-lg
                  z-10
                  overflow-hidden
                ">
                  {(['all', 'income', 'expense'] as FilterType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeFilterChange(type)}
                      className={`
                        w-full px-4 py-3 text-left
                        text-[14px]
                        transition-colors
                        ${localTypeFilter === type 
                          ? 'bg-gray-100 font-medium text-text-primary' 
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {typeLabels[type]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="w-full overflow-x-auto">
          {/* Header da tabela - fundo cinza claro */}
          <div className="grid grid-cols-7 gap-[16px] lg:gap-[32px] py-[16px] px-[16px] bg-gray-50 rounded-t-lg border border-gray-200 min-w-[900px]">
            <span className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-gray-500 uppercase w-[50px]">Membro</span>
            <span className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-gray-500 uppercase">Data</span>
            <span className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-gray-500 uppercase">Descrição</span>
            <span className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-gray-500 uppercase">Categoria</span>
            <span className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-gray-500 uppercase">Conta/Cartão</span>
            <span className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-gray-500 uppercase">Parcelas</span>
            <span className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-gray-500 uppercase text-right">Valor</span>
          </div>

          {/* Linhas da tabela ou estado vazio */}
          <div className="border-x border-b border-gray-200 rounded-b-lg overflow-hidden min-w-[900px]">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx, index) => {
                const member = getMemberInfo(tx.memberId)
                const accountName = getAccountName(tx.accountId, creditCards, bankAccounts)
                const isEven = index % 2 === 0

                return (
                  <div
                    key={tx.id}
                    className={`
                      grid grid-cols-7 gap-[16px] lg:gap-[32px] py-[16px] px-[16px] items-center
                      transition-colors duration-150
                      ${isEven ? 'bg-white' : 'bg-gray-50/50'}
                      hover:bg-gray-100
                    `}
                  >
                    {/* Avatar do membro - 24px */}
                    <div className="w-[50px]">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-400">
                        {member?.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon />
                        )}
                      </div>
                    </div>

                    {/* Data - DD/MM/AAAA */}
                    <span className="text-[12px] font-normal leading-[16px] text-gray-500">
                      {formatDate(tx.date)}
                    </span>

                    {/* Descrição com ícone */}
                    <div className="flex gap-[8px] items-center">
                      {tx.type === 'income' ? <IncomeArrowIcon /> : <ExpenseArrowIcon />}
                      <span className="text-[12px] font-bold leading-[16px] tracking-[0.3px] text-text-primary truncate">
                        {tx.description}
                      </span>
                    </div>

                    {/* Categoria - badge */}
                    <div>
                      <span className="
                        inline-block
                        px-3 py-1
                        bg-gray-100
                        rounded-full
                        text-[11px] font-medium text-gray-600
                      ">
                        {tx.category}
                      </span>
                    </div>

                    {/* Conta/cartão */}
                    <span className="text-[12px] font-normal leading-[16px] text-gray-500">
                      {accountName}
                    </span>

                    {/* Parcelas */}
                    <span className="text-[12px] font-normal leading-[16px] text-gray-500">
                      {tx.installments > 1 ? `${tx.installments}x` : '-'}
                    </span>

                    {/* Valor - alinhado à direita com sinal */}
                    <span className={`
                      text-[12px] font-bold leading-[16px] text-right
                      ${tx.type === 'income' ? 'text-[#15BE78]' : 'text-text-primary'}
                    `}>
                      {formatValueWithSign(tx.value, tx.type)}
                    </span>
                  </div>
                )
              })
            ) : (
              /* Estado vazio */
              <div className="flex items-center justify-center h-[96px] text-gray-400 text-[14px]">
                Nenhum lançamento encontrado.
              </div>
            )}
          </div>
        </div>

        {/* Paginação */}
        {totalItems > 0 && (
          <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
            {/* Contador */}
            <span className="text-[14px] font-normal leading-[20px] text-gray-500">
              Mostrando {startIndex + 1} a {endIndex} de {totalItems}
            </span>

            {/* Controles de navegação */}
            <div className="flex gap-[4px] items-center">
              {/* Botão anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
                  w-8 h-8
                  flex items-center justify-center
                  rounded-full
                  transition-all duration-200
                  ${currentPage === 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
                aria-label="Página anterior"
              >
                <ChevronLeftIcon />
              </button>

              {/* Números das páginas */}
              {generatePageNumbers(currentPage, totalPages).map((page, index) => (
                typeof page === 'number' ? (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`
                      w-8 h-8
                      flex items-center justify-center
                      text-[14px] font-medium
                      rounded-full
                      transition-all duration-200
                      ${page === currentPage
                        ? 'bg-[#080B12] text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                      }
                    `}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="w-8 h-8 flex items-center justify-center text-gray-400">
                    ...
                  </span>
                )
              ))}

              {/* Botão próximo */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
                  w-8 h-8
                  flex items-center justify-center
                  rounded-full
                  transition-all duration-200
                  ${currentPage === totalPages 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
                aria-label="Próxima página"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
