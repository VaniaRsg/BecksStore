<template>
  <speed-insights mode="auto" :debug="true"></speed-insights>
</template>

<script>
export default {
  // Registra o componente globalmente
  install(app) {
    app.component('SpeedInsights', window.speedInsights.VueSpeedInsights)
  }
}
</script>