/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        card: 'var(--bg-card)',
        dark: 'var(--bg-dark)',
        main: 'var(--text-main)',
        muted: 'var(--text-muted)',
        'border-custom': 'var(--border-color)',
        'hover-bg': 'var(--hover-bg)',
      },
      width: {
        'sidebar': '250px',
      },
      margin: {
        'sidebar': '250px',
      },
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [],
}
