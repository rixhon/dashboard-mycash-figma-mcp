/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md': '768px',   // Tablet
        'lg': '1280px',  // Desktop
        'xl': '1920px',  // Wide / 4K
      },
      colors: {
        // Cores Semânticas
        'background-primary': 'var(--color-background-primary)',
        'background-secondary': 'var(--color-background-secondary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-placeholder': 'var(--color-text-placeholder)',
        'accent-yellow': 'var(--color-accent-yellow)',
        'accent-green': 'var(--color-accent-green)',
        'accent-red': 'var(--color-accent-red)',
        'accent-blue': 'var(--color-accent-blue)',
        'border-light': 'var(--color-border-light)',
        'button-primary': 'var(--color-button-primary)',
        'button-text': 'var(--color-button-text)',
        // Cores de Marca
        'brand-nubank': 'var(--color-brand-nubank)',
        'brand-inter': 'var(--color-brand-inter)',
        'brand-picpay': 'var(--color-brand-picpay)',
        // Cores Primitivas (Gray)
        'gray-50': 'var(--gray-50)',
        'gray-100': 'var(--gray-100)',
        'gray-200': 'var(--gray-200)',
        'gray-300': 'var(--gray-300)',
        'gray-400': 'var(--gray-400)',
        'gray-500': 'var(--gray-500)',
        'gray-600': 'var(--gray-600)',
        'gray-700': 'var(--gray-700)',
        'gray-800': 'var(--gray-800)',
        'gray-900': 'var(--gray-900)',
      },
      spacing: {
        'container': 'var(--spacing-container)',
        'card': 'var(--spacing-card)',
        'section': 'var(--spacing-section)',
        'item': 'var(--spacing-item)',
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      fontFamily: {
        'primary': 'var(--font-family-primary)',
      },
      fontSize: {
        'h1': 'var(--font-size-h1)',
        'h2': 'var(--font-size-h2)',
        'large-value': 'var(--font-size-large-value)',
        'body': 'var(--font-size-body)',
        'small': 'var(--font-size-small)',
      },
      fontWeight: {
        'bold': 'var(--font-weight-bold)',
        'regular': 'var(--font-weight-regular)',
      },
      borderRadius: {
        'sm': 'var(--border-radius-sm)',
        'md': 'var(--border-radius-md)',
        'lg': 'var(--border-radius-lg)',
        'full': 'var(--border-radius-full)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}
