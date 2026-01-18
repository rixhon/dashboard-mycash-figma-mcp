/**
 * Componente: ProximasDespesas
 * Lista de próximas despesas a vencer
 * Conforme design Figma node 42-3163
 */

interface DespesaItem {
  id: string
  title: string
  dueDate: string
  paymentMethod: string
  value: string
}

// Dados mockados - em produção viriam do backend
const despesasData: DespesaItem[] = [
  {
    id: '1',
    title: 'Conta de Luz',
    dueDate: 'Vence dia 21/01',
    paymentMethod: 'Crédito Nubank  **** 5897',
    value: 'R$ 154,00',
  },
  {
    id: '2',
    title: 'Conta de Luz',
    dueDate: 'Vence dia 21/01',
    paymentMethod: 'Crédito Nubank  **** 5897',
    value: 'R$ 154,00',
  },
  {
    id: '3',
    title: 'Conta de Luz',
    dueDate: 'Vence dia 21/01',
    paymentMethod: 'Crédito Nubank  **** 5897',
    value: 'R$ 154,00',
  },
  {
    id: '4',
    title: 'Conta de Luz',
    dueDate: 'Vence dia 21/01',
    paymentMethod: 'Crédito Nubank  **** 5897',
    value: 'R$ 154,00',
  },
  {
    id: '5',
    title: 'Conta de Luz',
    dueDate: 'Vence dia 21/01',
    paymentMethod: 'Crédito Nubank  **** 5897',
    value: 'R$ 154,00',
  },
]

// Ícone de cartão de crédito para o header - conforme Figma
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

// Ícone de check
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#15BE78">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
)

function DespesaItemCard({ title, dueDate, paymentMethod, value }: Omit<DespesaItem, 'id'>) {
  return (
    <div className="flex items-start justify-between gap-[16px]">
      {/* Informações da despesa */}
      <div className="flex flex-col gap-[4px]">
        <p className="text-[20px] font-bold leading-[28px] text-text-primary">
          {title}
        </p>
        <p className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-text-primary">
          {dueDate}
        </p>
        <p className="text-[12px] font-normal leading-[16px] tracking-[0.3px] text-text-primary">
          {paymentMethod}
        </p>
      </div>
      
      {/* Valor e botão de check */}
      <div className="flex gap-[12px] items-center shrink-0">
        <p className="text-[16px] font-semibold leading-[20px] tracking-[0.3px] text-text-primary">
          {value}
        </p>
        <button
          className="
            w-8 h-8
            rounded-full
            border border-border-light
            bg-background-primary
            flex items-center justify-center
            hover:bg-gray-50
            transition-colors
          "
          aria-label="Marcar como pago"
        >
          <CheckIcon />
        </button>
      </div>
    </div>
  )
}

export default function ProximasDespesas() {
  return (
    <div
      className="
        bg-background-primary
        rounded-[20px]
        border border-border-light
        w-full
        min-w-0
      "
    >
      <div className="flex flex-col gap-[32px] p-[32px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-[8px] items-center">
            <CreditCardIcon />
            <h3 className="text-[20px] font-bold leading-[28px] text-text-primary">
              Próximas despesas
            </h3>
          </div>
          <button
            className="
              w-8 h-8
              flex items-center justify-center
              text-text-primary
              hover:opacity-70
              transition-opacity
            "
            aria-label="Adicionar despesa"
          >
            <PlusIcon />
          </button>
        </div>

        {/* Lista de despesas */}
        <div className="flex flex-col gap-[32px]">
          {despesasData.map((despesa) => (
            <DespesaItemCard
              key={despesa.id}
              title={despesa.title}
              dueDate={despesa.dueDate}
              paymentMethod={despesa.paymentMethod}
              value={despesa.value}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
