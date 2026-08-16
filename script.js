let movies = JSON.parse(localStorage.getItem('myMovies')) || [];
let currentStatusFilter = 'all';
let currentTypeFilter = 'all';
const targetGoal = 50;

// Ekstra Genişletilmiş Zengin Film Kataloğu
const defaultMoviePool = [
    { title: "Inception", rating: "8.8", year: "2010", overview: "Rüyalar içinde rüyalara giren uzman zihin hırsızının macerası." },
{ title: "Interstellar", rating: "8.7", year: "2014", overview: "İnsanlığın geleceği için uzayda solucan deliğine yapılan yolculuk." },
{ title: "The Dark Knight", rating: "9.0", year: "2008", overview: "Batman ve Joker'in Gotham şehrindeki psikolojik savaşı." },
{ title: "Fight Club", rating: "8.8", year: "1999", overview: "Tüketim toplumuna başkaldıran gizemli yeraltı kulübü." },
{ title: "Pulp Fiction", rating: "8.9", year: "1994", overview: "Quentin Tarantino'dan suç dünyasının ikonik hikayeleri." },
{ title: "The Matrix", rating: "8.7", year: "1999", overview: "Sanal simülasyona karşı insanlığın büyük uyanışı." },
{ title: "Se7en", rating: "8.6", year: "1995", overview: "Yedi ölümcül günah temalı cinayetleri çözen dedektifler." },
{ title: "Whiplash", rating: "8.5", year: "2014", overview: "Mükemmellik uğruna sınırları zorlayan genç caz davulcusu." },
{ title: "Gladiator", rating: "8.5", year: "2000", overview: "Roma İmparatorluğu'nda intikam arayan efsanevi general." },
{ title: "Oppenheimer", rating: "8.9", year: "2023", overview: "Atom bombasının babasının tarihi ve psikolojik portresi." },
{ title: "Dune: Part Two", rating: "8.6", year: "2024", overview: "Paul Atreides'in çöl gezegenindeki kehanet ve intikam savaşı." },
{ title: "The Prestige", rating: "8.5", year: "2006", overview: "İki rakip sihirbazın takıntıya dönüşen amansız rekabeti." },
{ title: "Parasite", rating: "8.5", year: "2019", overview: "Farklı sosyal sınıflardan iki ailenin gerilim dolu kesişimi." },
{ title: "Spirited Away", rating: "8.6", year: "2001", overview: "Ruhlar dünyasına sürüklenen genç Chihiro'nun büyülü öyküsü." },
{ title: "Spider-Man: Across the Spider-Verse", rating: "8.7", year: "2023", overview: "Çoklu evrende kendi yolunu çizmeye çalışan Miles Morales." },
{ title: "Poor Things", rating: "8.0", year: "2023", overview: "Hayata fantastik bir şekilde dönen Bella'nın dünyayı keşfi." },
{ title: "The Batman", rating: "7.8", year: "2022", overview: "Gotham'ın karanlık yüzüyle yüzleşen genç Bruce Wayne." },
{ title: "Alien: Romulus", rating: "7.5", year: "2024", overview: "Terk edilmiş uzay istasyonunda amansız yaratık mücadelesi." },
{ title: "La La Land", rating: "8.0", year: "2016", overview: "Los Angeles'ta tutkularının peşinden koşan iki aşık." },
{ title: "Mad Max: Fury Road", rating: "8.1", year: "2015", overview: "Kıyamet sonrası çölde yüksek tempolu kaçış savaşı." }
];

