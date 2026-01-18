# mycash+ - Dashboard Financeiro

Sistema de gestão financeira familiar desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **React Router** - Navegação
- **Supabase** - Backend (a integrar)

## 📦 Instalação

```bash
npm install
```

## 🛠️ Desenvolvimento

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes React organizados por domínio
│   ├── layout/    # Sidebar, Header, Layout
│   ├── dashboard/ # Componentes do dashboard
│   ├── cards/     # Componentes de cartões
│   ├── modals/    # Modais do sistema
│   └── ui/        # Componentes UI base
├── contexts/      # React Contexts
├── hooks/         # Custom hooks
├── pages/         # Páginas principais
├── styles/        # Estilos globais e tokens
├── types/          # Tipos TypeScript
├── utils/          # Funções utilitárias
└── constants/     # Constantes do sistema
```

## 🎨 Design System

O projeto utiliza um sistema de design baseado em tokens CSS, seguindo a hierarquia:
1. Variáveis Semânticas (prioridade)
2. Variáveis Primitivas
3. Conversão inteligente (nunca hardcoded)

## 📱 Responsividade

- **Mobile**: < 768px
- **Tablet**: ≥ 768px e < 1280px
- **Desktop**: ≥ 1280px e < 1920px
- **Wide/4K**: ≥ 1920px

## 📚 Documentação

Consulte `DOCUMENTATION.md` para detalhes completos do projeto.
