/**
 * Constantes do sistema mycash+
 */

/**
 * Rotas principais da aplicação
 */
export const ROUTES = {
  DASHBOARD: '/',
  CARDS: '/cards',
  TRANSACTIONS: '/transactions',
  GOALS: '/goals',
  PROFILE: '/profile',
} as const;

/**
 * Breakpoints responsivos
 */
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1920,
} as const;

/**
 * Categorias padrão de receitas
 */
export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Aluguel',
  'Outros',
] as const;

/**
 * Categorias padrão de despesas
 */
export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Contas',
  'Outros',
] as const;

/**
 * Funções padrão de membros da família
 */
export const FAMILY_ROLES = [
  'Pai',
  'Mãe',
  'Filho',
  'Filha',
  'Avô',
  'Avó',
  'Tio',
  'Tia',
] as const;
