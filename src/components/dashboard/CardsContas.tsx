/**
 * Componente: CardsContas
 * Seção de cards e contas bancárias
 * Conforme design Figma node 42-3111
 */

interface CardItemData {
  id: string
  name: string
  value: string
  dueDate: string
  cardNumber: string
  brandColor: string
  logoIcon: React.ReactNode
}

// Ícone de cartão de crédito para o header
const CreditCardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6ZM4 8H20V6H4V8ZM4 18H20V10H4V18Z" />
  </svg>
)

// Ícone de mais/adicionar
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z" />
  </svg>
)

// Ícone de seta para direita
const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.92 11.62C17.8724 11.4973 17.801 11.3851 17.71 11.29L12.71 6.29C12.6168 6.19676 12.5061 6.1228 12.3842 6.07234C12.2624 6.02188 12.1319 5.99591 12 5.99591C11.7337 5.99591 11.4783 6.1017 11.29 6.29C11.1968 6.38324 11.1228 6.49393 11.0723 6.61575C11.0219 6.73758 10.9959 6.86814 10.9959 7C10.9959 7.2663 11.1017 7.5217 11.29 7.71L14.59 11H7C6.73478 11 6.48043 11.1054 6.29289 11.2929C6.10536 11.4804 6 11.7348 6 12C6 12.2652 6.10536 12.5196 6.29289 12.7071C6.48043 12.8946 6.73478 13 7 13H14.59L11.29 16.29C11.1963 16.383 11.1219 16.4936 11.0711 16.6154C11.0203 16.7373 10.9942 16.868 10.9942 17C10.9942 17.132 11.0203 17.2627 11.0711 17.3846C11.1219 17.5064 11.1963 17.617 11.29 17.71C11.383 17.8037 11.4936 17.8781 11.6154 17.9289C11.7373 17.9797 11.868 18.0058 12 18.0058C12.132 18.0058 12.2627 17.9797 12.3846 17.9289C12.5064 17.8781 12.617 17.8037 12.71 17.71L17.71 12.71C17.801 12.6149 17.8724 12.5028 17.92 12.38C18.02 12.1365 18.02 11.8635 17.92 11.62Z" />
  </svg>
)

// Logo Nubank (roxo)
const NubankLogo = () => (
  <div className="w-4 h-4 rounded-[2px] bg-[#8A05BE] flex items-center justify-center">
    <span className="text-white text-[8px] font-bold">Nu</span>
  </div>
)

// Logo Inter (laranja)
const InterLogo = () => (
  <div className="w-4 h-4 rounded-[2px] bg-[#FF6B35] flex items-center justify-center">
    <span className="text-white text-[7px] font-bold">inter</span>
  </div>
)

// Logo Picpay (verde)
const PicpayLogo = () => (
  <div className="w-4 h-4 rounded-[2px] bg-[#21C25E] flex items-center justify-center">
    <span className="text-white text-[8px] font-bold">P</span>
  </div>
)

// Dados mockados - em produção viriam do backend
const cardsData: CardItemData[] = [
  {
    id: '1',
    name: 'Nubank',
    value: 'R$ 120,00',
    dueDate: 'Vence dia 10',
    cardNumber: '**** 5897',
    brandColor: '#8A05BE',
    logoIcon: <NubankLogo />,
  },
  {
    id: '2',
    name: 'Inter',
    value: 'R$ 2.300,00',
    dueDate: 'Vence dia 21',
    cardNumber: '**** 5897',
    brandColor: '#FF6B35',
    logoIcon: <InterLogo />,
  },
  {
    id: '3',
    name: 'Picpay',
    value: 'R$ 17.000,00',
    dueDate: 'Vence dia 12',
    cardNumber: '**** 5897',
    brandColor: '#21C25E',
    logoIcon: <PicpayLogo />,
  },
]

function CardItem({ name, value, dueDate, cardNumber, logoIcon }: Omit<CardItemData, 'id' | 'brandColor'>) {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex flex-col gap-[4px]">
        {/* Nome do banco com logo */}
        <div className="flex gap-[8px] items-center">
          {logoIcon}
          <p className="text-[14px] font-normal leading-[20px] tracking-[0.3px] text-text-primary">
            {name}
          </p>
        </div>
        {/* Valor */}
        <p className="text-[24px] font-bold leading-[32px] text-text-primary">
          {value}
        </p>
        {/* Data de vencimento */}
        <p className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-text-primary">
          {dueDate}
        </p>
      </div>
      {/* Número do cartão */}
      <p className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-text-primary">
        {cardNumber}
      </p>
    </div>
  )
}

export default function CardsContas() {
  return (
    <div
      className="
        bg-background-primary
        rounded-[20px]
        border border-border-light
        w-full xl:flex-1
        min-w-0
      "
    >
      <div className="flex flex-col gap-[32px] p-[32px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-[8px] items-center">
            <CreditCardIcon />
            <h3 className="text-[20px] font-bold leading-[28px] text-text-primary">
              Cards & contas
            </h3>
          </div>
          <div className="flex gap-[12px]">
            <button
              className="
                w-8 h-8
                flex items-center justify-center
                text-text-primary
                hover:opacity-70
                transition-opacity
              "
              aria-label="Adicionar card"
            >
              <PlusIcon />
            </button>
            <button
              className="
                w-8 h-8
                flex items-center justify-center
                text-text-primary
                hover:opacity-70
                transition-opacity
              "
              aria-label="Ver todos"
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        {/* Lista de cards */}
        <div className="flex flex-col gap-[32px]">
          {cardsData.map((card) => (
            <CardItem
              key={card.id}
              name={card.name}
              value={card.value}
              dueDate={card.dueDate}
              cardNumber={card.cardNumber}
              logoIcon={card.logoIcon}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
