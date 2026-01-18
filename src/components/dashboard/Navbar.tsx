/**
 * Componente: Navbar do Dashboard
 * Barra superior com busca, filtros, membros e botão de nova transação
 * Conforme design Figma node 42-3099
 */

// Ícone de busca
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
  </svg>
)

// Ícone de filtros/sliders
const SettingsSlidersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z" />
  </svg>
)

// Ícone de calendário
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
  </svg>
)

// Imagens dos membros (em produção viriam do backend)
const memberImages = {
  pai: '/avatars/pai.jpg',
  mae: '/avatars/mae.jpg',
}

export default function Navbar() {
  return (
    <nav className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between w-full">
      {/* Lado esquerdo - Busca, filtros e membros */}
      <div className="flex flex-wrap gap-[8px] items-center">
        {/* Grupo de busca e filtros */}
        <div className="flex gap-[8px] items-center">
          {/* Campo de busca */}
          <button
            className="
              flex gap-[8px] items-center
              w-[175px]
              px-[24px] py-[12px]
              rounded-[100px]
              border border-[#9CA3AF]
              bg-background-primary
              text-text-primary
              hover:border-gray-500
              transition-colors
            "
          >
            <SearchIcon />
            <span className="text-[14px] font-normal leading-[20px] tracking-[0.3px]">Pesquisar</span>
          </button>

          {/* Botão de filtros */}
          <button
            className="
              flex items-center justify-center
              p-[12px]
              text-text-primary
              hover:opacity-80
              transition-opacity
            "
            aria-label="Filtros"
          >
            <SettingsSlidersIcon />
          </button>

          {/* Seletor de período */}
          <button
            className="
              flex gap-[8px] items-center
              px-[24px] py-[12px]
              rounded-[100px]
              border border-[#9CA3AF]
              bg-background-primary
              text-text-primary
              hover:border-gray-500
              transition-colors
            "
          >
            <CalendarIcon />
            <span className="text-[14px] font-normal leading-[20px] tracking-[0.3px]">01 Jan - 31 Jan 2026</span>
          </button>
        </div>

        {/* Avatares dos membros */}
        <div className="flex gap-[8px] items-center">
          {/* Avatar Pai */}
          <div
            className="
              w-[44px] h-[44px]
              rounded-[100px]
              border-2 border-white
              overflow-hidden
              bg-gray-200
            "
          >
            <img
              src={memberImages.pai}
              alt="Pai"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.parentElement!.innerHTML = '<span class="flex items-center justify-center w-full h-full text-white text-[14px] font-semibold bg-blue-500">P</span>'
              }}
            />
          </div>

          {/* Avatar Mãe */}
          <div
            className="
              w-[44px] h-[44px]
              rounded-[100px]
              border-2 border-white
              overflow-hidden
              bg-gray-200
            "
          >
            <img
              src={memberImages.mae}
              alt="Mãe"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.parentElement!.innerHTML = '<span class="flex items-center justify-center w-full h-full text-white text-[14px] font-semibold bg-green-500">M</span>'
              }}
            />
          </div>

          {/* Botão adicionar membro */}
          <button
            className="
              w-[44px] h-[44px]
              rounded-[100px]
              border-2 border-white
              bg-[#D1D5DB]
              flex items-center justify-center
              text-[#080B12]
              hover:bg-gray-400
              transition-colors
            "
            aria-label="Adicionar membro"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lado direito - Botão nova transação */}
      <button
        className="
          flex gap-[8px] items-center
          px-[16px] py-[12px]
          rounded-[100px]
          bg-[#080B12]
          text-white
          hover:opacity-90
          transition-opacity
          mt-[16px] lg:mt-0
        "
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        <span className="text-[18px] font-semibold leading-[24px] tracking-[0.3px]">Nova transação</span>
      </button>
    </nav>
  )
}
