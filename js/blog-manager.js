class BlogManager {
  constructor() {
    this.postsContainer = document.getElementById('posts-container');
    this.currentIndex = 0; // Índice do post atual exibido
    this.archivedPosts = []; // Lista de posts arquivados
    this.activePosts = []; // Lista com apenas o último post
    this.loadPosts();
    this.setupEventListeners();
    this.loadInteractions();
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
      const sortedPosts = validPosts.sort((a, b) => 
        new Date(b.data) - new Date(a.data)
      );

      // Separa os posts
      this.activePosts = [sortedPosts[0]]; // Último post
      this.archivedPosts = sortedPosts.slice(1); // Restante arquivado
      
      this.renderPosts(this.activePosts);
      this.buildArchiveHierarchy();
      this.renderLastPosts(); // Adicione esta linha
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
          // Renderiza o post selecionado
          this.postsContainer.innerHTML = '';
          this.renderPosts([selectedPost]);
          
          // Scroll para a seção home
          document.getElementById('home').scrollIntoView({ 
            behavior: 'smooth' // Animação suave
          });
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
                  <h5>Compatible Body:</h5>
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

 
  renderLastPosts() {
    const lastPostsContainer = document.querySelector('.lastposts');
    if (!lastPostsContainer) return;
  
    const lastTwoPosts = this.archivedPosts.slice(0, 4);
    const currentPost = this.activePosts[0];
    // <div class="current-post mb-4">
    //<h6 class="sidebar-title">Post Atual:</h6>
    //<div class="sidebar-post" data-id="${currentPost.id}">
    //  <a href="#" class="post-link">
    //    <img src="${currentPost.imagem}" class="sidebar-thumb" alt="${currentPost.titulo}">
    //    <h6 class="sidebar-post-title">${currentPost.titulo}</h6>
    //  </a>
    //  <p class="sidebar-excerpt">${this.getExcerpt(currentPost.conteudo, 10)}</p>
    //</div>
    //</div>
    let html = `
      
  
      <div class="last-posts">
        <h6 class="sidebar-title">Posts Recentes:</h6>
        ${lastTwoPosts.map(post => `
          <div class="sidebar-post" data-id="${post.id}">
            <a href="#" class="post-link">
              <img src="${post.imagem}" class="sidebar-thumb" alt="${post.titulo}">
              <h6 class="sidebar-post-title">${post.titulo}</h6>
            </a>
            <p class="sidebar-excerpt">${this.getExcerpt(post.conteudo, 10)}</p>
          </div>
        `).join('')}
      </div>
    `;
  
    lastPostsContainer.innerHTML = html;
  }
  
  getExcerpt(content, maxWords) {
    const text = Array.isArray(content) 
      ? content.join(' ') 
      : content;
    
    const words = text.split(' ').slice(0, maxWords);
    return words.join(' ') + (words.length >= maxWords ? '...' : '');
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
    
    // Iterar sobre os anos
    for (const [year, months] of Object.entries(hierarchy)) {
      html += `
        <div class="archive-year">
          <div class="archive-header" data-year="${year}">
            <i class="bi bi-caret-right-fill toggle-icon"></i>
            ${year}
          </div>
          <div class="archive-months collapse">
      `;
  
      // Iterar sobre os meses
      for (const [month, days] of Object.entries(months)) {
        const monthName = new Date(year, month - 1).toLocaleString('pt-BR', { month: 'long' });
        html += `
          <div class="archive-month">
            <div class="archive-header" data-month="${month}">
              <i class="bi bi-caret-right-fill toggle-icon"></i>
              ${monthName}
            </div>
            <div class="archive-days collapse">
        `;
  
        // Iterar sobre os dias
        for (const [day, posts] of Object.entries(days)) {
          html += `
            <div class="archive-day">
              <div class="archive-header" data-day="${day}">
                ✦ 
                ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}
              </div>
              <div class="archive-posts collapse show">
          `;
  
          // Adicionar posts
          posts.forEach(post => {
            html += `
              <div class="archive-post" data-id="${post.id}">
                <a href="#" class="post-link">${post.titulo}</a>
              </div>
            `;
          });
  
          html += `</div></div>`; // Fechar day
        }
  
        html += `</div></div>`; // Fechar month
      }
  
      html += `</div></div>`; // Fechar year
    }
    
    archiveNav.innerHTML = html;
    this.setupArchiveInteractions();
    this.setupPostLinks(); // Adicionar esta linha
  }

  groupPostsByDate() {
    const hierarchy = {};
    
    this.archivedPosts.forEach(post => {
      const date = new Date(post.data);
      if (isNaN(date)) return;
  
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
  
      if (!hierarchy[year]) hierarchy[year] = {};
      if (!hierarchy[year][month]) hierarchy[year][month] = {};
      if (!hierarchy[year][month][day]) hierarchy[year][month][day] = [];
      
      hierarchy[year][month][day].push(post);
    });
  
    // Ordenar a hierarquia
    for (const year in hierarchy) {
      const months = hierarchy[year];
      hierarchy[year] = Object.keys(months)
        .sort((a, b) => b - a)
        .reduce((sorted, key) => {
          sorted[key] = months[key];
          return sorted;
        }, {});
  
      for (const month in hierarchy[year]) {
        const days = hierarchy[year][month];
        hierarchy[year][month] = Object.keys(days)
          .sort((a, b) => b - a)
          .reduce((sorted, key) => {
            sorted[key] = days[key];
            return sorted;
          }, {});
      }
    }
    
    return hierarchy;
  }

  setupArchiveInteractions() {
    // Manipuladores para cabeçalhos de ano, mês e dia
    document.querySelectorAll('.archive-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.currentTarget;
        const icon = target.querySelector('.toggle-icon');
        const collapseDiv = target.nextElementSibling;
        
        // Alterna a visualização usando Bootstrap
        if (collapseDiv) {
          if (collapseDiv.classList.contains('show')) {
            collapseDiv.classList.remove('show');
            icon.classList.remove('bi-caret-down-fill');
            icon.classList.add('bi-caret-right-fill');
          } else {
            collapseDiv.classList.add('show');
            icon.classList.remove('bi-caret-right-fill');
            icon.classList.add('bi-caret-down-fill');
          }
        }
      });
    });
    
    // Manipuladores específicos para links de posts
    document.querySelectorAll('.post-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const postId = parseInt(link.closest('.archive-post').dataset.id);
        const post = this.archivedPosts.find(p => p.id === postId);
        
        if (post) {
          this.showArchivedPost(post);
        }
      });
    });
  }

  showArchivedPost(post) {
    this.renderPosts([post]);
    const offcanvasEl = document.getElementById('postsArchive');
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);
    bsOffcanvas.hide();
  }

  addNavigationLink() {
    const navLink = `
      
    `;
    this.postsContainer.insertAdjacentHTML('beforeend', navLink);
  }

  loadInteractions() {
    this.interactions = JSON.parse(localStorage.getItem('blogInteractions')) || {
      likes: {},
      comments: {},
      shares: {}
    };
  }

  toggleLike(postId) {
    if (!this.interactions.likes[postId]) {
      this.interactions.likes[postId] = 0;
    }
    
    const currentCount = this.interactions.likes[postId];
    const newCount = currentCount === 0 ? 1 : 0;
    
    this.interactions.likes[postId] = newCount;
    localStorage.setItem('blogInteractions', JSON.stringify(this.interactions));
    
    // Atualizar visualização
    const likeBtn = document.querySelector(`[data-postid="${postId}"] .like-btn`);
    if (likeBtn) {
      likeBtn.querySelector('i').style.color = newCount ? '#ff0000' : '';
    }
  }
  
  // Novo método para comentários
  setupCommentSystem(postId) {
    const commentForm = document.getElementById(`commentForm-${postId}`);
    const commentsContainer = document.getElementById(`comments-${postId}`);
  
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const commentText = e.target.comment.value.trim();
        
        if (commentText) {
          this.addComment(postId, commentText);
          e.target.comment.value = '';
        }
      });
    }
  }
  
  addComment(postId, text) {
    if (!this.interactions.comments[postId]) {
      this.interactions.comments[postId] = [];
    }
    
    this.interactions.comments[postId].push({
      text,
      date: new Date().toISOString(),
      user: 'Usuário' // Poderia implementar login depois
    });
    
    localStorage.setItem('blogInteractions', JSON.stringify(this.interactions));
    this.renderComments(postId);
  }
  
  renderComments(postId) {
    const container = document.getElementById(`comments-${postId}`);
    if (!container) return;
  
    const comments = this.interactions.comments[postId] || [];
    container.innerHTML = comments.map((comment, index) => `
      <div class="comment mb-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-person-circle me-2"></i>
          <strong>${comment.user}</strong>
          <small class="ms-2 text-muted">${new Date(comment.date).toLocaleDateString('pt-BR')}</small>
        </div>
        <p class="mt-1">${comment.text}</p>
        ${index < comments.length - 1 ? '<hr>' : ''}
      </div>
    `).join('');
  }

  async sharePost(postId) {
  try {
    const post = [...this.activePosts, ...this.archivedPosts].find(p => p.id === postId);
    const shareData = {
      title: post.titulo,
      text: post.conteudo.substring(0, 100) + '...',
      url: window.location.href + `?post=${postId}`
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback para redes sociais
      const socialContainer = document.getElementById(`socialShare-${postId}`);
      if (socialContainer) {
        socialContainer.innerHTML = `
          <a href="https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}" 
             target="_blank" class="btn btn-sm btn-primary me-2">
            <i class="bi bi-facebook"></i>
          </a>
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}" 
             target="_blank" class="btn btn-sm btn-info me-2">
            <i class="bi bi-twitter"></i>
          </a>
          <button onclick="navigator.clipboard.writeText('${shareData.url}')" 
                  class="btn btn-sm btn-secondary">
            <i class="bi bi-link-45deg"></i>
          </button>
        `;
        socialContainer.classList.remove('d-none');
      }
    }
  } catch (err) {
    console.error('Erro ao compartilhar:', err);
  }
}
}


// Inicialização 
document.addEventListener('DOMContentLoaded', () => new BlogManager());


window.addEventListener('resize', adjustLayout);
adjustLayout();

// Função global para ajustar o layout 
function adjustLayout() {
  
  const container = document.getElementById('posts-container');
  if (container) {
    // Ajustes de layout responsivo podem ser adicionados aqui
  }
}

// Funções globais para os botões de like e share

