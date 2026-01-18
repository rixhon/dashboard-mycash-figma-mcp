/**
 * Tipos do banco de dados Supabase
 * Gerado baseado no schema do banco
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type TransactionType = 'INCOME' | 'EXPENSE'
export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD'
export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
export type TransactionStatus = 'PENDING' | 'COMPLETED'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          user_id: string
          name: string
          role: string
          avatar_url: string | null
          monthly_income: number
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          role: string
          avatar_url?: string | null
          monthly_income?: number
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          role?: string
          avatar_url?: string | null
          monthly_income?: number
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          type: TransactionType
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string
          type: TransactionType
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string
          type?: TransactionType
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          type: AccountType
          name: string
          bank: string
          last_digits: string | null
          holder_id: string
          balance: number
          credit_limit: number | null
          current_bill: number
          due_day: number | null
          closing_day: number | null
          theme: string | null
          logo_url: string | null
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: AccountType
          name: string
          bank: string
          last_digits?: string | null
          holder_id: string
          balance?: number
          credit_limit?: number | null
          current_bill?: number
          due_day?: number | null
          closing_day?: number | null
          theme?: string | null
          logo_url?: string | null
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: AccountType
          name?: string
          bank?: string
          last_digits?: string | null
          holder_id?: string
          balance?: number
          credit_limit?: number | null
          current_bill?: number
          due_day?: number | null
          closing_day?: number | null
          theme?: string | null
          logo_url?: string | null
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: TransactionType
          amount: number
          description: string
          date: string
          category_id: string | null
          account_id: string | null
          member_id: string | null
          installment_number: number | null
          total_installments: number
          parent_transaction_id: string | null
          is_recurring: boolean
          recurring_transaction_id: string | null
          status: TransactionStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: TransactionType
          amount: number
          description: string
          date: string
          category_id?: string | null
          account_id?: string | null
          member_id?: string | null
          installment_number?: number | null
          total_installments?: number
          parent_transaction_id?: string | null
          is_recurring?: boolean
          recurring_transaction_id?: string | null
          status?: TransactionStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: TransactionType
          amount?: number
          description?: string
          date?: string
          category_id?: string | null
          account_id?: string | null
          member_id?: string | null
          installment_number?: number | null
          total_installments?: number
          parent_transaction_id?: string | null
          is_recurring?: boolean
          recurring_transaction_id?: string | null
          status?: TransactionStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recurring_transactions: {
        Row: {
          id: string
          user_id: string
          type: TransactionType
          amount: number
          description: string
          category_id: string | null
          account_id: string | null
          member_id: string | null
          frequency: RecurrenceFrequency
          day_of_month: number | null
          day_of_week: number | null
          start_date: string
          end_date: string | null
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type?: TransactionType
          amount: number
          description: string
          category_id?: string | null
          account_id?: string | null
          member_id?: string | null
          frequency: RecurrenceFrequency
          day_of_month?: number | null
          day_of_week?: number | null
          start_date: string
          end_date?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: TransactionType
          amount?: number
          description?: string
          category_id?: string | null
          account_id?: string | null
          member_id?: string | null
          frequency?: RecurrenceFrequency
          day_of_month?: number | null
          day_of_week?: number | null
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      calculate_total_balance: {
        Args: { p_user_id: string }
        Returns: number
      }
      calculate_income_for_period: {
        Args: {
          p_user_id: string
          p_start_date: string
          p_end_date: string
          p_member_id?: string | null
        }
        Returns: number
      }
      calculate_expenses_for_period: {
        Args: {
          p_user_id: string
          p_start_date: string
          p_end_date: string
          p_member_id?: string | null
        }
        Returns: number
      }
      calculate_expenses_by_category: {
        Args: {
          p_user_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          category_id: string
          category_name: string
          category_icon: string
          category_color: string
          total: number
          count: number
        }[]
      }
    }
  }
}

// Tipos auxiliares para uso no app
export type User = Database['public']['Tables']['users']['Row']
export type FamilyMember = Database['public']['Tables']['family_members']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Account = Database['public']['Tables']['accounts']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type RecurringTransaction = Database['public']['Tables']['recurring_transactions']['Row']

// Tipos para inserção
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type FamilyMemberInsert = Database['public']['Tables']['family_members']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type AccountInsert = Database['public']['Tables']['accounts']['Insert']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type RecurringTransactionInsert = Database['public']['Tables']['recurring_transactions']['Insert']

// Tipos para atualização
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type FamilyMemberUpdate = Database['public']['Tables']['family_members']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type AccountUpdate = Database['public']['Tables']['accounts']['Update']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']
export type RecurringTransactionUpdate = Database['public']['Tables']['recurring_transactions']['Update']
