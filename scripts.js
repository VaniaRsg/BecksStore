var scrollSpy = new bootstrap.ScrollSpy(document.body, {
  target: '#navbar-example'
})


  let isLiked = false;
let likeCount = 0;
const likeBtn = document.querySelector('.like-btn');
const likeIcon = likeBtn.querySelector('i');

function toggleLike() {
  isLiked = !isLiked;
  likeBtn.classList.toggle('liked');
  likeCount = isLiked ? likeCount + 1 : likeCount - 1;
  document.getElementById('likeCounter').textContent = likeCount;
  
  // Troca o ícone
  likeIcon.classList.toggle('bi-heart');
  likeIcon.classList.toggle('bi-heart-fill');
}

// Sistema de Compartilhamento
function sharePost() {
  if (navigator.share) {
    navigator.share({
      title: 'Instagram Post',
      url: window.location.href
    });
  } else {
    // Fallback para desktop
    const tempInput = document.createElement('input');
    tempInput.value = window.location.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Link copiado!');
  }
}


document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  let isValid = true;

  // Função genérica de validação
  const validateField = (field, condition, errorMsg) => {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-msg') || document.createElement('small');
    
    if (!condition) {
      if (!errorElement.classList.contains('error-msg')) {
        errorElement.className = 'error-msg text-danger d-block mt-1';
        formGroup.appendChild(errorElement);
      }
      errorElement.textContent = errorMsg;
      isValid = false;
    } else {
      if (errorElement) errorElement.remove();
    }
  };

  // Validação dos campos
  validateField(
    document.getElementById('name'),
    document.getElementById('name').value.trim().length >= 3,
    'Nome deve ter pelo menos 3 caracteres'
  );

  validateField(
    document.getElementById('slname'),
    document.getElementById('slname').value.trim().length > 0,
    'SL Name é obrigatório'
  );

  validateField(
    document.getElementById('email'),
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('email').value),
    'E-mail inválido'
  );

  validateField(
    document.getElementById('message'),
    document.getElementById('message').value.trim().length >= 10,
    'Mensagem muito curta (mínimo 10 caracteres)'
  );

  // Validação de arquivo
  const fileInput = document.querySelector('input[type="file"]');
  validateField(
    fileInput,
    fileInput.files.length === 0 || (
      fileInput.files[0].size <= 5 * 1024 * 1024 && // 5MB
      ['application/pdf', 'image/png', 'image/jpeg'].includes(fileInput.files[0].type)
    ),
    'Arquivo inválido (PDF, PNG ou JPG até 5MB)'
  );

  if (isValid) {
    this.submit();
  }
});

// Validação em tempo real
['name', 'slname', 'email', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', function() {
    const formGroup = this.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-msg');
    if (errorElement) errorElement.remove();
  });
});