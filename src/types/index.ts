/**
 * Tipos TypeScript fundamentais para o sistema mycash+
 * Representam as entidades principais do sistema
 */

// Re-exportar tipos do FinanceContext
export {
  CATEGORIES,
  createDateRange,
} from '@/contexts/FinanceContext'

export type {
  DateRange,
  TransactionFilterType,
  FiltersState,
  ExpenseByCategory,
  ExpenseByMember,
} from '@/contexts/FinanceContext'

/**
 * Tipo de transação: receita ou despesa
 */
export type TransactionType = 'income' | 'expense' | 'INCOME' | 'EXPENSE';

/**
 * Status da transação
 */
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'PENDING' | 'COMPLETED';

/**
 * Tipo de conta
 */
export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'account' | 'creditCard';

/**
 * Tema visual do cartão de crédito
 */
export type CreditCardTheme = 'black' | 'lime' | 'white';

/**
 * Entidade: FamilyMember
 */
export interface FamilyMember {
  id: string;
  user_id?: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  monthlyIncome?: number;
  monthly_income?: number;
  color?: string;
  email?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Entidade: Category
 */
export interface Category {
  id: string;
  user_id?: string;
  name: string;
  icon: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Entidade: Account (unifica contas e cartões)
 */
export interface Account {
  id: string;
  user_id?: string;
  type: AccountType | 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';
  name: string;
  bank?: string;
  last_digits?: string | null;
  lastDigits?: string | null;
  holder_id?: string;
  holderId?: string;
  balance?: number;
  credit_limit?: number | null;
  creditLimit?: number | null;
  current_bill?: number;
  currentBill?: number;
  due_day?: number | null;
  dueDay?: number | null;
  closing_day?: number | null;
  closingDay?: number | null;
  theme?: string | null;
  logo_url?: string | null;
  logoUrl?: string | null;
  color?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  // Alias para compatibilidade com CreditCard
  limit?: number | null;
}

/**
 * Alias para CreditCard
 */
export interface CreditCard {
  id: string;
  name: string;
  bank?: string;
  holderId?: string;
  holder_id?: string;
  closingDay?: number | null;
  closing_day?: number | null;
  dueDay?: number | null;
  due_day?: number | null;
  limit?: number | null;
  creditLimit?: number | null;
  credit_limit?: number | null;
  currentBill?: number;
  current_bill?: number;
  theme?: CreditCardTheme | string | null;
  lastDigits?: string | null;
  last_digits?: string | null;
  logoUrl?: string | null;
  logo_url?: string | null;
  type?: AccountType | string;
  balance?: number;
  color?: string;
  is_active?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Alias para BankAccount
 */
export interface BankAccount {
  id: string;
  name: string;
  bank?: string;
  holderId?: string;
  holder_id?: string;
  balance?: number;
  bankName?: string;
  accountNumber?: string;
  type?: AccountType | string;
  color?: string;
  is_active?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Entidade: Transaction
 */
export interface Transaction {
  id: string;
  user_id?: string;
  type: TransactionType | 'INCOME' | 'EXPENSE';
  amount?: number;
  value?: number;
  description: string;
  date: string | Date;
  category_id?: string | null;
  categoryId?: string | null;
  category?: string | null;
  account_id?: string | null;
  accountId?: string | null;
  member_id?: string | null;
  memberId?: string | null;
  installment_number?: number | null;
  installmentNumber?: number | null;
  currentInstallment?: number | null;
  total_installments?: number;
  installments?: number;
  parent_transaction_id?: string | null;
  is_recurring?: boolean;
  isRecurring?: boolean;
  recurring_transaction_id?: string | null;
  status?: TransactionStatus | 'PENDING' | 'COMPLETED';
  isPaid?: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Entidade: RecurringTransaction
 */
export interface RecurringTransaction {
  id: string;
  user_id?: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  category_id?: string | null;
  account_id?: string | null;
  member_id?: string | null;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  day_of_month?: number | null;
  day_of_week?: number | null;
  start_date: string;
  end_date?: string | null;
  is_active?: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Tipo de conta/bill
 */
export type BillType = 'fixed' | 'card';

/**
 * Status da conta/bill
 */
export type BillStatus = 'pending' | 'paid';

/**
 * Entidade: Bill
 */
export interface Bill {
  id: string;
  description: string;
  value: number;
  dueDay?: number;
  dueDate?: Date | string;
  type?: BillType;
  status?: BillStatus;
  accountId?: string | null;
  isRecurring?: boolean;
  isPaid?: boolean;
  installments?: number;
  currentInstallment?: number;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Entidade: Goal
 */
export interface Goal {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  targetAmount?: number;
  currentAmount?: number;
  category?: string;
  deadline?: string | Date | null;
  memberId?: string | null;
  isActive?: boolean;
  isCompleted?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Helper type guard para verificar se é CreditCard
 */
export function isCreditCard(account: any): account is CreditCard {
  return account?.type === 'CREDIT_CARD' || 
    ('closingDay' in account || 'closing_day' in account) ||
    ('creditLimit' in account || 'credit_limit' in account);
}

/**
 * Helper type guard para verificar se é BankAccount
 */
export function isBankAccount(account: any): account is BankAccount {
  return account?.type === 'CHECKING' || account?.type === 'SAVINGS' || 
    ('balance' in account && !isCreditCard(account));
}

/**
 * Função para formatar valor como moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Função para formatar data
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(d);
}

/**
 * Função para normalizar tipo de transação
 */
export function normalizeTransactionType(type: string): 'income' | 'expense' {
  return type.toLowerCase() as 'income' | 'expense';
}
