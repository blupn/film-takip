const STORAGE_KEY = 'filmDiziTakip';
let movies = [];
let currentStatusFilter = 'all';
let currentCategoryFilter = 'all';
let currentSearch = '';
let currentSort = 'newest';

const form = document.getElementById('movie-form');
const editId = document.getElementById('edit-id');
const formTitle = document.getElementById('form-title');
const titleInput = document.getElementById('title');
const mediaTypeInput = document.getElementById('media-type');
const categoryInput = document.getElementById('category');
const statusInput = document.getElementById('status');
const ratingInput = document.getElementById('rating');
const posterInput = document.getElementById('poster');
const noteInput = document.getElementById('note');
const cancelEditBtn = document.getElementById('cancel-edit');
const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
const filterButtons = document.querySelectorAll('.filter-btn');

const statTotal = document.getElementById('stat-total');
const statWatched = document.getElementById('stat-watched');
const statToWatch = document.getElementById('stat-towatch');
const statAvgRating = document.getElementById('stat-avg-rating');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

function loadMovies() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try { movies = JSON.parse(stored); } catch { movies = []; }
    } else {
        movies = [];
    }
}

function saveMovies() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    updateStats();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function updateStats() {
    const total = movies.length;
    const watched = movies.filter(m => m.status === 'izlendi').length;
    const toWatch = total - watched;
    const ratedMovies = movies.filter(m => m.rating && m.rating > 0);
    const avgRating = ratedMovies.length > 0
    ? (ratedMovies.reduce((sum, m) => sum + m.rating, 0) / ratedMovies.length).toFixed(1)
    : '-';
    const progress = total > 0 ? Math.round((watched / total) * 100) : 0;

    statTotal.textContent = total;
    statWatched.textContent = watched;
    statToWatch.textContent = toWatch;
    statAvgRating.textContent = avgRating;
    progressText.textContent = `%${progress}`;
    progressFill.style.width = `${progress}%`;
}

function getFilteredAndSortedMovies() {
    let filtered = movies.filter(movie => {
        if (currentStatusFilter !== 'all' && movie.status !== currentStatusFilter) return false;
        if (currentCategoryFilter !== 'all' && movie.category !== currentCategoryFilter) return false;
        if (currentSearch && !movie.title.toLowerCase().includes(currentSearch.toLowerCase())) return false;
        return true;
    });

    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'newest': return (b.createdAt || b.id) - (a.createdAt || a.id);
            case 'oldest': return (a.createdAt || a.id) - (b.createdAt || b.id);
            case 'rating-desc': return (b.rating || 0) - (a.rating || 0);
            case 'rating-asc': return (a.rating || 0) - (b.rating || 0);
            default: return 0;
        }
    });

    return filtered;
}

