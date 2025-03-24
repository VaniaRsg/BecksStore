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