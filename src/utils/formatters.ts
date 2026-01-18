/**
 * Funções de formatação para o sistema mycash+
 */

/**
 * Formata um valor numérico como moeda brasileira (BRL)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como "R$ 1.234,56"
 * 
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * formatCurrency(0) // "R$ 0,00"
 * formatCurrency(-500) // "-R$ 500,00"
 */
export function formatCurrency(value: number): string {
  const isNegative = value < 0
  const absoluteValue = Math.abs(value)
  
  const formatted = absoluteValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  return isNegative ? `-${formatted}` : formatted
}

/**
 * Formata um valor como moeda compacta (para valores grandes)
 * @param value - Valor numérico
 * @returns String formatada como "R$ 1,2k" ou "R$ 1,5M"
 * 
 * @example
 * formatCurrencyCompact(1500) // "R$ 1,5k"
 * formatCurrencyCompact(1500000) // "R$ 1,5M"
 */
export function formatCurrencyCompact(value: number): string {
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  
  if (absValue >= 1000000) {
    return `${sign}R$ ${(absValue / 1000000).toFixed(1).replace('.', ',')}M`
  }
  if (absValue >= 1000) {
    return `${sign}R$ ${(absValue / 1000).toFixed(1).replace('.', ',')}k`
  }
  return formatCurrency(value)
}

/**
 * Formata uma porcentagem
 * @param value - Valor numérico (ex: 25.5 para 25.5%)
 * @param decimals - Número de casas decimais (padrão: 0)
 * @returns String formatada como "25%" ou "25,5%"
 * 
 * @example
 * formatPercentage(25) // "25%"
 * formatPercentage(25.567, 1) // "25,6%"
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`
}

/**
 * Formata uma data para exibição
 * @param date - Data a ser formatada (Date ou string ISO)
 * @param format - Formato desejado: 'short' (01/01), 'medium' (01 jan), 'long' (01 de janeiro de 2024)
 * @returns String formatada
 * 
 * @example
 * formatDate(new Date(), 'short') // "18/01"
 * formatDate(new Date(), 'medium') // "18 jan"
 * formatDate(new Date(), 'long') // "18 de janeiro de 2024"
 * formatDate('2024-01-18', 'medium') // "18 jan"
 */
export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = d.getDate().toString().padStart(2, '0')
  const month = d.getMonth()
  const year = d.getFullYear()
  
  const monthsShort = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const monthsLong = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  
  switch (format) {
    case 'short':
      return `${day}/${(month + 1).toString().padStart(2, '0')}`
    case 'medium':
      return `${day} ${monthsShort[month]}`
    case 'long':
      return `${day} de ${monthsLong[month]} de ${year}`
    default:
      return `${day} ${monthsShort[month]}`
  }
}

/**
 * Formata uma data relativa (hoje, ontem, etc)
 * @param date - Data a ser formatada (Date ou string ISO)
 * @returns String como "Hoje", "Ontem", "Há 3 dias", etc
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `Há ${diffDays} dias`
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} meses`
  return `Há ${Math.floor(diffDays / 365)} anos`
}

/**
 * Trunca um texto com reticências
 * @param text - Texto a ser truncado
 * @param maxLength - Comprimento máximo
 * @returns Texto truncado com "..." se necessário
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 3)}...`
}

/**
 * Formata valor de transação com sinal
 * @param value - Valor da transação
 * @param type - Tipo da transação ('income' ou 'expense')
 * @returns String formatada com sinal (+ ou -)
 */
export function formatTransactionValue(value: number, type: string): string {
  const normalizedType = type.toLowerCase()
  const prefix = normalizedType === 'income' ? '+' : '-'
  return `${prefix} ${formatCurrency(Math.abs(value))}`
}

/**
 * Normaliza tipo de transação para lowercase
 */
export function normalizeTransactionType(type: string): 'income' | 'expense' {
  return type.toLowerCase() as 'income' | 'expense'
}
