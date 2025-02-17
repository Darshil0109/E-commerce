import textShadow from 'tailwindcss-textshadow';
export default {
  mode: 'jit',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        textShadow: {
          sm: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          md: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          lg: '3px 3px 6px rgba(0, 0, 0, 0.5)',
        },
        zIndex:{
          '-10':'-10',
          '-20':'-20',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [
      textShadow,
    ],
  };
  