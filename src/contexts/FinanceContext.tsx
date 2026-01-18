/**
 * FinanceContext - Gerenciamento de Estado Global
 * 
 * Este contexto é o coração do sistema mycash+, responsável por:
 * - Armazenar todas as entidades principais (transactions, goals, creditCards, bankAccounts, familyMembers)
 * - Gerenciar filtros globais (membro selecionado, período, tipo de transação, busca)
 * - Fornecer funções CRUD para todas as entidades
 * - Calcular métricas derivadas (saldo total, receitas, despesas, percentuais)
 * 
 * ⚠️ IMPORTANTE: Este sistema NÃO usa localStorage/sessionStorage.
 * Todo estado é mantido em memória via React state.
 * Dados são perdidos ao recarregar a página (até integração com Supabase).
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import {
  Transaction,
  Goal,
  CreditCard,
  BankAccount,
  FamilyMember,
  Bill,
} from '@/types'

// ============================================================================
// TIPOS DO CONTEXTO
// ============================================================================

/**
 * Filtro de período (datas)
 */
interface DateRange {
  startDate: Date
  endDate: Date
}

/**
 * Tipo de filtro de transação
 */
type TransactionFilterType = 'all' | 'income' | 'expense'

/**
 * Estado dos filtros globais
 */
interface FiltersState {
  selectedMember: string | null
  dateRange: DateRange
  transactionType: TransactionFilterType
  searchText: string
}

/**
 * Despesa agrupada por categoria
 */
interface ExpenseByCategory {
  category: string
  total: number
  percentage: number
  count: number
}

/**
 * Gasto agrupado por membro da família
 */
interface ExpenseByMember {
  memberId: string | null
  memberName: string
  total: number
  percentage: number
  count: number
}

/**
 * Interface completa do contexto
 */
interface FinanceContextType {
  // ===== ESTADO PRINCIPAL =====
  transactions: Transaction[]
  goals: Goal[]
  creditCards: CreditCard[]
  bankAccounts: BankAccount[]
  familyMembers: FamilyMember[]
  bills: Bill[]

  // ===== FILTROS =====
  filters: FiltersState
  setSelectedMember: (memberId: string | null) => void
  setDateRange: (range: DateRange) => void
  setTransactionType: (type: TransactionFilterType) => void
  setSearchText: (text: string) => void
  resetFilters: () => void

