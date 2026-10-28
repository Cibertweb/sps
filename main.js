// Estado local de la aplicación
let favorites = JSON.parse(localStorage.getItem('spes_favorites')) || [];
let comments = JSON.parse(localStorage.getItem('spes_comments')) || {};
let currentLayout = 'grid';
let currentCategory = 'all';
let currentVideoId = null;

// ==========================================================================
// RUTAS SPA CON NAVEGACIÓN HASH
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    handleRoute();
    updateFavBadge();

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav button');
    const navbarCollapse = document.getElementById('navbarFuturistic');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse, { toggle: true });
            }
        });
    });
});

window.addEventListener('hashchange', handleRoute);

function navigateTo(route, params = {}) {
    let hash = `#${route}`;
    if (params.id) {
        hash += `?id=${params.id}`;
    }
    window.location.hash = hash;
}

function handleRoute() {
    const hash = window.location.hash || '#inicio';
    const [routePart, queryPart] = hash.substring(1).split('?');
    
    const params = {};
    if (queryPart) {
        const searchParams = new URLSearchParams(queryPart);
        for (const [key, val] of searchParams.entries()) {
            params[key] = val;
        }
    }

    document.querySelectorAll('.view-template').forEach(v => v.classList.remove('active-view'));

    document.querySelectorAll('.nav-route').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-route') === routePart);
    });

    if (routePart !== 'video') {
        const iframe = document.getElementById('mainYoutubePlayer');
        if (iframe) iframe.src = '';
    }

    switch (routePart) {
        case 'podcasts':
            renderPodcastsView();
            showView('view-podcasts');
            break;
        case 'videos':
            renderVideosView();
            showView('view-videos');
            break;
        case 'favoritos':
            renderFavoritesView();
            showView('view-favoritos');
            break;
        case 'detalle':
            renderDetailView(params.id);
            showView('view-detalle');
            break;
        case 'video':
            renderVideoPlayerView(params.id);
            showView('view-video');
            break;
        case 'inicio':
        default:
            renderHomeView();
            showView('view-inicio');
            break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showView(viewId) {
    const elem = document.getElementById(viewId);
    if (elem) elem.classList.add('active-view');
}

// ==========================================================================
// RENDERS DE VISTAS
// ==========================================================================
function renderHomeView() {
    filterContent();
}

function renderPodcastsView() {
    const podcasts = itemsDatabase.filter(i => i.category === 'Podcast');
    renderCards(podcasts, 'podcastCardsContainer');
}

function renderVideosView() {
    const videos = itemsDatabase.filter(i => i.category !== 'Podcast');
    renderCards(videos, 'videoCardsContainer');
}

function renderFavoritesView() {
    const favItems = itemsDatabase.filter(i => favorites.includes(i.id));
    renderCards(favItems, 'favoritesCardsContainer');
}

function renderDetailView(id) {
    const item = itemsDatabase.find(i => i.id === id) || itemsDatabase[0];
    document.getElementById('detailTitle').textContent = item.title;
    document.getElementById('detailAuthor').textContent = item.author;
    document.getElementById('detailDate').textContent = item.date;
    document.getElementById('detailDesc').textContent = item.desc;
    document.getElementById('detailImg').src = item.img;
    document.getElementById('detailTags').innerHTML = item.tags.split(',').map(t => `<span class="tag-badge me-1">${t.trim()}</span>`).join('');

    const actionBtn = document.getElementById('detailActionBtn');
    actionBtn.onclick = () => navigateTo('video', { id: item.id });
}

function renderVideoPlayerView(id) {
    const item = itemsDatabase.find(i => i.id === id) || itemsDatabase[0];
    currentVideoId = item.id;

    document.getElementById('playerTitle').textContent = item.title;
    document.getElementById('playerAuthor').textContent = item.author;
    document.getElementById('playerDate').textContent = item.date;
    document.getElementById('playerDesc').textContent = item.desc;
    document.getElementById('mainYoutubePlayer').src = `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`;

    document.getElementById('playerTags').innerHTML = item.tags.split(',').map(t => `<span class="tag-badge me-1">${t.trim()}</span>`).join('');

    renderComments(item.id);
    renderSuggestedPanel(item.id);
}

function renderSuggestedPanel(currentId) {
    const container = document.getElementById('suggestedCardsContainer');
    const suggestedList = itemsDatabase.filter(i => i.id !== currentId);

    container.innerHTML = suggestedList.map(item => `
        <div class="suggested-card" onclick="navigateTo('video', {id: '${item.id}'})">
            <div class="suggested-thumb">
                <img src="${item.img}" alt="${item.title}">
            </div>
            <div class="suggested-info">
                <h6 class="suggested-title">${item.title}</h6>
                <p class="suggested-meta"><i class="fa-solid fa-user me-1 text-danger"></i>${item.author}</p>
                <p class="suggested-meta text-muted-bright"><i class="fa-regular fa-clock me-1"></i>${item.duration}</p>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// RENDER DE TARJETAS (GRILLA Y LISTA TIPO EXPLORADOR)
// ==========================================================================
function renderCards(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-silver-bright py-5"><i class="fa-solid fa-folder-open fa-3x mb-3 text-danger"></i><p>No se encontraron contenidos.</p></div>`;
        return;
    }

    container.innerHTML = items.map(item => {
        const isFav = favorites.includes(item.id);
        const tagsListHTML = item.tags ? item.tags.split(',').map(t => `<span class="tag-badge-gray me-1 mb-1"><i class="fa-solid fa-tag me-1 text-danger"></i>${t.trim()}</span>`).join('') : '';

        if (currentLayout === 'list') {
            return `
            <div class="col-12 list-view-item">
                <div class="glass-card">
                    <button class="btn-fav-icon ${isFav ? 'active' : ''}" onclick="toggleFavorite('${item.id}', event)">
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                    <div class="list-thumb-box">
                        <img src="${item.img}" alt="${item.title}" referrerpolicy="no-referrer">
                        <span class="duration-tag">${item.duration}</span>
                    </div>
                    <div class="card-body-content pe-4">
                        <div class="mb-1 d-flex flex-wrap gap-1 align-items-center">
                            <span class="tag-badge">${item.category}</span>
                            ${tagsListHTML}
                        </div>
                        <h5 class="card-title-text">${item.title}</h5>
                        <p class="card-desc-text">${item.desc}</p>
                        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-1">
                            <div class="d-flex align-items-center gap-2">
                                <img src="${item.authorAvatar}" class="author-avatar" alt="${item.author}">
                                <span class="text-silver-bright extra-small fw-semibold">${item.author}</span>
                                <span class="text-muted extra-small ms-2">• ${item.date}</span>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn-glass-outline btn-sm-custom" onclick="navigateTo('detalle', {id: '${item.id}'})">
                                    <i class="fa-solid fa-circle-info"></i> Detalle
                                </button>
                                ${item.audioUrl ? `
                                    <button class="btn-glass-red btn-sm-custom" onclick="playAudioPodcast('${item.title}', '${item.author}', '${item.audioUrl}')">
                                        <i class="fa-solid fa-headphones"></i> Escuchar
                                    </button>
                                ` : `
                                    <button class="btn-glass-red btn-sm-custom" onclick="navigateTo('video', {id: '${item.id}'})">
                                        <i class="fa-solid fa-play"></i> Ver Video
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        } else {
            return `
            <div class="col-12 col-md-6 col-lg-4 grid-view-item">
                <div class="glass-card h-100 d-flex flex-column">
                    <button class="btn-fav-icon ${isFav ? 'active' : ''}" onclick="toggleFavorite('${item.id}', event)">
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                    <div class="card-thumb-container">
                        <img src="${item.img}" alt="${item.title}" referrerpolicy="no-referrer">
                        <span class="duration-tag"><i class="fa-solid fa-${item.category === 'Podcast' ? 'podcast' : 'clock'} me-1"></i>${item.duration}</span>
                    </div>
                    <div class="p-3 d-flex flex-column flex-grow-1">
                        <div class="mb-2"><span class="tag-badge">${item.category}</span></div>
                        <h5 class="card-title-text" style="white-space:normal; -webkit-line-clamp:2; display:-webkit-box; -webkit-box-orient:vertical; overflow:hidden;">${item.title}</h5>
                        <p class="card-desc-text" style="-webkit-line-clamp:2; display:-webkit-box; -webkit-box-orient:vertical; overflow:hidden;">${item.desc}</p>
                        <div class="d-flex align-items-center justify-content-between my-3 pt-2 border-top border-secondary border-opacity-25 mt-auto">
                            <div class="d-flex align-items-center gap-2">
                                <img src="${item.authorAvatar}" class="author-avatar" alt="${item.author}">
                                <span class="text-silver-bright small fw-semibold">${item.author}</span>
                            </div>
                            <span class="text-silver-bright small">${item.date}</span>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn-glass-outline btn-sm-custom flex-fill" onclick="navigateTo('detalle', {id: '${item.id}'})">
                                <i class="fa-solid fa-circle-info"></i> Detalle
                            </button>
                            ${item.audioUrl ? `
                                <button class="btn-glass-red btn-sm-custom flex-fill" onclick="playAudioPodcast('${item.title}', '${item.author}', '${item.audioUrl}')">
                                    <i class="fa-solid fa-headphones"></i> Escuchar
                                </button>
                            ` : `
                                <button class="btn-glass-red btn-sm-custom flex-fill" onclick="navigateTo('video', {id: '${item.id}'})">
                                    <i class="fa-solid fa-play"></i> Ver Video
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    }).join('');
}

// ==========================================================================
// FILTROS Y CONTROLES DE VISTA
// ==========================================================================
function filterContent() {
    const query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const filtered = itemsDatabase.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(query) || 
                             item.author.toLowerCase().includes(query) || 
                             item.tags.toLowerCase().includes(query);
        const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
        return matchesQuery && matchesCategory;
    });
    renderCards(filtered, 'mainCardsContainer');
    const counter = document.getElementById('contentCount');
    if (counter) counter.textContent = `Mostrando ${filtered.length} contenido(s)`;
}

