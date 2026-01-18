/**
 * FinanceContext - Contexto de Finanças
 * 
 * Gerencia todos os dados financeiros do usuário usando Supabase.
 * Inclui transações, contas, cartões, membros da família e categorias.
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'

// ============================================================================
// TIPOS EXPORTADOS
// ============================================================================

export interface DateRange {
  start: Date
  end: Date
  startDate?: Date
  endDate?: Date
}

// Função helper para criar DateRange com aliases
export function createDateRange(start: Date, end: Date): DateRange {
  return {
    start,
    end,
    startDate: start,
    endDate: end,
  }
}

export type TransactionFilterType = 'all' | 'income' | 'expense'

export interface FiltersState {
  dateRange: DateRange
  selectedMember: string | null
  transactionType: TransactionFilterType
  searchText: string
}

export interface ExpenseByCategory {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  total: number
  count: number
  percentage: number
  // Aliases para compatibilidade
  category?: string
}

export interface ExpenseByMember {
  memberId: string
  memberName: string
  memberAvatar: string | null
  total: number
  count: number
  percentage: number
}

// Tipos de dados
export interface FamilyMember {
  id: string
  user_id: string
  name: string
  role: string
  avatarUrl: string | null
  avatar_url: string | null
  monthlyIncome: number
  monthly_income: number
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  type: 'INCOME' | 'EXPENSE'
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  user_id: string
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD'
  name: string
  bank: string
  last_digits: string | null
  lastDigits: string | null
  holder_id: string
  holderId: string
  balance: number
  credit_limit: number | null
  creditLimit: number | null
  limit?: number | null // Alias para creditLimit
  current_bill: number
  currentBill: number
  due_day: number | null
  dueDay: number | null
  closing_day: number | null
  closingDay: number | null
  theme: string | null
  logo_url: string | null
  logoUrl: string | null
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
  createdAt?: string
  updatedAt?: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'INCOME' | 'EXPENSE' | 'income' | 'expense'
  amount: number
  value: number
  description: string
  date: string
  category_id: string | null
  categoryId: string | null
  category: string | null
  account_id: string | null
  accountId: string | null
  member_id: string | null
  memberId: string | null
  installment_number: number | null
  installmentNumber: number | null
  currentInstallment?: number | null
  total_installments: number
  installments: number
  parent_transaction_id: string | null
  is_recurring: boolean
  isRecurring: boolean
  recurring_transaction_id: string | null
  status: 'PENDING' | 'COMPLETED' | 'pending' | 'completed'
  isPaid?: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface RecurringTransaction {
  id: string
  user_id: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  description: string
  category_id: string | null
  account_id: string | null
  member_id: string | null
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  day_of_month: number | null
  day_of_week: number | null
  start_date: string
  end_date: string | null
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Bill {
  id: string
  description: string
  value: number
  dueDay: number
  dueDate?: Date | string
  accountId: string | null
  isRecurring: boolean
  isPaid: boolean
  installments?: number
  currentInstallment?: number
  type?: 'fixed' | 'card'
  status?: 'pending' | 'paid'
}

export interface Goal {
  id: string
  name: string
  title?: string
  description: string
  imageUrl: string
  targetAmount: number
  currentAmount: number
  category: string
  deadline: string | Date | null
  memberId?: string | null
  isActive: boolean
  isCompleted?: boolean
}

// Categorias padrão
export const CATEGORIES = {
  income: [
    { id: 'salary', name: 'Salário', icon: '💵', color: '#15BE78' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: '#3247FF' },
    { id: 'investments', name: 'Investimentos', icon: '📈', color: '#8B5CF6' },
    { id: 'gift', name: 'Presente', icon: '🎁', color: '#EC4899' },
    { id: 'other-income', name: 'Outros', icon: '💰', color: '#6B7280' },
  ],
  expense: [
    { id: 'food', name: 'Alimentação', icon: '🍔', color: '#EF4444' },
    { id: 'market', name: 'Mercado', icon: '🛒', color: '#F97316' },
    { id: 'transport', name: 'Transporte', icon: '🚗', color: '#F59E0B' },
    { id: 'housing', name: 'Moradia', icon: '🏠', color: '#84CC16' },
    { id: 'health', name: 'Saúde', icon: '🏥', color: '#22C55E' },
    { id: 'education', name: 'Educação', icon: '📚', color: '#14B8A6' },
    { id: 'leisure', name: 'Lazer', icon: '🎮', color: '#06B6D4' },
    { id: 'clothing', name: 'Vestuário', icon: '👕', color: '#3B82F6' },
    { id: 'subscriptions', name: 'Assinaturas', icon: '📱', color: '#6366F1' },
    { id: 'gym', name: 'Academia', icon: '🏋️', color: '#8B5CF6' },
    { id: 'pets', name: 'Pets', icon: '🐶', color: '#A855F7' },
    { id: 'maintenance', name: 'Manutenção', icon: '🔧', color: '#D946EF' },
    { id: 'travel', name: 'Viagem', icon: '✈️', color: '#EC4899' },
    { id: 'other-expense', name: 'Outros', icon: '💸', color: '#6B7280' },
  ],
}

// ============================================================================
// INTERFACE DO CONTEXTO
// ============================================================================

interface FinanceContextType {
  // Estado
  loading: boolean
  error: string | null
  
  // Dados
  familyMembers: FamilyMember[]
  categories: Category[]
  accounts: Account[]
  transactions: Transaction[]
  recurringTransactions: RecurringTransaction[]
  creditCards: Account[]
  bankAccounts: Account[]
  goals: Goal[]
  bills: Bill[]
  
  // Filtros
  filters: FiltersState
  setFilters: (filters: Partial<FiltersState>) => void
  setSearchText: (text: string) => void
  setTransactionType: (type: TransactionFilterType) => void
  setSelectedMember: (memberId: string | null) => void
  setDateRange: (range: DateRange | { startDate: Date; endDate: Date }) => void
  
  // Cálculos
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  savingsRate: number
  expensesByCategory: ExpenseByCategory[]
  calculateTotalBalance: () => number
  calculateIncomeForPeriod: () => number
  calculateExpensesForPeriod: () => number
  calculateExpensesByCategory: () => ExpenseByCategory[]
  calculateCategoryPercentage: (categoryTotal: number) => number
  
  // CRUD - Family Members
  addFamilyMember: (member: Partial<FamilyMember>) => Promise<FamilyMember | null>
  updateFamilyMember: (id: string, data: Partial<FamilyMember>) => Promise<boolean>
  deleteFamilyMember: (id: string) => Promise<boolean>
  
  // CRUD - Categories
  addCategory: (category: Partial<Category>) => Promise<Category | null>
  updateCategory: (id: string, data: Partial<Category>) => Promise<boolean>
  deleteCategory: (id: string) => Promise<boolean>
  
  // CRUD - Accounts
  addAccount: (account: Partial<Account>) => Promise<Account | null>
  updateAccount: (id: string, data: Partial<Account>) => Promise<boolean>
  deleteAccount: (id: string) => Promise<boolean>
  addBankAccount: (account: Partial<Account>) => Promise<Account | null>
  addCreditCard: (card: Partial<Account>) => Promise<Account | null>
  
  // CRUD - Transactions
  addTransaction: (transaction: Partial<Transaction>) => Promise<Transaction | null>
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<boolean>
  deleteTransaction: (id: string) => Promise<boolean>
  
  // CRUD - Recurring Transactions
  addRecurringTransaction: (recurring: Partial<RecurringTransaction>) => Promise<RecurringTransaction | null>
  updateRecurringTransaction: (id: string, data: Partial<RecurringTransaction>) => Promise<boolean>
  deleteRecurringTransaction: (id: string) => Promise<boolean>
  
  // CRUD - Bills
  addBill: (bill: Partial<Bill>) => Promise<Bill | null>
  getPendingBills: () => Bill[]
  markBillAsPaid: (id: string) => Promise<boolean>
  
  // Helpers
  getFilteredTransactions: () => Transaction[]
  getTransactionsByAccount: (accountId: string) => Transaction[]
  getTransactionsByCard: (cardId: string) => Transaction[]
  getCreditCards: () => Account[]
  getBankAccounts: () => Account[]
  refreshData: () => Promise<void>
}

// ============================================================================
// CONTEXTO
// ============================================================================

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

// ============================================================================
// HELPER: Normalizar dados do banco
// ============================================================================

function normalizeTransaction(t: any): Transaction {
  return {
    ...t,
    value: Number(t.amount),
    categoryId: t.category_id,
    accountId: t.account_id,
    memberId: t.member_id,
    installmentNumber: t.installment_number,
    installments: t.total_installments,
    isRecurring: t.is_recurring,
  }
}

function normalizeAccount(a: any): Account {
  const creditLimit = a.credit_limit ? Number(a.credit_limit) : null
  return {
    ...a,
    lastDigits: a.last_digits,
    holderId: a.holder_id,
    creditLimit,
    limit: creditLimit, // Alias
    currentBill: Number(a.current_bill || 0),
    dueDay: a.due_day,
    closingDay: a.closing_day,
    logoUrl: a.logo_url,
    balance: Number(a.balance || 0),
  }
}

function normalizeFamilyMember(m: any): FamilyMember {
  return {
    ...m,
    avatarUrl: m.avatar_url,
    monthlyIncome: Number(m.monthly_income || 0),
  }
}

// ============================================================================
// PROVIDER
// ============================================================================

interface FinanceProviderProps {
  children: ReactNode
}

export function FinanceProvider({ children }: FinanceProviderProps) {
  const { user } = useAuth()
  
  // Estado de carregamento
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Dados
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [goals] = useState<Goal[]>([])
  
  // Filtros
  const [filters, setFiltersState] = useState<FiltersState>({
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
    selectedMember: null,
    transactionType: 'all',
    searchText: '',
  })
  
  // Setters de filtros
  const setFilters = useCallback((newFilters: Partial<FiltersState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }, [])
  
  const setSearchText = useCallback((text: string) => {
    setFiltersState(prev => ({ ...prev, searchText: text }))
  }, [])
  
  const setTransactionType = useCallback((type: TransactionFilterType) => {
    setFiltersState(prev => ({ ...prev, transactionType: type }))
  }, [])
  
  const setSelectedMember = useCallback((memberId: string | null) => {
    setFiltersState(prev => ({ ...prev, selectedMember: memberId }))
  }, [])
  
  const setDateRange = useCallback((range: DateRange | { startDate: Date; endDate: Date }) => {
    const normalized: DateRange = {
      start: 'start' in range ? range.start : range.startDate,
      end: 'end' in range ? range.end : range.endDate,
      startDate: 'startDate' in range ? range.startDate : range.start,
      endDate: 'endDate' in range ? range.endDate : range.end,
    }
    setFiltersState(prev => ({ ...prev, dateRange: normalized }))
  }, [])
  
  // ============================================================================
  // CARREGAMENTO DE DADOS
  // ============================================================================
  
  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const [
        { data: membersData, error: membersError },
        { data: categoriesData, error: categoriesError },
        { data: accountsData, error: accountsError },
        { data: transactionsData, error: transactionsError },
        { data: recurringData, error: recurringError },
      ] = await Promise.all([
        supabase.from('family_members').select('*').eq('is_active', true).order('created_at'),
        supabase.from('categories').select('*').eq('is_active', true).order('name'),
        supabase.from('accounts').select('*').eq('is_active', true).order('name'),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('recurring_transactions').select('*').eq('is_active', true).order('description'),
      ])
      
      if (membersError) throw membersError
      if (categoriesError) throw categoriesError
      if (accountsError) throw accountsError
      if (transactionsError) throw transactionsError
      if (recurringError) throw recurringError
      
      setFamilyMembers((membersData || []).map(normalizeFamilyMember))
      setCategories(categoriesData || [])
      setAccounts((accountsData || []).map(normalizeAccount))
      setTransactions((transactionsData || []).map(normalizeTransaction))
      setRecurringTransactions(recurringData || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Erro ao carregar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [user])
  
  useEffect(() => {
    loadData()
  }, [loadData])
  
  // ============================================================================
  // DADOS DERIVADOS
  // ============================================================================
  
  const creditCards = useMemo(() => {
    return accounts.filter(a => a.type === 'CREDIT_CARD')
  }, [accounts])
  
  const bankAccounts = useMemo(() => {
    return accounts.filter(a => a.type !== 'CREDIT_CARD')
  }, [accounts])
  
  // ============================================================================
  // CÁLCULOS
  // ============================================================================
  
  const calculateTotalBalance = useCallback(() => {
    const bankBalance = accounts
      .filter(a => a.type !== 'CREDIT_CARD')
      .reduce((sum, a) => sum + Number(a.balance), 0)
    
    const creditBills = accounts
      .filter(a => a.type === 'CREDIT_CARD')
      .reduce((sum, a) => sum + Number(a.currentBill || a.current_bill || 0), 0)
    
    return bankBalance - creditBills
  }, [accounts])
  
  const totalBalance = useMemo(() => calculateTotalBalance(), [calculateTotalBalance])
  
  const calculateIncomeForPeriod = useCallback(() => {
    return transactions
      .filter(t => {
        const date = new Date(t.date)
        const type = t.type.toUpperCase()
        const status = (t.status || 'COMPLETED').toUpperCase()
        return (
          type === 'INCOME' &&
          status === 'COMPLETED' &&
          date >= filters.dateRange.start &&
          date <= filters.dateRange.end &&
          (filters.selectedMember === null || t.member_id === filters.selectedMember || t.memberId === filters.selectedMember)
        )
      })
      .reduce((sum, t) => sum + Number(t.amount || t.value), 0)
  }, [transactions, filters])
  
  const totalIncome = useMemo(() => calculateIncomeForPeriod(), [calculateIncomeForPeriod])
  
  const calculateExpensesForPeriod = useCallback(() => {
    return transactions
      .filter(t => {
        const date = new Date(t.date)
        const type = t.type.toUpperCase()
        const status = (t.status || 'COMPLETED').toUpperCase()
        return (
          type === 'EXPENSE' &&
          status === 'COMPLETED' &&
          date >= filters.dateRange.start &&
          date <= filters.dateRange.end &&
          (filters.selectedMember === null || t.member_id === filters.selectedMember || t.memberId === filters.selectedMember)
        )
      })
      .reduce((sum, t) => sum + Number(t.amount || t.value), 0)
  }, [transactions, filters])
  
  const totalExpenses = useMemo(() => calculateExpensesForPeriod(), [calculateExpensesForPeriod])
  
  const savingsRate = useMemo(() => {
    if (totalIncome === 0) return 0
    return ((totalIncome - totalExpenses) / totalIncome) * 100
  }, [totalIncome, totalExpenses])
  
  const calculateCategoryPercentage = useCallback((categoryTotal: number) => {
    if (totalIncome === 0) return 0
    return (categoryTotal / totalIncome) * 100
  }, [totalIncome])
  
  const calculateExpensesByCategory = useCallback((): ExpenseByCategory[] => {
    const categoryMap = new Map<string, ExpenseByCategory>()
    
    transactions
      .filter(t => {
        const date = new Date(t.date)
        const type = t.type.toUpperCase()
        const status = (t.status || 'COMPLETED').toUpperCase()
        const catId = t.category_id || t.categoryId
        return (
          type === 'EXPENSE' &&
          status === 'COMPLETED' &&
          catId &&
          date >= filters.dateRange.start &&
          date <= filters.dateRange.end &&
          (filters.selectedMember === null || t.member_id === filters.selectedMember || t.memberId === filters.selectedMember)
        )
      })
      .forEach(t => {
        const catId = t.category_id || t.categoryId
        const category = categories.find(c => c.id === catId)
        if (!category) return
        
        const existing = categoryMap.get(category.id)
        const amount = Number(t.amount || t.value)
        if (existing) {
          existing.total += amount
          existing.count += 1
        } else {
          categoryMap.set(category.id, {
            categoryId: category.id,
            categoryName: category.name,
            categoryIcon: category.icon,
            categoryColor: category.color,
            total: amount,
            count: 1,
            percentage: 0,
            category: category.name,
          })
        }
      })
    
    const result = Array.from(categoryMap.values())
    
    result.forEach(item => {
      item.percentage = totalIncome > 0 ? (item.total / totalIncome) * 100 : 0
    })
    
    return result.sort((a, b) => b.total - a.total)
  }, [transactions, categories, filters, totalIncome])
  
  const expensesByCategory = useMemo(() => calculateExpensesByCategory(), [calculateExpensesByCategory])
  
  // ============================================================================
  // CRUD - FAMILY MEMBERS
  // ============================================================================
  
  const addFamilyMember = useCallback(async (member: Partial<FamilyMember>): Promise<FamilyMember | null> => {
    if (!user) return null
    
    const insertData = {
      user_id: user.id,
      name: member.name || '',
      role: member.role || '',
      avatar_url: member.avatarUrl || member.avatar_url || null,
      monthly_income: member.monthlyIncome || member.monthly_income || 0,
      color: member.color || '#3247FF',
    }
    
    const { data, error } = await supabase
      .from('family_members')
      .insert(insertData)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding family member:', error)
      return null
    }
    
    const normalized = normalizeFamilyMember(data)
    setFamilyMembers(prev => [...prev, normalized])
    return normalized
  }, [user])
  
  const updateFamilyMember = useCallback(async (id: string, data: Partial<FamilyMember>): Promise<boolean> => {
    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.role !== undefined) updateData.role = data.role
    if (data.avatarUrl !== undefined || data.avatar_url !== undefined) {
      updateData.avatar_url = data.avatarUrl || data.avatar_url
    }
    if (data.monthlyIncome !== undefined || data.monthly_income !== undefined) {
      updateData.monthly_income = data.monthlyIncome || data.monthly_income
    }
    if (data.color !== undefined) updateData.color = data.color
    
    const { error } = await supabase
      .from('family_members')
      .update(updateData)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating family member:', error)
      return false
    }
    
    setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, ...data, ...updateData } : m))
    return true
  }, [])
  
  const deleteFamilyMember = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('family_members')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting family member:', error)
      return false
    }
    
    setFamilyMembers(prev => prev.filter(m => m.id !== id))
    return true
  }, [])
  
  // ============================================================================
  // CRUD - CATEGORIES
  // ============================================================================
  
  const addCategory = useCallback(async (category: Partial<Category>): Promise<Category | null> => {
    if (!user) return null
    
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: category.name || '',
        icon: category.icon || '📌',
        type: category.type || 'EXPENSE',
        color: category.color || '#3247FF',
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error adding category:', error)
      return null
    }
    
    setCategories(prev => [...prev, data])
    return data
  }, [user])
  
  const updateCategory = useCallback(async (id: string, data: Partial<Category>): Promise<boolean> => {
    const { error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating category:', error)
      return false
    }
    
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    return true
  }, [])
  
  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('categories')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting category:', error)
      return false
    }
    
    setCategories(prev => prev.filter(c => c.id !== id))
    return true
  }, [])
  
  // ============================================================================
  // CRUD - ACCOUNTS
  // ============================================================================
  
  const addAccount = useCallback(async (account: Partial<Account>): Promise<Account | null> => {
    if (!user) return null
    
    const insertData = {
      user_id: user.id,
      type: account.type || 'CHECKING',
      name: account.name || '',
      bank: account.bank || account.name || '',
      last_digits: account.lastDigits || account.last_digits || null,
      holder_id: account.holderId || account.holder_id,
      balance: account.balance || 0,
      credit_limit: account.creditLimit || account.credit_limit || null,
      current_bill: account.currentBill || account.current_bill || 0,
      due_day: account.dueDay || account.due_day || null,
      closing_day: account.closingDay || account.closing_day || null,
      theme: account.theme || 'black',
      logo_url: account.logoUrl || account.logo_url || null,
      color: account.color || '#3247FF',
    }
    
    const { data, error } = await supabase
      .from('accounts')
      .insert(insertData)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding account:', error)
      return null
    }
    
    const normalized = normalizeAccount(data)
    setAccounts(prev => [...prev, normalized])
    return normalized
  }, [user])
  
  const addBankAccount = useCallback(async (account: Partial<Account>): Promise<Account | null> => {
    return addAccount({ ...account, type: 'CHECKING' })
  }, [addAccount])
  
  const addCreditCard = useCallback(async (card: Partial<Account>): Promise<Account | null> => {
    return addAccount({ ...card, type: 'CREDIT_CARD' })
  }, [addAccount])
  
  const updateAccount = useCallback(async (id: string, data: Partial<Account>): Promise<boolean> => {
    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.bank !== undefined) updateData.bank = data.bank
    if (data.balance !== undefined) updateData.balance = data.balance
    if (data.creditLimit !== undefined || data.credit_limit !== undefined) {
      updateData.credit_limit = data.creditLimit || data.credit_limit
    }
    if (data.currentBill !== undefined || data.current_bill !== undefined) {
      updateData.current_bill = data.currentBill || data.current_bill
    }
    if (data.dueDay !== undefined || data.due_day !== undefined) {
      updateData.due_day = data.dueDay || data.due_day
    }
    if (data.closingDay !== undefined || data.closing_day !== undefined) {
      updateData.closing_day = data.closingDay || data.closing_day
    }
    if (data.theme !== undefined) updateData.theme = data.theme
    if (data.lastDigits !== undefined || data.last_digits !== undefined) {
      updateData.last_digits = data.lastDigits || data.last_digits
    }
    
    const { error } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating account:', error)
      return false
    }
    
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...data, ...updateData } : a))
    return true
  }, [])
  
  const deleteAccount = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('accounts')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting account:', error)
      return false
    }
    
    setAccounts(prev => prev.filter(a => a.id !== id))
    return true
  }, [])
  
  // ============================================================================
  // CRUD - TRANSACTIONS
  // ============================================================================
  
  const addTransaction = useCallback(async (transaction: Partial<Transaction>): Promise<Transaction | null> => {
    if (!user) return null
    
    const type = (transaction.type || 'EXPENSE').toUpperCase() as 'INCOME' | 'EXPENSE'
    const status = (transaction.status || 'COMPLETED').toUpperCase() as 'PENDING' | 'COMPLETED'
    
    const insertData = {
      user_id: user.id,
      type,
      amount: transaction.amount || transaction.value || 0,
      description: transaction.description || '',
      date: transaction.date || new Date().toISOString().split('T')[0],
      category_id: transaction.categoryId || transaction.category_id || null,
      account_id: transaction.accountId || transaction.account_id || null,
      member_id: transaction.memberId || transaction.member_id || null,
      total_installments: transaction.installments || transaction.total_installments || 1,
      is_recurring: transaction.isRecurring || transaction.is_recurring || false,
      status,
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(insertData)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding transaction:', error)
      return null
    }
    
    const normalized = normalizeTransaction(data)
    setTransactions(prev => [normalized, ...prev])
    return normalized
  }, [user])
  
  const updateTransaction = useCallback(async (id: string, data: Partial<Transaction>): Promise<boolean> => {
    const updateData: any = {}
    if (data.type !== undefined) updateData.type = data.type.toUpperCase()
    if (data.amount !== undefined || data.value !== undefined) {
      updateData.amount = data.amount || data.value
    }
    if (data.description !== undefined) updateData.description = data.description
    if (data.date !== undefined) updateData.date = data.date
    if (data.categoryId !== undefined || data.category_id !== undefined) {
      updateData.category_id = data.categoryId || data.category_id
    }
    if (data.accountId !== undefined || data.account_id !== undefined) {
      updateData.account_id = data.accountId || data.account_id
    }
    if (data.memberId !== undefined || data.member_id !== undefined) {
      updateData.member_id = data.memberId || data.member_id
    }
    if (data.status !== undefined) updateData.status = data.status.toUpperCase()
    
    const { error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating transaction:', error)
      return false
    }
    
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data, ...updateData } : t))
    return true
  }, [])
  
  const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting transaction:', error)
      return false
    }
    
    setTransactions(prev => prev.filter(t => t.id !== id))
    return true
  }, [])
  
  // ============================================================================
  // CRUD - RECURRING TRANSACTIONS
  // ============================================================================
  
  const addRecurringTransaction = useCallback(async (recurring: Partial<RecurringTransaction>): Promise<RecurringTransaction | null> => {
    if (!user) return null
    
    const { data, error } = await supabase
      .from('recurring_transactions')
      .insert({
        user_id: user.id,
        type: recurring.type || 'EXPENSE',
        amount: recurring.amount || 0,
        description: recurring.description || '',
        category_id: recurring.category_id || null,
        account_id: recurring.account_id || null,
        member_id: recurring.member_id || null,
        frequency: recurring.frequency || 'MONTHLY',
        day_of_month: recurring.day_of_month || null,
        start_date: recurring.start_date || new Date().toISOString().split('T')[0],
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error adding recurring transaction:', error)
      return null
    }
    
    setRecurringTransactions(prev => [...prev, data])
    return data
  }, [user])
  
  const updateRecurringTransaction = useCallback(async (id: string, data: Partial<RecurringTransaction>): Promise<boolean> => {
    const { error } = await supabase
      .from('recurring_transactions')
      .update(data)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating recurring transaction:', error)
      return false
    }
    
    setRecurringTransactions(prev => prev.map(r => r.id === id ? { ...r, ...data } : r))
    return true
  }, [])
  
  const deleteRecurringTransaction = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('recurring_transactions')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting recurring transaction:', error)
      return false
    }
    
    setRecurringTransactions(prev => prev.filter(r => r.id !== id))
    return true
  }, [])
  
  // ============================================================================
  // CRUD - BILLS (Local state for now)
  // ============================================================================
  
  const addBill = useCallback(async (bill: Partial<Bill>): Promise<Bill | null> => {
    const newBill: Bill = {
      id: crypto.randomUUID(),
      description: bill.description || '',
      value: bill.value || 0,
      dueDay: bill.dueDay || 1,
      accountId: bill.accountId || null,
      isRecurring: bill.isRecurring || false,
      isPaid: false,
    }
    setBills(prev => [...prev, newBill])
    return newBill
  }, [])
  
  const getPendingBills = useCallback(() => {
    return bills.filter(b => !b.isPaid)
  }, [bills])
  
  const markBillAsPaid = useCallback(async (id: string): Promise<boolean> => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: true } : b))
    return true
  }, [])
  
  // ============================================================================
  // HELPERS
  // ============================================================================
  
  const getFilteredTransactions = useCallback(() => {
    return transactions.filter(t => {
      const date = new Date(t.date)
      const type = t.type.toLowerCase()
      
      // Filtro de período
      if (date < filters.dateRange.start || date > filters.dateRange.end) {
        return false
      }
      
      // Filtro de membro
      const memberId = t.member_id || t.memberId
      if (filters.selectedMember && memberId !== filters.selectedMember) {
        return false
      }
      
      // Filtro de tipo
      if (filters.transactionType !== 'all' && type !== filters.transactionType) {
        return false
      }
      
      // Filtro de busca
      if (filters.searchText) {
        const search = filters.searchText.toLowerCase()
        const catId = t.category_id || t.categoryId
        const category = categories.find(c => c.id === catId)
        const matchDescription = t.description.toLowerCase().includes(search)
        const matchCategory = category?.name.toLowerCase().includes(search)
        if (!matchDescription && !matchCategory) {
          return false
        }
      }
      
      return true
    })
  }, [transactions, categories, filters])
  
  const getTransactionsByAccount = useCallback((accountId: string) => {
    return transactions.filter(t => (t.account_id || t.accountId) === accountId)
  }, [transactions])
  
  const getTransactionsByCard = useCallback((cardId: string) => {
    return transactions.filter(t => (t.account_id || t.accountId) === cardId)
  }, [transactions])
  
  const getCreditCards = useCallback(() => {
    return accounts.filter(a => a.type === 'CREDIT_CARD')
  }, [accounts])
  
  const getBankAccounts = useCallback(() => {
    return accounts.filter(a => a.type !== 'CREDIT_CARD')
  }, [accounts])
  
  const refreshData = useCallback(async () => {
    await loadData()
  }, [loadData])
  
  // ============================================================================
  // VALOR DO CONTEXTO
  // ============================================================================
  
  const value: FinanceContextType = {
    loading,
    error,
    familyMembers,
    categories,
    accounts,
    transactions,
    recurringTransactions,
    creditCards,
    bankAccounts,
    goals,
    bills,
    filters,
    setFilters,
    setSearchText,
    setTransactionType,
    setSelectedMember,
    setDateRange,
    totalBalance,
    totalIncome,
    totalExpenses,
    savingsRate,
    expensesByCategory,
    calculateTotalBalance,
    calculateIncomeForPeriod,
    calculateExpensesForPeriod,
    calculateExpensesByCategory,
    calculateCategoryPercentage,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    addCategory,
    updateCategory,
    deleteCategory,
    addAccount,
    updateAccount,
    deleteAccount,
    addBankAccount,
    addCreditCard,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    addBill,
    getPendingBills,
    markBillAsPaid,
    getFilteredTransactions,
    getTransactionsByAccount,
    getTransactionsByCard,
    getCreditCards,
    getBankAccounts,
    refreshData,
  }
  
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

// ============================================================================
// HOOK
// ============================================================================

export function useFinance(): FinanceContextType {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider')
  }
  return context
}
