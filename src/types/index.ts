/**
 * Tipos TypeScript fundamentais para o sistema mycash+
 * Representam as cinco entidades principais do sistema
 */

/**
 * Tipo de transação: receita ou despesa
 */
export type TransactionType = 'income' | 'expense';

/**
 * Status da transação
 */
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

/**
 * Entidade: Transaction (Transação)
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  value: number;
  description: string;
  category: string;
  date: Date;
  accountId: string | null; // ID da conta bancária ou cartão de crédito
  memberId: string | null; // ID do membro da família (null = família geral)
  installments: number; // Número de parcelas (1 = à vista)
  currentInstallment: number; // Parcela atual (1 a installments)
  status: TransactionStatus;
  isRecurring: boolean; // Se é despesa recorrente
  isPaid: boolean; // Se foi paga (para despesas)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entidade: Goal (Objetivo/Meta)
 */
export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number; // Valor alvo
  currentAmount: number; // Valor atual acumulado
  deadline: Date; // Data limite
  category: string; // Categoria do objetivo
  memberId: string | null; // ID do membro responsável (null = família)
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tipo de conta: bancária ou cartão de crédito
 */
export type AccountType = 'account' | 'creditCard';

/**
 * Tema visual do cartão de crédito
 */
export type CreditCardTheme = 'black' | 'lime' | 'white';

/**
 * Entidade: CreditCard (Cartão de Crédito)
 */
export interface CreditCard {
  id: string;
  name: string; // Nome do cartão (ex: "Nubank Mastercard")
  holderId: string; // ID do membro titular
  closingDay: number; // Dia de fechamento (1-31)
  dueDay: number; // Dia de vencimento (1-31)
  limit: number; // Limite total
  currentBill: number; // Fatura atual
  theme: CreditCardTheme; // Tema visual
  lastDigits?: string; // Últimos 4 dígitos (opcional)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entidade: BankAccount (Conta Bancária)
 */
export interface BankAccount {
  id: string;
  name: string; // Nome da conta (ex: "Nubank Conta")
  holderId: string; // ID do membro titular
  balance: number; // Saldo atual
  bankName?: string; // Nome do banco (opcional)
  accountNumber?: string; // Número da conta (opcional)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entidade: FamilyMember (Membro da Família)
 */
export interface FamilyMember {
  id: string;
  name: string; // Nome completo
  role: string; // Função na família (ex: "Pai", "Mãe", "Filho")
  avatarUrl?: string; // URL do avatar (opcional)
  monthlyIncome?: number; // Renda mensal estimada (opcional)
  email?: string; // Email (opcional)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tipo unificado para Account (pode ser BankAccount ou CreditCard)
 */
export type Account = BankAccount | CreditCard;

/**
 * Helper type guard para verificar se é CreditCard
 */
export function isCreditCard(account: Account): account is CreditCard {
  return 'closingDay' in account && 'dueDay' in account && 'limit' in account;
}

/**
 * Helper type guard para verificar se é BankAccount
 */
export function isBankAccount(account: Account): account is BankAccount {
  return 'balance' in account && !isCreditCard(account);
}