  // ===== CRUD: TRANSACTIONS =====
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  // ===== CRUD: GOALS =====
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  // ===== CRUD: CREDIT CARDS =====
  addCreditCard: (card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCreditCard: (id: string, updates: Partial<CreditCard>) => void
  deleteCreditCard: (id: string) => void

  // ===== CRUD: BANK ACCOUNTS =====
  addBankAccount: (account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => void
  deleteBankAccount: (id: string) => void

  // ===== CRUD: FAMILY MEMBERS =====
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void
  deleteFamilyMember: (id: string) => void

  // ===== CRUD: BILLS =====
  addBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBill: (id: string, updates: Partial<Bill>) => void
  deleteBill: (id: string) => void
  markBillAsPaid: (id: string) => void
  getPendingBills: () => Bill[]

  // ===== CÁLCULOS DERIVADOS =====
  getFilteredTransactions: () => Transaction[]
  calculateTotalBalance: () => number
  calculateIncomeForPeriod: () => number
  calculateExpensesForPeriod: () => number
  calculateExpensesByCategory: () => ExpenseByCategory[]
  calculateExpensesByMember: () => ExpenseByMember[]
  calculateCategoryPercentage: (category: string) => number
  calculateSavingsRate: () => number

  // ===== HELPERS =====
  getMemberById: (id: string) => FamilyMember | undefined
  getAccountById: (id: string) => BankAccount | CreditCard | undefined
  getCardById: (id: string) => CreditCard | undefined
  getTransactionsByCard: (cardId: string) => Transaction[]
}

// ============================================================================
// DADOS MOCK INICIAIS
// ============================================================================

/**
 * Gera um ID único simples
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Membros da família brasileira
 */
const initialFamilyMembers: FamilyMember[] = [
  {
    id: 'member-1',
    name: 'Lucas Martins',
    role: 'Pai',
    email: 'lucas.martins@email.com',
    monthlyIncome: 12000,
    avatarUrl: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'member-2',
    name: 'Ana Martins',
    role: 'Mãe',
    email: 'ana.martins@email.com',
    monthlyIncome: 8000,
    avatarUrl: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'member-3',
    name: 'Pedro Martins',
    role: 'Filho',
    email: 'pedro.martins@email.com',
    monthlyIncome: 2500,
    avatarUrl: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

/**
 * Cartões de crédito de bancos brasileiros conhecidos
 */
const initialCreditCards: CreditCard[] = [
  {
    id: 'card-1',
    name: 'Nubank',
    holderId: 'member-1',
    closingDay: 10,
    dueDay: 17,
    limit: 15000,
    currentBill: 2340,
    theme: 'black',
    lastDigits: '5897',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'card-2',
    name: 'Inter',
    holderId: 'member-2',
    closingDay: 15,
    dueDay: 22,
    limit: 10000,
    currentBill: 1850,
    theme: 'white',
    lastDigits: '4521',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'card-3',
    name: 'Picpay',
    holderId: 'member-3',
    closingDay: 5,
    dueDay: 12,
    limit: 5000,
    currentBill: 890,
    theme: 'lime',
    lastDigits: '7823',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

/**
 * Contas bancárias
 */
const initialBankAccounts: BankAccount[] = [
  {
    id: 'account-1',
    name: 'Nubank Conta',
    holderId: 'member-1',
    balance: 8500,
    bankName: 'Nubank',
    accountNumber: '****5897',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'account-2',
    name: 'Inter Conta',
    holderId: 'member-2',
    balance: 4200,
    bankName: 'Inter',
    accountNumber: '****4521',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'account-3',
    name: 'Picpay Conta',
    holderId: 'member-3',
    balance: 1800,
    bankName: 'Picpay',
    accountNumber: '****7823',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

/**
 * Contas/Bills pendentes (próximas despesas)
 * Ordenadas por data de vencimento
 */
const generateInitialBills = (): Bill[] => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return [
    {
      id: 'bill-1',
      description: 'Conta de Luz',
      value: 154,
      dueDate: new Date(currentYear, currentMonth, 21),
      type: 'fixed',
      status: 'pending',
      accountId: 'card-1',
      isRecurring: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'bill-2',
      description: 'Conta de Água',
      value: 98,
      dueDate: new Date(currentYear, currentMonth, 25),
      type: 'fixed',
      status: 'pending',
      accountId: 'card-1',
      isRecurring: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'bill-3',
      description: 'Internet Vivo Fibra',
      value: 120,
      dueDate: new Date(currentYear, currentMonth, 15),
      type: 'fixed',
      status: 'pending',
      accountId: 'account-1',
      isRecurring: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'bill-4',
      description: 'Netflix',
      value: 55,
      dueDate: new Date(currentYear, currentMonth, 10),
      type: 'fixed',
      status: 'pending',
      accountId: 'card-1',
      isRecurring: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'bill-5',
      description: 'Spotify Família',
      value: 34,
      dueDate: new Date(currentYear, currentMonth, 10),
      type: 'fixed',
      status: 'pending',
      accountId: 'card-1',
      isRecurring: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'bill-6',
      description: 'Fatura Nubank',
      value: 2340,
      dueDate: new Date(currentYear, currentMonth, 17),
      type: 'card',
      status: 'pending',
      accountId: 'card-1',
      isRecurring: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'bill-7',
      description: 'Fatura Inter',
      value: 1850,
      dueDate: new Date(currentYear, currentMonth, 22),
      type: 'card',
      status: 'pending',
      accountId: 'card-2',
      isRecurring: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'bill-8',
      description: 'Roupas - Shopping',
      value: 150,
      dueDate: new Date(currentYear, currentMonth, 22),
      type: 'fixed',
      status: 'pending',
      accountId: 'card-2',
      isRecurring: false,
      installments: 3,
      currentInstallment: 2,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ]
}

/**
 * Objetivos/Metas variados
 */
const initialGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Reserva de Emergência',
    description: '6 meses de despesas para segurança financeira',
    targetAmount: 60000,
    currentAmount: 25000,
    deadline: new Date('2025-12-31'),
    category: 'Segurança',
    memberId: null,
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'goal-2',
    title: 'Viagem para Europa',
    description: 'Férias em família para Portugal e Espanha',
    targetAmount: 35000,
    currentAmount: 12000,
    deadline: new Date('2025-07-01'),
    category: 'Lazer',
    memberId: null,
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'goal-3',
    title: 'Notebook Novo',
    description: 'MacBook Pro para trabalho',
    targetAmount: 15000,
    currentAmount: 8500,
    deadline: new Date('2025-03-01'),
    category: 'Tecnologia',
    memberId: 'member-1',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'goal-4',
    title: 'Curso de Inglês',
    description: 'Curso intensivo de inglês para Pedro',
    targetAmount: 5000,
    currentAmount: 2000,
    deadline: new Date('2025-06-01'),
    category: 'Educação',
    memberId: 'member-3',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

/**
 * Categorias padrão brasileiras
 */
const CATEGORIES = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  expense: [
    'Aluguel',
    'Alimentação',
    'Mercado',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Vestuário',
    'Manutenção',
    'Assinaturas',
    'Academia',
    'Pets',
    'Outros',
  ],
}

/**
 * Gera transações mock distribuídas nos últimos 3 meses
 */
const generateInitialTransactions = (): Transaction[] => {
  const transactions: Transaction[] = []
  const now = new Date()
  
  // Helper para criar data no passado
  const daysAgo = (days: number): Date => {
    const date = new Date(now)
    date.setDate(date.getDate() - days)
    return date
  }

  // ===== RECEITAS =====
  
  // Salários mensais
  transactions.push(
    {
      id: 'tx-1',
      type: 'income',
      value: 12000,
      description: 'Salário - Lucas',
      category: 'Salário',
      date: daysAgo(5),
      accountId: 'account-1',
      memberId: 'member-1',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      id: 'tx-2',
      type: 'income',
      value: 8000,
      description: 'Salário - Ana',
      category: 'Salário',
      date: daysAgo(5),
      accountId: 'account-2',
      memberId: 'member-2',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      id: 'tx-3',
      type: 'income',
      value: 2500,
      description: 'Estágio - Pedro',
      category: 'Salário',
      date: daysAgo(5),
      accountId: 'account-3',
      memberId: 'member-3',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      id: 'tx-4',
      type: 'income',
      value: 3500,
      description: 'Freelance - Projeto Web',
      category: 'Freelance',
      date: daysAgo(15),
      accountId: 'account-1',
      memberId: 'member-1',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(15),
      updatedAt: daysAgo(15),
    },
    {
      id: 'tx-5',
      type: 'income',
      value: 850,
      description: 'Dividendos - Ações',
      category: 'Investimentos',
      date: daysAgo(20),
      accountId: 'account-1',
      memberId: 'member-1',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(20),
      updatedAt: daysAgo(20),
    },
  )

  // ===== DESPESAS =====
  
  // Aluguel
  transactions.push({
    id: 'tx-6',
    type: 'expense',
    value: 4000,
    description: 'Aluguel do apartamento',
    category: 'Aluguel',
    date: daysAgo(3),
    accountId: 'account-1',
    memberId: null,
    installments: 1,
    currentInstallment: 1,
    status: 'completed',
    isRecurring: true,
    isPaid: true,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  })

  // Alimentação
  transactions.push(
    {
      id: 'tx-7',
      type: 'expense',
      value: 450,
      description: 'Restaurante Japonês',
      category: 'Alimentação',
      date: daysAgo(2),
      accountId: 'card-1',
      memberId: 'member-1',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
    {
      id: 'tx-8',
      type: 'expense',
      value: 180,
      description: 'iFood - Semana',
      category: 'Alimentação',
      date: daysAgo(7),
      accountId: 'card-2',
      memberId: 'member-2',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
    {
      id: 'tx-9',
      type: 'expense',
      value: 95,
      description: 'Lanche na faculdade',
      category: 'Alimentação',
      date: daysAgo(4),
      accountId: 'card-3',
      memberId: 'member-3',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
    },
  )

  // Mercado
  transactions.push(
    {
      id: 'tx-10',
      type: 'expense',
      value: 850,
      description: 'Compras do mês - Carrefour',
      category: 'Mercado',
      date: daysAgo(10),
      accountId: 'card-1',
      memberId: 'member-2',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(10),
      updatedAt: daysAgo(10),
    },
    {
      id: 'tx-11',
      type: 'expense',
      value: 320,
      description: 'Feira da semana',
      category: 'Mercado',
      date: daysAgo(6),
      accountId: 'account-2',
      memberId: 'member-2',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(6),
      updatedAt: daysAgo(6),
    },
  )

  // Transporte
  transactions.push(
    {
      id: 'tx-12',
      type: 'expense',
      value: 350,
      description: 'Combustível - Gasolina',
      category: 'Transporte',
      date: daysAgo(8),
      accountId: 'card-1',
      memberId: 'member-1',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(8),
      updatedAt: daysAgo(8),
    },
    {
      id: 'tx-13',
      type: 'expense',
      value: 180,
      description: 'Uber - Mês',
      category: 'Transporte',
      date: daysAgo(12),
      accountId: 'card-3',
      memberId: 'member-3',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(12),
    },
  )

  // Saúde
  transactions.push(
    {
      id: 'tx-14',
      type: 'expense',
      value: 890,
      description: 'Plano de saúde familiar',
      category: 'Saúde',
      date: daysAgo(5),
      accountId: 'account-1',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      id: 'tx-15',
      type: 'expense',
      value: 250,
      description: 'Farmácia',
      category: 'Saúde',
      date: daysAgo(14),
      accountId: 'card-2',
      memberId: 'member-2',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(14),
      updatedAt: daysAgo(14),
    },
  )

  // Educação
  transactions.push(
    {
      id: 'tx-16',
      type: 'expense',
      value: 1200,
      description: 'Mensalidade faculdade - Pedro',
      category: 'Educação',
      date: daysAgo(5),
      accountId: 'account-1',
      memberId: 'member-3',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      id: 'tx-17',
      type: 'expense',
      value: 350,
      description: 'Curso online - Udemy',
      category: 'Educação',
      date: daysAgo(25),
      accountId: 'card-1',
      memberId: 'member-1',
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(25),
      updatedAt: daysAgo(25),
    },
  )

  // Lazer
  transactions.push(
    {
      id: 'tx-18',
      type: 'expense',
      value: 280,
      description: 'Cinema + Pipoca',
      category: 'Lazer',
      date: daysAgo(9),
      accountId: 'card-2',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(9),
      updatedAt: daysAgo(9),
    },
    {
      id: 'tx-19',
      type: 'expense',
      value: 750,
      description: 'Passeio no parque aquático',
      category: 'Lazer',
      date: daysAgo(18),
      accountId: 'card-1',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: false,
      isPaid: true,
      createdAt: daysAgo(18),
      updatedAt: daysAgo(18),
    },
  )

  // Assinaturas
  transactions.push(
    {
      id: 'tx-20',
      type: 'expense',
      value: 55,
      description: 'Netflix',
      category: 'Assinaturas',
      date: daysAgo(5),
      accountId: 'card-1',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      id: 'tx-21',
      type: 'expense',
      value: 34,
      description: 'Spotify Família',
      category: 'Assinaturas',
      date: daysAgo(5),
      accountId: 'card-1',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      id: 'tx-22',
      type: 'expense',
      value: 22,
      description: 'Amazon Prime',
      category: 'Assinaturas',
      date: daysAgo(5),
      accountId: 'card-2',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
  )

  // Academia
  transactions.push({
    id: 'tx-23',
    type: 'expense',
    value: 120,
    description: 'Academia Smart Fit',
    category: 'Academia',
    date: daysAgo(5),
    accountId: 'card-3',
    memberId: 'member-3',
    installments: 1,
    currentInstallment: 1,
    status: 'completed',
    isRecurring: true,
    isPaid: true,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  })

  // Manutenção
  transactions.push(
    {
      id: 'tx-24',
      type: 'expense',
      value: 150,
      description: 'Conta de luz',
      category: 'Manutenção',
      date: daysAgo(3),
      accountId: 'account-1',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
    {
      id: 'tx-25',
      type: 'expense',
      value: 100,
      description: 'Conta de água',
      category: 'Manutenção',
      date: daysAgo(3),
      accountId: 'account-1',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
    {
      id: 'tx-26',
      type: 'expense',
      value: 120,
      description: 'Internet Vivo Fibra',
      category: 'Manutenção',
      date: daysAgo(5),
      accountId: 'account-1',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'completed',
      isRecurring: true,
      isPaid: true,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
  )

  // Vestuário
  transactions.push({
    id: 'tx-27',
    type: 'expense',
    value: 450,
    description: 'Roupas - Shopping',
    category: 'Vestuário',
    date: daysAgo(22),
    accountId: 'card-2',
    memberId: 'member-2',
    installments: 3,
    currentInstallment: 1,
    status: 'completed',
    isRecurring: false,
    isPaid: true,
    createdAt: daysAgo(22),
    updatedAt: daysAgo(22),
  })

  // Pets
  transactions.push({
    id: 'tx-28',
    type: 'expense',
    value: 280,
    description: 'Ração e petiscos - Cachorro',
    category: 'Pets',
    date: daysAgo(11),
    accountId: 'card-2',
    memberId: null,
    installments: 1,
    currentInstallment: 1,
    status: 'completed',
    isRecurring: false,
    isPaid: true,
    createdAt: daysAgo(11),
    updatedAt: daysAgo(11),
  })

  // Despesas pendentes (próximas)
  transactions.push(
    {
      id: 'tx-29',
      type: 'expense',
      value: 154,
      description: 'Conta de Luz - Próxima',
      category: 'Manutenção',
      date: new Date(now.getFullYear(), now.getMonth(), 21),
      accountId: 'card-1',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'pending',
      isRecurring: true,
      isPaid: false,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
    {
      id: 'tx-30',
      type: 'expense',
      value: 98,
      description: 'Conta de Água - Próxima',
      category: 'Manutenção',
      date: new Date(now.getFullYear(), now.getMonth(), 25),
      accountId: 'card-1',
      memberId: null,
      installments: 1,
      currentInstallment: 1,
      status: 'pending',
      isRecurring: true,
      isPaid: false,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
  )

  return transactions
}

// ============================================================================
// CONTEXTO E PROVIDER
// ============================================================================

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

interface FinanceProviderProps {
  children: ReactNode
}

/**
 * Provider principal do sistema financeiro
 * Gerencia todo o estado global da aplicação
 */
export function FinanceProvider({ children }: FinanceProviderProps) {
  // ===== ESTADO PRINCIPAL =====
  const [transactions, setTransactions] = useState<Transaction[]>(generateInitialTransactions)
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [creditCards, setCreditCards] = useState<CreditCard[]>(initialCreditCards)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers)
  const [bills, setBills] = useState<Bill[]>(generateInitialBills)

  // ===== ESTADO DOS FILTROS =====
  const [filters, setFilters] = useState<FiltersState>(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    return {
      selectedMember: null,
      dateRange: {
        startDate: startOfMonth,
        endDate: endOfMonth,
      },
      transactionType: 'all',
      searchText: '',
    }
  })

  // ===== FUNÇÕES DE FILTRO =====
  const setSelectedMember = useCallback((memberId: string | null) => {
    setFilters(prev => ({ ...prev, selectedMember: memberId }))
  }, [])

  const setDateRange = useCallback((range: DateRange) => {
    setFilters(prev => ({ ...prev, dateRange: range }))
  }, [])

  const setTransactionType = useCallback((type: TransactionFilterType) => {
    setFilters(prev => ({ ...prev, transactionType: type }))
  }, [])

  const setSearchText = useCallback((text: string) => {
    setFilters(prev => ({ ...prev, searchText: text }))
  }, [])

  const resetFilters = useCallback(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setFilters({
      selectedMember: null,
      dateRange: { startDate: startOfMonth, endDate: endOfMonth },
      transactionType: 'all',
      searchText: '',
    })
  }, [])

  // ===== CRUD: TRANSACTIONS =====
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setTransactions(prev => [...prev, newTransaction])
  }, [])

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id ? { ...tx, ...updates, updatedAt: new Date() } : tx
      )
    )
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }, [])

  // ===== CRUD: GOALS =====
  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newGoal: Goal = {
      ...goal,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setGoals(prev => [...prev, newGoal])
  }, [])

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals(prev =>
      prev.map(g =>
        g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
      )
    )
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }, [])

  // ===== CRUD: CREDIT CARDS =====
  const addCreditCard = useCallback((card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newCard: CreditCard = {
      ...card,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setCreditCards(prev => [...prev, newCard])
  }, [])

  const updateCreditCard = useCallback((id: string, updates: Partial<CreditCard>) => {
    setCreditCards(prev =>
      prev.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
      )
    )
  }, [])

  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards(prev => prev.filter(c => c.id !== id))
  }, [])

  // ===== CRUD: BANK ACCOUNTS =====
  const addBankAccount = useCallback((account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newAccount: BankAccount = {
      ...account,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setBankAccounts(prev => [...prev, newAccount])
  }, [])

  const updateBankAccount = useCallback((id: string, updates: Partial<BankAccount>) => {
    setBankAccounts(prev =>
      prev.map(a =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
      )
    )
  }, [])

  const deleteBankAccount = useCallback((id: string) => {
    setBankAccounts(prev => prev.filter(a => a.id !== id))
  }, [])

  // ===== CRUD: FAMILY MEMBERS =====
  const addFamilyMember = useCallback((member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newMember: FamilyMember = {
      ...member,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setFamilyMembers(prev => [...prev, newMember])
  }, [])

  const updateFamilyMember = useCallback((id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers(prev =>
      prev.map(m =>
        m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m
      )
    )
  }, [])

  const deleteFamilyMember = useCallback((id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id))
  }, [])

  // ===== CRUD: BILLS =====
  const addBill = useCallback((bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newBill: Bill = {
      ...bill,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setBills(prev => [...prev, newBill])
  }, [])

  const updateBill = useCallback((id: string, updates: Partial<Bill>) => {
    setBills(prev =>
      prev.map(b =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
      )
    )
  }, [])

  const deleteBill = useCallback((id: string) => {
    setBills(prev => prev.filter(b => b.id !== id))
  }, [])

  /**
   * Marca uma conta como paga
   * - Para contas recorrentes: agenda próxima ocorrência para o mês seguinte
   * - Para contas parceladas: atualiza para próxima parcela
   * - Para contas únicas: remove da lista
   */
  const markBillAsPaid = useCallback((id: string) => {
    setBills(prev => {
      const bill = prev.find(b => b.id === id)
      if (!bill) return prev

      // Se é recorrente, cria nova bill para o próximo mês
      if (bill.isRecurring) {
        const nextDueDate = new Date(bill.dueDate)
        nextDueDate.setMonth(nextDueDate.getMonth() + 1)
        
        const newBill: Bill = {
          ...bill,
          id: generateId(),
          dueDate: nextDueDate,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        // Remove a atual e adiciona a próxima
        return [...prev.filter(b => b.id !== id), newBill]
      }

      // Se é parcelada e ainda tem parcelas
      if (bill.installments && bill.currentInstallment && bill.currentInstallment < bill.installments) {
        const nextDueDate = new Date(bill.dueDate)
        nextDueDate.setMonth(nextDueDate.getMonth() + 1)
        
        const newBill: Bill = {
          ...bill,
          id: generateId(),
          dueDate: nextDueDate,
          currentInstallment: bill.currentInstallment + 1,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        // Remove a atual e adiciona a próxima parcela
        return [...prev.filter(b => b.id !== id), newBill]
      }

      // Conta única ou última parcela: apenas remove
      return prev.filter(b => b.id !== id)
    })
  }, [])

  /**
   * Retorna bills pendentes ordenadas por data de vencimento (mais próximas primeiro)
   */
  const getPendingBills = useCallback((): Bill[] => {
    return bills
      .filter(b => b.status === 'pending')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }, [bills])

  // ===== HELPERS =====
  const getMemberById = useCallback((id: string): FamilyMember | undefined => {
    return familyMembers.find(m => m.id === id)
  }, [familyMembers])

  const getAccountById = useCallback((id: string): BankAccount | CreditCard | undefined => {
    return bankAccounts.find(a => a.id === id) || creditCards.find(c => c.id === id)
  }, [bankAccounts, creditCards])

  const getCardById = useCallback((id: string): CreditCard | undefined => {
    return creditCards.find(c => c.id === id)
  }, [creditCards])

  /**
   * Retorna transações vinculadas a um cartão específico
   */
  const getTransactionsByCard = useCallback((cardId: string): Transaction[] => {
    return transactions.filter(tx => tx.accountId === cardId)
  }, [transactions])

  // ===== CÁLCULOS DERIVADOS =====
  
  /**
   * Retorna transações filtradas por todos os filtros ativos
   */
  const getFilteredTransactions = useCallback((): Transaction[] => {
    return transactions.filter(tx => {
      // Filtro por membro
      if (filters.selectedMember && tx.memberId !== filters.selectedMember) {
        return false
      }

      // Filtro por período
      const txDate = new Date(tx.date)
      if (txDate < filters.dateRange.startDate || txDate > filters.dateRange.endDate) {
        return false
      }

      // Filtro por tipo
      if (filters.transactionType !== 'all' && tx.type !== filters.transactionType) {
        return false
      }

      // Filtro por texto de busca
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase()
        const matchesDescription = tx.description.toLowerCase().includes(searchLower)
        const matchesCategory = tx.category.toLowerCase().includes(searchLower)
        if (!matchesDescription && !matchesCategory) {
          return false
        }
      }

      return true
    })
  }, [transactions, filters])

  /**
   * Calcula saldo total (soma de contas - faturas de cartões)
   */
  const calculateTotalBalance = useCallback((): number => {
    const accountsTotal = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0)
    const cardsTotal = creditCards.reduce((sum, card) => sum + card.currentBill, 0)
    return accountsTotal - cardsTotal
  }, [bankAccounts, creditCards])

  /**
   * Calcula total de receitas no período filtrado
   */
  const calculateIncomeForPeriod = useCallback((): number => {
    const filtered = getFilteredTransactions()
    return filtered
      .filter(tx => tx.type === 'income' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.value, 0)
  }, [getFilteredTransactions])

  /**
   * Calcula total de despesas no período filtrado
   */
  const calculateExpensesForPeriod = useCallback((): number => {
    const filtered = getFilteredTransactions()
    return filtered
      .filter(tx => tx.type === 'expense' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.value, 0)
  }, [getFilteredTransactions])

  /**
   * Agrupa despesas por categoria, ordenadas por valor decrescente
   */
  /**
   * Agrupa despesas por categoria, ordenadas por valor decrescente
   * 
   * Conforme documentação:
   * - Busca todas as transações do tipo "despesa"
   * - Aplica filtros ativos (período, membro, busca textual)
   * - Agrupa por categoria e soma valores
   * - Calcula percentual em relação à RECEITA TOTAL (não despesas)
   * - Ordena por valor decrescente
   */
  const calculateExpensesByCategory = useCallback((): ExpenseByCategory[] => {
    const filtered = getFilteredTransactions()
    const expenses = filtered.filter(tx => tx.type === 'expense' && tx.status === 'completed')
    
    // Calcula receita total do período (para percentual)
    const totalIncome = filtered
      .filter(tx => tx.type === 'income' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.value, 0)

    // Agrupa por categoria
    const categoryMap = new Map<string, { total: number; count: number }>()
    
    expenses.forEach(tx => {
      const current = categoryMap.get(tx.category) || { total: 0, count: 0 }
      categoryMap.set(tx.category, {
        total: current.total + tx.value,
        count: current.count + 1,
      })
    })

    // Converte para array e calcula percentuais em relação à receita
    // Exemplo: se Alimentação = R$ 1.500 e receita = R$ 5.000, percentual = 30%
    const result: ExpenseByCategory[] = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: totalIncome > 0 ? (data.total / totalIncome) * 100 : 0,
    }))

    // Ordena por valor decrescente (maior gasto primeiro)
    return result.sort((a, b) => b.total - a.total)
  }, [getFilteredTransactions])

  /**
   * Agrupa despesas por membro da família, ordenadas por valor decrescente
   */
  const calculateExpensesByMember = useCallback((): ExpenseByMember[] => {
    const filtered = getFilteredTransactions()
    const expenses = filtered.filter(tx => tx.type === 'expense' && tx.status === 'completed')
    const totalExpenses = expenses.reduce((sum, tx) => sum + tx.value, 0)

    // Agrupa por membro
    const memberMap = new Map<string | null, { total: number; count: number }>()
    
    expenses.forEach(tx => {
      const current = memberMap.get(tx.memberId) || { total: 0, count: 0 }
      memberMap.set(tx.memberId, {
        total: current.total + tx.value,
        count: current.count + 1,
      })
    })

    // Converte para array e calcula percentuais
    const result: ExpenseByMember[] = Array.from(memberMap.entries()).map(([memberId, data]) => {
      const member = memberId ? familyMembers.find(m => m.id === memberId) : null
      return {
        memberId,
        memberName: member ? member.name : 'Família',
        total: data.total,
        count: data.count,
        percentage: totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0,
      }
    })

    // Ordena por valor decrescente
    return result.sort((a, b) => b.total - a.total)
  }, [getFilteredTransactions, familyMembers])

  /**
   * Calcula percentual de uma categoria em relação à receita total
   */
  const calculateCategoryPercentage = useCallback((category: string): number => {
    const income = calculateIncomeForPeriod()
    if (income === 0) return 0

    const filtered = getFilteredTransactions()
    const categoryTotal = filtered
      .filter(tx => tx.type === 'expense' && tx.category === category && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.value, 0)

    return (categoryTotal / income) * 100
  }, [getFilteredTransactions, calculateIncomeForPeriod])

  /**
   * Calcula taxa de economia: (receitas - despesas) / receitas × 100
   */
  const calculateSavingsRate = useCallback((): number => {
    const income = calculateIncomeForPeriod()
    const expenses = calculateExpensesForPeriod()
    
    if (income === 0) return 0
    return ((income - expenses) / income) * 100
  }, [calculateIncomeForPeriod, calculateExpensesForPeriod])

  // ===== VALOR DO CONTEXTO =====
  const value = useMemo<FinanceContextType>(() => ({
    // Estado principal
    transactions,
    goals,
    creditCards,
    bankAccounts,
    familyMembers,
    bills,

    // Filtros
    filters,
    setSelectedMember,
    setDateRange,
    setTransactionType,
    setSearchText,
    resetFilters,

    // CRUD: Transactions
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // CRUD: Goals
    addGoal,
    updateGoal,
    deleteGoal,

    // CRUD: Credit Cards
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,

    // CRUD: Bank Accounts
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,

    // CRUD: Family Members
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,

    // CRUD: Bills
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    getPendingBills,

    // Cálculos derivados
    getFilteredTransactions,
    calculateTotalBalance,
    calculateIncomeForPeriod,
    calculateExpensesForPeriod,
    calculateExpensesByCategory,
    calculateExpensesByMember,
    calculateCategoryPercentage,
    calculateSavingsRate,

    // Helpers
    getMemberById,
    getAccountById,
    getCardById,
    getTransactionsByCard,
  }), [
    transactions,
    goals,
    creditCards,
    bankAccounts,
    familyMembers,
    bills,
    filters,
    setSelectedMember,
    setDateRange,
    setTransactionType,
    setSearchText,
    resetFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    getPendingBills,
    getFilteredTransactions,
    calculateTotalBalance,
    calculateIncomeForPeriod,
    calculateExpensesForPeriod,
    calculateExpensesByCategory,
    calculateExpensesByMember,
    calculateCategoryPercentage,
    calculateSavingsRate,
    getMemberById,
    getAccountById,
    getCardById,
    getTransactionsByCard,
  ])

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}

// ============================================================================
// HOOK CUSTOMIZADO
// ============================================================================

/**
 * Hook customizado para acessar o contexto financeiro
 * Este é o único ponto de acesso ao contexto em toda a aplicação
 * 
 * @throws Error se usado fora do FinanceProvider
 * 
 * @example
 * const { transactions, addTransaction, calculateTotalBalance } = useFinance()
 */
export function useFinance(): FinanceContextType {
  const context = useContext(FinanceContext)
  
  if (context === undefined) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider')
  }
  
  return context
}

// ============================================================================
// EXPORTAÇÕES ADICIONAIS
// ============================================================================

export { CATEGORIES }
export type { DateRange, TransactionFilterType, FiltersState, ExpenseByCategory, ExpenseByMember }
