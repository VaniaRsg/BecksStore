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
      const validPosts = data.posts.filter(post => {
        const postDate = new Date(post.data);
        const today = new Date();
        
        // Considera posts até 23:59:59 do dia atual
        today.setHours(23, 59, 59, 999);
        
        return postDate <= today && !isNaN(postDate);
      });
      
      // Ordena os posts por data (do mais recente para o mais antigo)
      const sortedPosts = data.posts.sort((a, b) => 
        new Date(b.data) - new Date(a.data)
      );

      // Separa os posts
      this.activePosts = [sortedPosts[0]]; // Último post
      this.archivedPosts = sortedPosts.slice(1); // Restante arquivado
      
      this.renderPosts(this.activePosts);
      
      this.buildArchiveHierarchy(); // Adicione esta linha
      } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  }

  setupPostLinks() {
  document.querySelectorAll('.post-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = parseInt(link.closest('.archive-post').dataset.id);
      const selectedPost = this.archivedPosts.find(p => p.id === postId);
      
      if (selectedPost) {
        // Remove o post atual e exibe o selecionado
        this.postsContainer.innerHTML = '';
        this.renderPosts([selectedPost]);
      }
    });
  });
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

  buildArchiveHierarchy() {
    const archiveNav = document.getElementById('archive-nav');
    const hierarchy = this.groupPostsByDate();
    
    let html = '';
    for (const [year, months] of Object.entries(hierarchy)) {
      html += `
        <div class="archive-year">
          <div class="archive-header" data-year="${year}">
            <i class="bi bi-caret-right-fill toggle-icon"></i>
            ${year}
          </div>
          <div class="archive-months collapse">
      `;
      
      for (const [month, days] of Object.entries(months)) {
        const monthName = new Date(0, month - 1).toLocaleString('pt-BR', { month: 'long' });
        html += `
          <div class="archive-month">
            <div class="archive-header" data-month="${month}" data-year="${year}">
              <i class="bi bi-caret-right-fill toggle-icon"></i>
              ${monthName}
            </div>
            <div class="archive-days collapse">
        `;

        for (const [day, posts] of Object.entries(days)) {
          html += `
            <div class="archive-day">
              <div class="archive-header" data-day="${day}" data-month="${month}" data-year="${year}">
                <i class="bi bi-caret-right-fill toggle-icon"></i>
                ${day}
              </div>
              <div class="archive-posts collapse">
                ${posts.map(post => `
                  <div class="archive-post" data-post-id="${post.id}">
                    ${post.titulo}
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }

        html += `</div></div>`;
      }
      html += `</div></div>`;
    }
    
    archiveNav.innerHTML = html;
    this.setupArchiveInteractions();
  }

  groupPostsByDate() {
    return this.archivedPosts.reduce((acc, post) => {
      const date = new Date(post.data);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = {};
      if (!acc[year][month][day]) acc[year][month][day] = [];
      if (isNaN(new Date(post.data))) {
        console.warn('Post com data inválida:', post.id);
        return acc;
      }
      
      acc[year][month][day] = acc[year][month][day].sort((a, b) => 
        new Date(b.data) - new Date(a.data)
      );
      
      return acc;
    }, {});
  }

  setupArchiveInteractions() {
    document.querySelectorAll('.archive-header').forEach(header => {
      header.addEventListener('click', (e) => {
        const target = e.currentTarget;
        const icon = target.querySelector('.toggle-icon');
        const collapseDiv = target.nextElementSibling;
        
        // Alterna a visualização
        const bsCollapse = new bootstrap.Collapse(collapseDiv, { toggle: true });
        
        // Rotaciona o ícone
        icon.classList.toggle('bi-caret-right-fill');
        icon.classList.toggle('bi-caret-down-fill');
        
        // Se for um post, exibe o conteúdo
        if (target.classList.contains('archive-post')) {
          const postId = target.dataset.postId;
          const post = this.archivedPosts.find(p => p.id === postId);
          this.showArchivedPost(post);
        }
      });
    });
  }

  renderArchiveHierarchy() {
    const archiveNav = document.getElementById('archive-nav');
    let html = '';
  
    for (const [year, months] of Object.entries(this.archivedPostsByDate)) {
      html += `<div class="archive-year">🗓️ ${year}</div>`;
      
      for (const [month, days] of Object.entries(months)) {
        html += `<div class="archive-month">📅 ${this.getMonthName(month)}</div>`;
        
        for (const [day, posts] of Object.entries(days)) {
          html += `<div class="archive-day">📌 ${day}</div>`;
          
          // Adiciona links clicáveis com títulos
          posts.forEach(post => {
            html += `
              <div class="archive-post" data-id="${post.id}">
                <a href="#" class="post-link">📝 ${post.titulo}</a>
              </div>
            `;
          });
        }
      }
    }
    archiveNav.innerHTML = html;
    
    // Novo: Adiciona eventos aos links
    this.setupPostLinks();
  }
  

  showArchivedPost(post) {
    this.renderPosts([post]);
    const offcanvasEl = document.getElementById('postsArchive');
    const offcanvas = new bootstrap.Offcanvas(offcanvasEl);
    offcanvas.hide();
  }

  addNavigationLink() {
    const navLink = `
      <div class="post-nav">
        <button class="prev">◀</button>
        <button class="next">▶</button>
      </div>
    `;
    this.postsContainer.insertAdjacentHTML('beforeend', navLink);
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