function renderMovies() {
    const filtered = getFilteredAndSortedMovies();

    if (filtered.length === 0) {
        movieListDiv.innerHTML = '<div class="empty-message">📭 Kayıt bulunamadı. Filtreleri değiştir veya yeni kayıt ekle!</div>';
        return;
    }

    movieListDiv.innerHTML = filtered.map(movie => {
        const isWatched = movie.status === 'izlendi';
        const ratingDisplay = movie.rating ? `⭐ ${movie.rating}/10` : '⭐ Puan yok';
        const mediaIcon = movie.mediaType === 'film' ? '🎬 Film' : '📺 Dizi';
        const categoryBadge = movie.category ? `<span class="badge category">${escapeHtml(movie.category)}</span>` : '';
        const noteDisplay = movie.note ? `<p class="note-text">📝 ${escapeHtml(movie.note)}</p>` : '';

        let posterHtml = '';
        if (movie.poster) {
            posterHtml = `
            <div class="poster-wrapper">
            <img src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.title)}" onerror="this.onerror=null; this.parentNode.innerHTML='<div class=&quot;poster-placeholder&quot;>🎬</div>';">
            <span class="status-ribbon ${isWatched ? 'watched' : 'towatch'}">${isWatched ? '✅ İzlendi' : '⏳ İzlenecek'}</span>
            </div>
            `;
        } else {
            posterHtml = `
            <div class="poster-wrapper">
            <div class="poster-placeholder">🎬</div>
            <span class="status-ribbon ${isWatched ? 'watched' : 'towatch'}">${isWatched ? '✅ İzlendi' : '⏳ İzlenecek'}</span>
            </div>
            `;
        }

        return `
        <div class="movie-card">
        ${posterHtml}
        <div class="card-body">
        <h3>${escapeHtml(movie.title)}</h3>
        <div class="meta-row">
        <span class="badge media-type">${mediaIcon}</span>
        ${categoryBadge}
        <span class="badge rating">${ratingDisplay}</span>
        </div>
        ${noteDisplay}
        <div class="card-actions">
        <button class="btn-toggle" onclick="toggleStatus(${movie.id})">${isWatched ? '↩️ İzlenmedi' : '✅ İzlendi'}</button>
        <button class="btn-edit" onclick="editMovie(${movie.id})">✏️ Düzenle</button>
        <button class="btn-delete" onclick="deleteMovie(${movie.id})">🗑️ Sil</button>
        </div>
        </div>
        </div>
        `;
    }).join('');
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    if (!title) return;

                      const movieData = {
                          title: title,
                          mediaType: mediaTypeInput.value,
                          category: categoryInput.value,
                          status: statusInput.value,
                          rating: ratingInput.value ? Number(ratingInput.value) : null,
                      poster: posterInput.value.trim(),
                      note: noteInput.value.trim(),
                      createdAt: Date.now()
                      };

                      const editingId = editId.value;
                      if (editingId) {
                          const index = movies.findIndex(m => m.id == editingId);
                          if (index !== -1) {
                              movies[index] = { ...movies[index], ...movieData, id: movies[index].id, createdAt: movies[index].createdAt };
                          }
                          editId.value = '';
                          formTitle.textContent = '➕ Yeni Kayıt Ekle';
                      cancelEditBtn.style.display = 'none';
                      } else {
                          movieData.id = generateId();
                          movies.push(movieData);
                      }

                      saveMovies();
                      renderMovies();
                      form.reset();
                      ratingInput.value = '';
                      posterInput.value = '';
                      titleInput.focus();
});

window.editMovie = function(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    titleInput.value = movie.title;
    mediaTypeInput.value = movie.mediaType || 'film';
    categoryInput.value = movie.category || 'Diğer';
    statusInput.value = movie.status;
    ratingInput.value = movie.rating || '';
    posterInput.value = movie.poster || '';
    noteInput.value = movie.note || '';
    editId.value = id;
    formTitle.textContent = '✏️ Kaydı Düzenle';
    cancelEditBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteMovie = function(id) {
    if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
        movies = movies.filter(m => m.id !== id);
        saveMovies();
        renderMovies();
    }
};

window.toggleStatus = function(id) {
    const movie = movies.find(m => m.id === id);
    if (movie) {
        movie.status = movie.status === 'izlendi' ? 'izlenecek' : 'izlendi';
        saveMovies();
        renderMovies();
    }
};

cancelEditBtn.addEventListener('click', function() {
    editId.value = '';
    formTitle.textContent = '➕ Yeni Kayıt Ekle';
    cancelEditBtn.style.display = 'none';
    form.reset();
    ratingInput.value = '';
    posterInput.value = '';
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentStatusFilter = this.dataset.filter;
        renderMovies();
    });
});

categoryFilter.addEventListener('change', function() {
    currentCategoryFilter = this.value;
    renderMovies();
});

searchInput.addEventListener('input', function() {
    currentSearch = this.value;
    renderMovies();
});

sortSelect.addEventListener('change', function() {
    currentSort = this.value;
    renderMovies();
});

loadMovies();
updateStats();
renderMovies();
