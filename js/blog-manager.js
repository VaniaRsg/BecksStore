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
              <div class="overlay-body">${post.conteudo  || post.resumo}
              </div>
               <div class="specs-grid">
                ${post.marcas ? `
                <div class="specs-category">
                  <h5>Marcas Compatíveis:</h5>
                  <div class="specs-items">${post.marcas.join(', ')}</div>
                </div>` : ''}
            </div>
          </div>
          
          <div class="card-body">
            <small class="text-muted">${this.formatDate(post.data)}</small>
            <h2 class="neon-title">${post.titulo}</h2>
            <p>${post.resumo}</p>
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

  formatContent(content) {
    return content
      .replace(/\n/g, '<br>')
      .replace(/- (.*?)(<br>|$)/g, '<li>$1</li>')
      .replace(/<li>.*?<\/li>/g, '<ul class="custom-list">$&</ul>');
  }

}



// CSS necessário
const style = document.createElement('style');
style.textContent = `
  .image-container {
    position: relative;
    overflow: hidden;
  }

.content-line {
  margin-bottom: 1.2rem;
  padding-left: 1.5rem;
  position: relative;
}

.content-line::before {
  content: '◆';
  color: #00ffff;
  position: absolute;
  left: 0;
  font-size: 0.8em;
  margin-right: 8px;
  filter: drop-shadow(0 0 4px rgba(0,255,255,0.5));
}

  .overlay-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(32, 32, 32, 0.69);
    backdrop-filter: blur(12px) saturate(180%);
    color:rgb(255, 255, 255);
    padding: 20px;
    overflow-y: auto;
    transition: opacity 0.3s ease;
    font-family: 'Segoe UI', system-ui;
  }

  .overlay-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .close-overlay {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0 8px;
    transition: transform 0.2s;
  }

  .close-overlay:hover {
    transform: scale(1.2);
  }

  .overlay-body {
    line-height: 1.6;
    opacity: 0.9;
  }

  .show-overlay {
    transition: all 0.3s ease;
  }

  .show-overlay:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(19, 19, 19, 0.84);
  }
`;
document.head.appendChild(style);

// Inicialização
document.addEventListener('DOMContentLoaded', () => new BlogManager());