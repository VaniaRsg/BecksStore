// Foco automático ao carregar
window.addEventListener('DOMContentLoaded', () => {
    const frame = document.getElementById('marketFrame');
    frame.contentWindow.focus();
  });
  
  // Função de overlay
  function focusFrame() {
    const frame = document.getElementById('marketFrame');
    frame.style.pointerEvents = 'auto';
    frame.contentWindow.focus();
    document.querySelector('.frame-overlay').style.display = 'none';
  }
  
  // Reset de segurança
  window.addEventListener('blur', () => {
    const frame = document.getElementById('marketFrame');
    if(document.activeElement === frame) {
      frame.style.pointerEvents = 'none';
      document.querySelector('.frame-overlay').style.display = 'flex';
    }
  });

  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      event.target.classList.add("active");
      setTimeout(() => {
        event.target.classList.remove("active");
      }, 500);
    });
  });