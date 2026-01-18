/**
 * Componente: ExtratoDetalhado
 * Tabela de extrato com busca, filtros e paginação
 * Conforme design Figma node 42-3215
 */

interface ExtratoItem {
  id: string
  memberAvatar: string
  memberColor: string
  date: string
  description: string
  category: string
  account: string
  installments: string
  value: string
  type: 'income' | 'expense'
}

// Dados mockados - em produção viriam do backend
const extratoData: ExtratoItem[] = [
  {
    id: '1',
    memberAvatar: '',
    memberColor: '#F59E0B',
    date: '17/01/2026',
    description: 'Conta de água',
    category: 'Manutenção',
    account: 'Conta corrente',
    installments: '-',
    value: 'R$ 100,00',
    type: 'expense',
  },
  {
    id: '2',
    memberAvatar: '',
    memberColor: '#3B82F6',
    date: '17/01/2026',
    description: 'Conta de Luz',
    category: 'Manutenção',
    account: 'Conta corrente',
    installments: '-',
    value: 'R$ 150,00',
    type: 'expense',
  },
  {
    id: '3',
    memberAvatar: '',
    memberColor: '#8B5CF6',
    date: '17/01/2026',
    description: 'Passeio no parque',
    category: 'Lazer',
    account: 'Cartão XP',
    installments: '1/1',
    value: 'R$ 750,00',
    type: 'expense',
  },
]

// Ícone de documento/extrato - conforme Figma
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

// Ícone de seta para cima (despesa)
const ExpenseArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#E61E32">
    <path d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
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

export default function ExtratoDetalhado() {
  const totalItems = 17
  const currentPage = 1
  const itemsPerPage = 5
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <div
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
          
          <div className="flex flex-wrap gap-[16px] items-center">
            {/* Campo de busca */}
            <button
              className="
                flex gap-[8px] items-center
                px-[24px] py-[12px]
                rounded-full
                border border-gray-400
                bg-background-primary
                text-text-primary
                hover:border-gray-500
                transition-colors
              "
            >
              <SearchIcon />
              <span className="text-[14px] font-normal leading-[20px] tracking-[0.3px]">Buscar lançamentos</span>
            </button>
            
            {/* Filtro de tipo */}
            <button className="flex gap-[8px] items-center text-text-primary">
              <span className="text-[12px] font-semibold leading-[16px] tracking-[0.3px]">Despesas</span>
              <ChevronDownIcon />
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="w-full overflow-x-auto">
          {/* Header da tabela */}
          <div className="grid grid-cols-7 gap-[32px] pb-[24px] border-b border-border-light min-w-[900px]">
            <span className="text-[18px] font-semibold leading-[24px] tracking-[0.3px] text-text-primary">Membro</span>
            <span className="text-[18px] font-semibold leading-[24px] tracking-[0.3px] text-text-primary">Datas</span>
            <span className="text-[18px] font-semibold leading-[24px] tracking-[0.3px] text-text-primary">Descrição</span>
            <span className="text-[18px] font-semibold leading-[24px] tracking-[0.3px] text-text-primary">Categorias</span>
            <span className="text-[18px] font-semibold leading-[24px] tracking-[0.3px] text-text-primary">Conta/cartão</span>
            <span className="text-[18px] font-semibold leading-[24px] tracking-[0.3px] text-text-primary">Parcelas</span>
            <span className="text-[18px] font-semibold leading-[24px] tracking-[0.3px] text-text-primary">Valor</span>
          </div>

          {/* Linhas da tabela */}
          {extratoData.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-7 gap-[32px] py-[24px] border-b border-border-light items-center min-w-[900px]"
            >
              {/* Avatar do membro */}
              <div 
                className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: item.memberColor }}
              >
                {item.memberAvatar ? (
                  <img
                    src={item.memberAvatar}
                    alt="Membro"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-[10px] font-bold">
                    {item.description.charAt(0)}
                  </span>
                )}
              </div>

              {/* Data */}
              <span className="text-[12px] font-normal leading-[16px] text-text-primary">
                {item.date}
              </span>

              {/* Descrição com ícone */}
              <div className="flex gap-[8px] items-center">
                <ExpenseArrowIcon />
                <span className="text-[12px] font-normal leading-[16px] tracking-[0.3px] text-text-primary">
                  {item.description}
                </span>
              </div>

              {/* Categoria */}
              <span className="text-[12px] font-normal leading-[16px] text-text-primary">
                {item.category}
              </span>

              {/* Conta/cartão */}
              <span className="text-[12px] font-normal leading-[16px] text-text-primary">
                {item.account}
              </span>

              {/* Parcelas */}
              <span className="text-[12px] font-normal leading-[16px] text-text-primary">
                {item.installments}
              </span>

              {/* Valor */}
              <span className="text-[12px] font-normal leading-[16px] text-text-primary">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[14px] font-normal leading-[20px] text-text-primary">
            Mostrando 1 a {Math.min(itemsPerPage, totalItems)} de {totalItems}
          </span>

          <div className="flex gap-[8px] items-center">
            {/* Botão anterior */}
            <button
              className="
                w-8 h-8
                flex items-center justify-center
                text-text-primary
                hover:opacity-70
                transition-opacity
                disabled:opacity-30
              "
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              <ChevronLeftIcon />
            </button>

            {/* Números das páginas */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`
                  w-8 h-8
                  flex items-center justify-center
                  text-[14px] font-semibold
                  rounded
                  transition-colors
                  ${page === currentPage
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {page}
              </button>
            ))}

            {/* Botão próximo */}
            <button
              className="
                w-8 h-8
                flex items-center justify-center
                text-text-primary
                hover:opacity-70
                transition-opacity
                disabled:opacity-30
              "
              disabled={currentPage === totalPages}
              aria-label="Próxima página"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
