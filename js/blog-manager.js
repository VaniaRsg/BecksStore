class BlogManager {
  constructor() {
    this.postsContainer = document.getElementById('posts-container');
    this.loadPosts();
    this.setupEventListeners();
  }

  async loadPosts() {
    try {
      const response = await fetch('posts/data.json');
      const data = await response.json();
      this.renderPosts(data.posts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  }

  renderPosts(posts) {
    this.postsContainer.innerHTML = posts.map(post => `
      <article class="post-card mb-5">
        <div class="card" 
            style="background-color: #181818;
                    border: 2px solid #FFFFFF;
                    box-shadow: none !important;
                    position: relative;"> <!-- Added relative positioning -->
          <div class="image-container">
            <img src="${post.imagem}" class="card-img-top" alt="${post.titulo}">
            <div class="overlay-content" data-post-id="${post.id}" style="display: none;">
              <div class="overlay-header">
                <h3>${post.titulo}</h3>
                <button class="close-overlay">&times;</button>
              </div>
              
          </div>
          
          <div class="card-body">
            <small class="text-muted">
            ${this.formatDate(post.data)}
            </small>
            
            <h2 class="neon-title">${post.titulo}</h2>

            <div class="overlay-body">
              ${Array.isArray(post.conteudo) ? 
                post.conteudo.map(item => `<p class="content-line">${item}</p>`).join('') : 
                post.conteudo}
            </div>

            <div class="specs-grid">
               ${post.marcas ? `
            <div class="specs-category">
                <h5>Marcas Compatíveis:</h5>
                <ul class="specs-list">
                ${post.marcas.map(marca => `<li class="specs-item">${marca}</li>`).join('')}
                </ul>
            </div>` : ''}
            
            <button class="btn btn-becks show-overlay" data-post-id="${post.id}">Ver Detalhes</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  setupEventListeners() {
    this.postsContainer.addEventListener('click', (e) => {
      // Abrir overlay
      if (e.target.classList.contains('show-overlay')) {
        const postId = e.target.dataset.postId;
        const overlay = this.postsContainer.querySelector(`.overlay-content[data-post-id="${postId}"]`);
        overlay.style.display = 'block';
      }

      // Fechar overlay
      if (e.target.classList.contains('close-overlay')) {
        const overlay = e.target.closest('.overlay-content');
        overlay.style.display = 'none';
      }
    });
  }

  formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  }

 

}



// CSS necessário
const style = document.createElement('style');
style.textContent = `
  .image-container {
    position: relative;
    overflow: hidden;
  }

.overlay-body {
  font-size: 0.9rem;
}

.content-line {
text-align: justify;
}


`;
document.head.appendChild(style);

// Inicialização
document.addEventListener('DOMContentLoaded', () => new BlogManager());