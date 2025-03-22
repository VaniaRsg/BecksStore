// Adicione este trecho para inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (window.speedInsights) {
      window.speedInsights.init({
        dsn: 'SUA_CHAVE_DNS_AQUI', // Obtenha em https://vercel.com/docs/speed-insights
        framework: 'vue'
      })
    }
  })