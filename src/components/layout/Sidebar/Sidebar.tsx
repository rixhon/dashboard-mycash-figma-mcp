import { useSidebar } from '@/hooks/useSidebar'
import { ROUTES } from '@/constants'
import { FamilyMember } from '@/types'
import { Link, useLocation } from 'react-router-dom'

// Ícones SVG - 16px conforme Figma
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z" />
  </svg>
)

const CardsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z" />
    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z" />
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

interface SidebarProps {
  currentUser?: FamilyMember
}

interface NavigationItem {
  to: string
  icon: React.ReactNode
  label: string
}

/**
 * Componente Sidebar - Conforme design Figma node 42-3097
 * 
 * Funcionalidades:
 * - Expande/colapsa através do botão toggle
 * - Estado persistido no localStorage
 * - Transições suaves (300ms)
 * - Tooltips quando colapsado
 * - Layout principal ajusta automaticamente
 * 
 * Valores conforme Figma:
 * - Expanded: 300px width, 32px padding
 * - Collapsed: 80px width, 16px padding
 */
export default function Sidebar({ currentUser }: SidebarProps) {
  const { isExpanded, toggle } = useSidebar()
  const location = useLocation()

  // Mock user data
  const user = currentUser || {
    id: '1',
    name: 'Lucas Marte',
    email: 'lucasmarte@gmail.com',
    role: 'Usuário',
    avatarUrl: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Menu items conforme Figma - apenas Home e Cartões
  const navigationItems: NavigationItem[] = [
    { to: ROUTES.DASHBOARD, icon: <HomeIcon />, label: 'Home' },
    { to: ROUTES.CARDS, icon: <CardsIcon />, label: 'Cartões' },
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

        {/* Menu Sidebar */}
        <nav className={`flex flex-col ${isExpanded ? 'gap-[8px]' : 'gap-[8px]'} w-full`}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.to
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
                    ? 'bg-accent-yellow-green text-text-primary'
                    : 'bg-transparent text-text-primary hover:bg-gray-100'
                  }
                  ${isExpanded 
                    ? 'px-[16px] py-[12px] gap-[8px] justify-start' 
                    : 'p-[12px] justify-center'
                  }
                `}
              >
                {/* Ícone */}
                <span className="flex-shrink-0 w-4 h-4">
                  {item.icon}
                </span>

                {/* Label - apenas quando expandida */}
                {isExpanded && (
                  <span className="text-[18px] font-semibold leading-[24px] tracking-[0.3px] whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {/* Tooltip - apenas quando colapsada */}
                {!isExpanded && (
                  <div className="
                    absolute left-full ml-2
                    px-3 py-2
                    bg-gray-900 text-white
                    text-sm rounded-md
                    whitespace-nowrap
                    opacity-0 group-hover:opacity-100
                    pointer-events-none
                    transition-opacity duration-200 delay-300
                    z-50 shadow-lg
                  ">
                    {item.label}
                    <div className="
                      absolute right-full top-1/2 -translate-y-1/2
                      border-4 border-transparent border-r-gray-900
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