// Ekstra Genişletilmiş Zengin Dizi Kataloğu
const defaultTvPool = [
    { title: "Breaking Bad", rating: "9.5", year: "2008", overview: "Sıradan kimya öğretmeninden suç imparatoruna dönüşüm." },
{ title: "Game of Thrones", rating: "9.2", year: "2011", overview: "Demir Taht için savaşan krallıklar ve kadim tehditler." },
{ title: "Severance", rating: "8.7", year: "2022", overview: "İş ve kişisel anıların ameliyatla ayrıldığı gizemli şirket." },
{ title: "Stranger Things", rating: "8.7", year: "2016", overview: "80'ler kasabasında doğaüstü yaratıklar ve kayıp çocuklar." },
{ title: "The Last of Us", rating: "8.8", year: "2023", overview: "Kıyamet sonrası dünyada tehlikeli hayatta kalma yürüyüşü." },
{ title: "Chernobyl", rating: "9.4", year: "2019", overview: "Nükleer felaketin ve insan kahramanlığının gerçek hikayesi." },
{ title: "True Detective", rating: "8.9", year: "2014", overview: "Karanlık ve gizemli cinayetleri soruşturan dedektifler." },
{ title: "Sherlock", rating: "9.1", year: "2010", overview: "Günümüz Londra'sında dahi dedektif Sherlock ve Watson." },
{ title: "Dark", rating: "8.7", year: "2017", overview: "Zaman yolculuğu ve 4 ailenin karmaşık kader ağı." },
{ title: "Succession", rating: "8.9", year: "2018", overview: "Medya devinin varisleri arasındaki acımasız güç savaşı." },
{ title: "Shogun", rating: "8.8", year: "2024", overview: "Feodal Japonya'da siyasi entrikalar ve samuray savaşı." },
{ title: "Arcane", rating: "9.0", year: "2021", overview: "İki kardeşin ütopik ve yeraltı şehirlerindeki savaşı." },
{ title: "Mindhunter", rating: "8.6", year: "2017", overview: "Seri katillerin psikolojisini inceleyen FBI ajanları." },
{ title: "The Bear", rating: "8.6", year: "2022", overview: "Genç şefin aile restoranını dönüştürme mücadelesi." },
{ title: "Peaky Blinders", rating: "8.8", year: "2013", overview: "1920'ler İngiltere'sinde Shelby çetesinin yükselişi." },
{ title: "The Boys", rating: "8.7", year: "2019", overview: "Karanlık süper kahramanlara karşı verilen amansız savaş." },
{ title: "Fargo", rating: "8.9", year: "2014", overview: "Sıradan insanların karıştığı tuhaf ve trajik suçlar." }
];

const movieForm = document.getElementById('movieForm');
const movieList = document.getElementById('movieList');
const modal = document.getElementById('movieModal');

function openModal() { modal.style.display = 'flex'; }
function closeModal() { modal.style.display = 'none'; }

function switchTab(tabName, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    document.querySelectorAll('.capsule-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar .nav-item').forEach(b => b.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.add('active-tab');
    if(btn) btn.classList.add('active');

    if (tabName === 'reports') renderReports();
    if (tabName === 'movie-recommendations') fetchMovieRecommendations();
    if (tabName === 'tv-recommendations') fetchTvRecommendations();
}

function setTypeFilter(type, btn) {
    currentTypeFilter = type;
    document.querySelectorAll('.sidebar .nav-item').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    switchTab('library', null);
    renderMovies();
}

function toggleThemePicker() {
    const picker = document.getElementById('themePickerModal');
    picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.getElementById('btn-theme-light').classList.toggle('active', theme === 'light');
    document.getElementById('btn-theme-dark').classList.toggle('active', theme === 'dark');
}

function setAccent(color) {
    document.body.setAttribute('data-accent', color);
}

movieForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const contentType = document.getElementById('contentType').value;
    const status = document.getElementById('status').value;
    const rating = document.getElementById('rating').value || '-';
    const seasonEpisode = document.getElementById('seasonEpisode').value;
    const notes = document.getElementById('notes').value;

    saveMovieData(title, contentType, status, rating, seasonEpisode, notes);
});

function saveMovieData(title, contentType, status, rating, seasonEpisode, notes) {
    const newMovie = {
        id: Date.now(),
        title,
        contentType,
        status,
        rating,
        seasonEpisode,
        notes,
        isFavorite: false,
        createdAt: new Date().toISOString()
    };

    movies.push(newMovie);
    saveAndRender();
    movieForm.reset();
    closeModal();
}

// Diziyi Rastgele Karıştırma
function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function fetchMovieRecommendations() {
    const container = document.getElementById('movieRecList');
    const randomMovies = shuffleArray(defaultMoviePool);
    renderTextRecs(randomMovies, 'Film', container);
}

function fetchTvRecommendations() {
    const container = document.getElementById('tvRecList');
    const randomTv = shuffleArray(defaultTvPool);
    renderTextRecs(randomTv, 'Dizi', container);
}

// Kutucuk Tasarımlı Kompakt Öneri Kartları
function renderTextRecs(items, type, container) {
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('bento-card', 'text-card');
        card.innerHTML = `
        <div class="card-box-header">
        <span class="box-icon">${type === 'Film' ? '🎬' : '📺'}</span>
        <span class="box-year">${item.year}</span>
        </div>
        <div class="bento-details">
        <div>
        <h3 class="box-title" title="${item.title}">${item.title}</h3>
        <div class="bento-meta" style="margin-bottom: 6px;">
        <span class="bento-tag ${type === 'Dizi' ? 'tv-tag' : ''}">${type}</span>
        <span class="star-rating">⭐ ${item.rating}</span>
        </div>
        <div class="bento-notes">${item.overview}</div>
        </div>
        <button class="btn-add-rec" onclick="addRecommendedToLibrary('${encodeURIComponent(item.title)}', '${type}', '${item.rating}')">
        + Ekle
        </button>
        </div>
        `;
        container.appendChild(card);
    });
}

