/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '2.5rem'
      }
    },
    fontFamily: {
      sans: ['open-sans', ...defaultTheme.fontFamily.serif]
    },
    fontSize: {
      xxs: '0.5rem',
      ...defaultTheme.fontSize
    },
    extend: {
      borderRadius: {
        '4xl': '2rem',
        '6xl': '3rem'
      },
      fontFamily: {
        KoHo: ['KoHo', 'sans-serif'],
        'scala-sans': ['ff-scala-sans-pro', 'sans-serif']
      }
    }
  }
};
