class BlogManager {
  constructor() {
    this.postsContainer = document.getElementById('posts-container');
    this.currentIndex = 0; // Índice do post atual exibido
    this.archivedPosts = []; // Lista de posts arquivados
    this.activePosts = []; // Lista com apenas o último post
    this.loadPosts();
    this.setupEventListeners();
  }

  async loadPosts() {
    try {
      const response = await fetch('posts/data.json');
      const data = await response.json();
      
      // Ordena os posts por data (do mais recente para o mais antigo)
      const sortedPosts = data.posts.sort((a, b) => 
        new Date(b.data) - new Date(a.data)
      );

      // Separa os posts
      this.activePosts = [sortedPosts[0]]; // Último post
      this.archivedPosts = sortedPosts.slice(1); // Restante arquivado
      
      this.renderPosts(this.activePosts);
      
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  }

  renderPosts(posts) {
    this.postsContainer.innerHTML = posts.map(post => `
      <article class="post-card">
        <div class="card">
          <div class="image-container">
            <img src="${post.imagem}" class="card-img-top" alt="${post.titulo}">         
          </div>   
          <div class="instagram-controls-container">
              
              <div class="control-group">
                <button class="instagram-btn like-btn" onclick="toggleLike()">
                  <i class="bi bi-heart fs-4"></i>
                </button>
                <span class="counter" id="likeCounter">0</span>
              </div>

              <div class="control-group">
                <button class="instagram-btn">
                  <i class="bi bi-chat fs-4"></i>
                </button>
                <span class="counter" id="commentCounter">0</span>
              </div>

              <button class="instagram-btn share-btn" onclick="sharePost()">
                <i class="bi bi-send fs-4"></i>
              </button>
            </div>

          <div class="card-body">
            <small class="text-muted">
              ${this.formatDate(post.data)}
            </small>
            
            <h2 class="posttitle">${post.titulo}</h2>
            
            <div class="overlay-body">
              ${Array.isArray(post.conteudo) 
                ? post.conteudo.map(item => `<p>${item}</p>`).join('')
                : post.conteudo}
            </div>
            
            ${post.marcas ? `
              <div class="specs-grid">
                <div class="specs-category">
                  <h5>Marcas Compatíveis:</h5>
                  <ul class="specs-list">
                    ${post.marcas.map(marca => `
                      <li class="specs-item">${marca}</li>
                    `).join('')}
                  </ul>     
                  
                  <div class="action-buttons mt-4">
                    ${post.buyLink ? `
                      <a href="${post.buyLink}" target="_blank" class="btn btn-buy me-2">
                        BUY
                      </a>
                    ` : ''}
                    
                    ${post.demoLink ? `
                      <a href="${post.demoLink}" target="_blank" class="btn btn-demo">
                        DEMO
                      </a>
                    ` : ''}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </article>
    `).join('');
    
    this.addNavigationLink();
  }




  
  setupEventListeners() {
    const container = this.postsContainer;
    
    container.addEventListener('wheel', (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    });
  
    document.querySelector('.post-nav').addEventListener('click', (e) => {
      if (e.target.classList.contains('next')) {
        container.scrollBy({ left: 320, behavior: 'smooth' });
      } else if (e.target.classList.contains('prev')) {
        container.scrollBy({ left: -320, behavior: 'smooth' });
      }
    });
  }

  formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  }

 

}


// Inicialização
document.addEventListener('DOMContentLoaded', () => new BlogManager());

// Ajuste automático de altura
function adjustLayout() {
  const sidenav = document.querySelector('.sidenav');
  const headerHeight = document.querySelector('header').offsetHeight;
  
  if(window.innerWidth > 992) {
    sidenav.style.height = `calc(100vh - ${headerHeight + 40}px)`;
  }
}

window.addEventListener('resize', adjustLayout);
adjustLayout();
