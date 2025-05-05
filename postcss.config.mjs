// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // ← aquí, el plugin “separado”
    autoprefixer: {},
  },
};

export default config;