function setCategoryFilter(category, element) {
    currentCategory = category;
    document.querySelectorAll('.filter-cat-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');
    filterContent();
}

function setCardLayout(layout) {
    currentLayout = layout;
    document.getElementById('btnViewGrid')?.classList.toggle('active', layout === 'grid');
    document.getElementById('btnViewList')?.classList.toggle('active', layout === 'list');
    filterContent();
}

// ==========================================================================
// FAVORITOS Y REPRODUCTOR AUDIO
// ==========================================================================
function toggleFavorite(id, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('spes_favorites', JSON.stringify(favorites));
    updateFavBadge();
    
    const currentRoute = window.location.hash.substring(1).split('?')[0] || 'inicio';
    if (currentRoute === 'favoritos') {
        renderFavoritesView();
    } else if (currentRoute === 'podcasts') {
        renderPodcastsView();
    } else if (currentRoute === 'videos') {
        renderVideosView();
    } else {
        filterContent();
    }
}

function updateFavBadge() {
    const badge = document.getElementById('favCounterBadge');
    if (badge) {
        badge.textContent = favorites.length;
        badge.style.display = favorites.length > 0 ? 'inline-block' : 'none';
    }
}

function playAudioPodcast(title, author, url) {
    const playerBar = document.getElementById('podcastPlayerBar');
    const audio = document.getElementById('globalAudioPlayer');
    document.getElementById('audioTitle').textContent = title;
    document.getElementById('audioAuthor').textContent = author;

    audio.src = url;
    audio.play();
    document.getElementById('audioPlayIcon').className = 'fa-solid fa-pause text-danger';
    playerBar.classList.add('active');
}