function addRecommendedToLibrary(encodedTitle, type, rating) {
    const title = decodeURIComponent(encodedTitle);
    saveMovieData(title, type, 'İzlenecek', rating, '', 'Otomatik öneriden eklendi.');
    alert(`"${title}" kütüphanene eklendi!`);
}

function updateStats() {
    const watched = movies.filter(m => m.status === 'İzlendi');
    const favs = movies.filter(m => m.isFavorite).length;

    const watchedCount = watched.length;
    const percentage = Math.min(Math.round((watchedCount / targetGoal) * 100), 100);

    document.getElementById('statTotalWatched').innerText = watchedCount;
    document.getElementById('statFavCount').innerText = favs;
    document.getElementById('statTargetText').innerText = `${watchedCount} / ${targetGoal}`;
    document.getElementById('targetProgressBar').style.width = `${percentage}%`;

    const now = new Date();
    const thisMonthCount = watched.filter(m => {
        const d = new Date(m.createdAt || 0);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    document.getElementById('statMonthlyBadge').innerText = `+${thisMonthCount} Bu Ay`;
}

function renderMovies() {
    movieList.innerHTML = '';
    updateStats();

    const searchQuery = document.getElementById('searchInput').value.toLowerCase();

    let filtered = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery);
        let matchesStatus = true;
        let matchesType = true;

        if (currentStatusFilter === 'favorites') {
            matchesStatus = movie.isFavorite === true;
        } else if (currentStatusFilter !== 'all') {
            matchesStatus = movie.status === currentStatusFilter;
        }

        if (currentTypeFilter !== 'all') {
            matchesType = movie.contentType === currentTypeFilter;
        }

        return matchesSearch && matchesStatus && matchesType;
    });

    if (filtered.length === 0) {
        movieList.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px; font-size:13px;">Kayıtlı içerik bulunamadı.</div>`;
        return;
    }

    filtered.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('bento-card');

        card.innerHTML = `
        <div class="card-actions">
        <button class="bento-action-btn fav ${movie.isFavorite ? 'active' : ''}" onclick="toggleFavorite(${movie.id})" title="Favori">
        <i class="fa-solid fa-heart"></i>
        </button>
        <button class="bento-action-btn delete" onclick="deleteMovie(${movie.id})" title="Sil">
        <i class="fa-solid fa-trash"></i>
        </button>
        </div>
        <div class="bento-details">
        <div>
        <h3 class="box-title" style="padding-right: 50px;">${movie.title}</h3>
        <div class="bento-meta" style="margin-top: 6px;">
        <span class="bento-tag ${movie.contentType === 'Dizi' ? 'tv-tag' : ''}">${movie.status} (${movie.contentType || 'Film'})</span>
        <span class="star-rating">⭐ ${movie.rating}</span>
        </div>
        </div>
        ${movie.seasonEpisode ? `<div style="font-size: 11px; color: var(--accent-color); font-weight:800;">${movie.seasonEpisode}</div>` : ''}
        ${movie.notes ? `<div class="bento-notes">${movie.notes}</div>` : ''}
        </div>
        `;
        movieList.appendChild(card);
    });
}

function deleteMovie(id) {
    if(confirm("Bu içeriği silmek istediğinize emin misiniz?")) {
        movies = movies.filter(m => m.id !== id);
        saveAndRender();
    }
}

function renderReports() {
    const filmCount = movies.filter(m => (m.contentType || 'Film') === 'Film').length;
    const diziCount = movies.filter(m => m.contentType === 'Dizi').length;

    document.getElementById('typeDistribution').innerText = `🎬 ${filmCount} Film  |  📺 ${diziCount} Dizi`;

    const ratedMovies = movies.filter(m => !isNaN(parseFloat(m.rating)));
    const avg = ratedMovies.length > 0
    ? (ratedMovies.reduce((acc, m) => acc + parseFloat(m.rating), 0) / ratedMovies.length).toFixed(1)
    : '0.0';

    document.getElementById('avgRatingStat').innerText = `⭐ ${avg} / 10`;
}

function toggleFavorite(id) {
    movies = movies.map(movie => movie.id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie);
    saveAndRender();
}

function filterMovies(status, event) {
    currentStatusFilter = status;
    document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');
    renderMovies();
}

function searchMovies() { renderMovies(); }

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(movies));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "hi_app_kutuphane_yedek.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function saveAndRender() {
    localStorage.setItem('myMovies', JSON.stringify(movies));
    renderMovies();
}

renderMovies();
