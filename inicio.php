<section id="view-inicio" class="view-template active-view">
    <!-- HERO SLIDER -->
    <div class="hero-slider-wrapper">
        <div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <div class="slider-card" style="background-image: url('images/s1.JPG');">
                        <div class="slider-overlay">
                            <div class="mb-2">
                                <span class="tag-badge"><i class="fa-solid fa-star me-1"></i> Mensaje Destacado</span>
                                <span class="tag-badge-gray ms-2"><i class="fa-solid fa-clock me-1"></i> 38 Min</span>
                            </div>
                            <h1 class="text-white fw-bold display-6">El Poder de la Palabra Viva en el Día a Día</h1>
                            <p class="text-silver d-none d-md-block max-w-75 mb-3">Una enseñanza profunda sobre la certidumbre espiritual y la paz interior frente a los desafíos actuales.</p>
                            <div>
                                <button class="btn-glass-red" onclick="navigateTo('video', {id: '1'})">
                                    <i class="fa-solid fa-play"></i> Ver Transmisión Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="slider-card" style="background-image: url('images/s2.JPG');">
                        <div class="slider-overlay">
                            <div class="mb-2">
                                <span class="tag-badge"><i class="fa-solid fa-podcast me-1"></i> Podcast Semanal</span>
                            </div>
                            <h1 class="text-white fw-bold display-6">Paz en Medio de la Tormenta Digital</h1>
                            <p class="text-silver d-none d-md-block max-w-75 mb-3">Diálogo sobre salud emocional y cómo desconectarse del ruido del mundo.</p>
                            <div>
                                <button class="btn-glass-red" onclick="playAudioPodcast('Paz en Medio de la Tormenta Digital', 'Dra. Sarah Silva', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')">
                                    <i class="fa-solid fa-headphones"></i> Escuchar Podcast
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="slider-card" style="background-image: url('images/s3.JPG');">
                        <div class="slider-overlay">
                            <div class="mb-2">
                                <span class="tag-badge"><i class="fa-solid fa-layer-group me-1"></i> Serie Especial</span>
                            </div>
                            <h1 class="text-white fw-bold display-6">Venciendo el Temor A Través de Promesas</h1>
                            <p class="text-silver d-none d-md-block max-w-75 mb-3">Principios bíblicos clave para sobreponerse a la ansiedad.</p>
                            <div>
                                <button class="btn-glass-outline" onclick="navigateTo('videos')">
                                    <i class="fa-solid fa-list"></i> Explorar Serie
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- FILTROS Y BÚSQUEDA -->
    <div class="glass-panel p-4 my-4">
        <div class="row gy-3 align-items-center">
            <div class="col-12 col-md-5">
                <div class="input-group">
                    <span class="input-group-text bg-dark border-secondary text-danger"><i class="fa-solid fa-search"></i></span>
                    <input type="text" id="searchInput" class="form-control bg-dark text-white border-secondary" placeholder="Buscar mensaje, autor o tema..." onkeyup="filterContent()">
                </div>
            </div>
            <div class="col-12 col-md-5 d-flex flex-wrap gap-1">
                <button class="btn-glass-outline btn-sm-custom active filter-cat-btn" onclick="setCategoryFilter('all', this)">Todos</button>
                <button class="btn-glass-outline btn-sm-custom filter-cat-btn" onclick="setCategoryFilter('Predicación', this)">Prédicas</button>
                <button class="btn-glass-outline btn-sm-custom filter-cat-btn" onclick="setCategoryFilter('Podcast', this)">Podcasts</button>
                <button class="btn-glass-outline btn-sm-custom filter-cat-btn" onclick="setCategoryFilter('Estudio', this)">Estudios</button>
            </div>
            <div class="col-12 col-md-2 d-flex justify-content-md-end gap-2">
                <button class="btn-glass-outline btn-sm-custom active" id="btnViewGrid" onclick="setCardLayout('grid')" title="Vista Grilla"><i class="fa-solid fa-border-all"></i></button>
                <button class="btn-glass-outline btn-sm-custom" id="btnViewList" onclick="setCardLayout('list')" title="Vista Lista Compacta"><i class="fa-solid fa-list-ul"></i></button>
            </div>
        </div>
    </div>

    <!-- GRILLA DE CONTENIDO -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="text-white mb-0"><i class="fa-solid fa-bolt text-danger me-2"></i>Catálogo General</h3>
        <span id="contentCount" class="text-silver-bright small">Mostrando contenidos</span>
    </div>

    <div class="row g-4" id="mainCardsContainer"></div>
</section>