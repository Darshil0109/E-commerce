export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        zIndex:{
          '-10':'-10',
          '-20':'-20',
        },
        screens:{
          'mid' : '920px',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  