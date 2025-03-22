class BlogManager {
    constructor() {
      this.postsContainer = document.getElementById('posts-container');
      this.loadPosts();
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
                        box-shadow: none !important;"> <!-- Remove sombra padrão -->
              <img src="${post.imagem}" class="card-img-top" alt="${post.titulo}">
              <div class="card-body">
                <small class="text-muted">${this.formatDate(post.data)}</small>
                <h2 class="neon-title">${post.titulo}</h2>
                <p>${post.resumo}</p>
                <a href="post.html?id=${post.id}" class="btn btn-becks">Ver Detalhes</a>
              </div>
            </div>
          </article>

      `).join('');
    }
  
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
  }
  
  // Inicialização
  document.addEventListener('DOMContentLoaded', () => new BlogManager());