function toggleAudio() {
    const audio = document.getElementById('globalAudioPlayer');
    const icon = document.getElementById('audioPlayIcon');
    if (audio.paused) {
        audio.play();
        icon.className = 'fa-solid fa-pause text-danger';
    } else {
        audio.pause();
        icon.className = 'fa-solid fa-play text-danger';
    }
}

function updateAudioProgress() {
    const audio = document.getElementById('globalAudioPlayer');
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        document.getElementById('audioProgressFill').style.width = `${pct}%`;
    }
}

function seekAudio(e) {
    const audio = document.getElementById('globalAudioPlayer');
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
}

function closeAudioPlayer() {
    const audio = document.getElementById('globalAudioPlayer');
    audio.pause();
    document.getElementById('podcastPlayerBar').classList.remove('active');
}

// ==========================================================================
// COMENTARIOS Y DESCARGAS
// ==========================================================================
function addComment() {
    const name = document.getElementById('commentAuthor').value.trim();
    const text = document.getElementById('commentText').value.trim();
    if (!name || !text) {
        alert('Ingresa tu nombre y comentario.');
        return;
    }

    const activeId = currentVideoId || '1';
    if (!comments[activeId]) comments[activeId] = [];
    comments[activeId].unshift({ name, text, date: 'Hace un momento' });
    localStorage.setItem('spes_comments', JSON.stringify(comments));

    document.getElementById('commentAuthor').value = '';
    document.getElementById('commentText').value = '';
    renderComments(activeId);
}

function renderComments(itemId) {
    const list = document.getElementById('commentsList');
    const itemComments = comments[itemId] || [
        { name: 'María Rosa', text: 'Excelente mensaje, Dios bendiga esta plataforma.', date: 'Hace 1 hora' }
    ];
    list.innerHTML = itemComments.map(c => `
        <div class="p-3 rounded-3" style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border);">
            <div class="d-flex justify-content-between mb-1">
                <strong class="text-white small">${c.name}</strong>
                <span class="text-silver-bright extra-small">${c.date}</span>
            </div>
            <p class="text-silver-bright small mb-0">${c.text}</p>
        </div>
    `).join('');
}

function downloadNotes() {
    alert('Iniciando descarga de guía bíblica en PDF...');
}