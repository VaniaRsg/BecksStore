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
                    position: relative;"> 
          <div class="image-container">
            <img src="${post.imagem}" class="card-img-top" alt="${post.titulo}">
            <div class="overlay-content" data-post-id="${post.id}" style="display: none;">
              <div class="overlay-header">
                <h3>${post.titulo}</h3>
              </div>
              
          </div>
          
          <div class="card-body">
            <small class="text-muted">
            ${this.formatDate(post.data)}
            </small>
            
            <h2 class="posttitle">${post.titulo}</h2>

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
                        <div class="action-buttons mt-4">
              ${post.buyLink ? 
                `<a href="${post.buyLink}" target="_blank" class="btn btn-buy me-2">
                  BUY
                </a>` : ''}
              ${post.demoLink ? 
                `<a href="${post.demoLink}" target="_blank" class="btn btn-demo">
                  DEMO
                </a>` : ''}
            </div>
          </div>
        </div>
            
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

.posttitle {
font-size: 1.5rem;
color:rgb(255, 255, 255);
text-shadow: 
        0 0 2px rgb(255, 0, 255),
        0 0 5px rgb(255, 0, 242),
        0 0 15px rgb(255, 17, 243);
filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.46));
}

.overlay-body {
  font-size: 0.9rem;
}

.content-line {
text-align: justify;
}

.btn-buy {
  background: linear-gradient(45deg,rgb(255, 0, 200),rgb(0, 238, 255));
  border: 1px solid rgb(255, 255, 255);
  color: white !important;
  transition: all 0.3s ease;
}

.btn-demo {
  background: linear-gradient(45deg,rgb(0, 204, 255),rgb(225, 0, 255));
  border: 1px solid rgb(255, 255, 255);
  color: white !important;
  transition: all 0.3s ease;
}

.action-buttons {
  display: flex;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  margin-top: 20px;
}

.btn-buy:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgb(0, 238, 255);
}

.btn-demo:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgb(0, 247, 255);
}


`;
document.head.appendChild(style);

// Inicialização
document.addEventListener('DOMContentLoaded', () => new BlogManager());