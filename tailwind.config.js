// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
    theme: {
    extend: {
      colors: {
        primary: '#0066ff',
        success: '#00c48c',
        warning: '#ff9800',
        danger: '#e74c3c',
        softGreen: '#d2f6e8',
        softRed: '#ffe4e4',
        softBlue: '#e1f5fe',
        textGreen: '#00b894',
        textBlue: '#0288d1',
      },
    },
  },
  plugins: [],
}