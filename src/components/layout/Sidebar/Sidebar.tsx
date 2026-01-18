import { useSidebar } from '@/hooks/useSidebar'
import { ROUTES } from '@/constants'
import { FamilyMember } from '@/types'
import { Link, useLocation } from 'react-router-dom'

// ============================================================================
// ÍCONES SVG - 16px conforme Figma
// ============================================================================

// Dashboard/Home
const HomeIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={isActive ? '#C4E538' : 'currentColor'}>
    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z" />
  </svg>
)

// Objetivos/Metas
const GoalsIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={isActive ? '#C4E538' : 'currentColor'}>
    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" />
    <path d="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3zm0 8.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
    <circle cx="8" cy="8" r="2" />
  </svg>
)

// Cartões
const CardsIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={isActive ? '#C4E538' : 'currentColor'}>
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z" />
    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z" />
  </svg>
)

// Transações
const TransactionsIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={isActive ? '#C4E538' : 'currentColor'}>
    <path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z" />
  </svg>
)

// Perfil
const ProfileIcon = ({ isActive }: { isActive?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={isActive ? '#C4E538' : 'currentColor'}>
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" clipRule="evenodd" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" clipRule="evenodd" />
  </svg>
)

// ============================================================================
// TIPOS
// ============================================================================

interface SidebarProps {
  currentUser?: FamilyMember
}

interface NavigationItem {
  to: string
  icon: (props: { isActive?: boolean }) => JSX.Element
  label: string
}

/**
 * Componente Sidebar - Sistema de Navegação Desktop
 * 
 * Conforme documentação:
 * - 5 seções principais: Dashboard, Objetivos, Cartões, Transações, Perfil
 * - Estados: expandida (300px) e colapsada (80px)
 * - Item ativo: fundo preto (#080B12) com texto branco
 * - Ícones ativos: cor verde limão (#C4E538)
 * - Itens inativos: fundo transparente com texto cinza
 * - Tooltips quando colapsada (hover com delay)
 * - Transições suaves (300ms)
 * - Botão toggle na borda direita
 * - Perfil do usuário na parte inferior
 */
export default function Sidebar({ currentUser }: SidebarProps) {
  const { isExpanded, toggle } = useSidebar()
  const location = useLocation()

  // Mock user data - em produção viria do contexto de autenticação
  const user = currentUser || {
    id: '1',
    name: 'Lucas Marte',
    email: 'lucasmarte@gmail.com',
    role: 'Usuário',
    avatarUrl: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // 5 seções principais conforme documentação
  const navigationItems: NavigationItem[] = [
    { to: ROUTES.DASHBOARD, icon: HomeIcon, label: 'Dashboard' },
    { to: ROUTES.GOALS, icon: GoalsIcon, label: 'Objetivos' },
    { to: ROUTES.CARDS, icon: CardsIcon, label: 'Cartões' },
    { to: ROUTES.TRANSACTIONS, icon: TransactionsIcon, label: 'Transações' },
    { to: ROUTES.PROFILE, icon: ProfileIcon, label: 'Perfil' },
  ]

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen
        bg-background-primary border-r border-border-light
        flex flex-col justify-between
        transition-all duration-300 ease-in-out
        z-40 hidden lg:flex
        ${isExpanded ? 'w-[300px] p-[32px]' : 'w-[80px] p-[16px]'}
      `}
    >
      {/* Botão Toggle - Canto superior direito */}
      <button
        onClick={toggle}
        className="
          absolute
          flex items-center justify-center
          bg-background-primary
          rounded-full
          z-50
          focus:outline-none
          hover:scale-105
          transition-all duration-200
          w-6 h-6
          shadow-close-button
        "
        style={{
          right: '-12px',
          top: '35px',
        }}
        aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
        type="button"
      >
        {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </button>

      {/* Seção Superior - Logo e Menu */}
      <div className={`flex flex-col ${isExpanded ? 'gap-[56px]' : 'gap-[24px]'}`}>
        {/* Logo */}
        {isExpanded ? (
          <div className="flex items-center">
            <h1 className="text-[22px] font-semibold text-text-primary tracking-[0.3px] italic">
              <span className="underline decoration-2 decoration-text-primary underline-offset-2">Mycash</span>+
            </h1>
          </div>
        ) : (
          <div className="w-10 h-10 bg-button-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-button-text font-bold text-sm italic">m+</span>
          </div>
        )}

        {/* Menu Sidebar - 5 seções principais */}
        <nav className={`flex flex-col gap-[8px] w-full`}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.to
            const IconComponent = item.icon
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  relative flex items-center
                  transition-all duration-200 ease-in-out
                  group
                  rounded-full
                  ${isActive
                    ? 'bg-[#080B12] text-white'
                    : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-text-primary'
                  }
                  ${isExpanded 
                    ? 'px-[16px] py-[12px] gap-[8px] justify-start' 
                    : 'p-[12px] justify-center'
                  }
                `}
              >
                {/* Ícone - verde limão quando ativo */}
                <span className="flex-shrink-0 w-4 h-4">
                  <IconComponent isActive={isActive} />
                </span>

                {/* Label - apenas quando expandida */}
                {isExpanded && (
                  <span className="text-[16px] font-semibold leading-[24px] tracking-[0.3px] whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {/* Tooltip - apenas quando colapsada (hover com delay 300ms) */}
                {!isExpanded && (
                  <div className="
                    absolute left-full ml-3
                    px-3 py-2
                    bg-gray-900 text-white
                    text-sm font-medium rounded-lg
                    whitespace-nowrap
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    pointer-events-none
                    transition-all duration-200 delay-300
                    z-50 shadow-lg
                  ">
                    {item.label}
                    {/* Seta do tooltip */}
                    <div className="
                      absolute right-full top-1/2 -translate-y-1/2
                      border-[6px] border-transparent border-r-gray-900
                    " />
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Seção Inferior - Perfil do Usuário */}
      <div className={`flex flex-col ${isExpanded ? 'gap-[12px]' : 'gap-[8px]'} items-start`}>
        {isExpanded ? (
          <>
            {/* Avatar */}
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                  <span className="text-white font-semibold text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Dados do Usuário */}
            <div className="flex flex-col gap-[7px]">
              <p className="text-[16px] font-semibold leading-[20px] tracking-[0.3px] text-text-primary">
                {user.name}
              </p>
              <p className="text-[14px] font-normal leading-[20px] tracking-[0.3px] text-text-primary">
                {user.email}
              </p>
            </div>
          </>
        ) : (
          <div className="flex justify-center w-full">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                  <span className="text-white font-semibold text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
