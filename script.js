let movies = JSON.parse(localStorage.getItem('myMovies')) || [];
let calendarNotes = JSON.parse(localStorage.getItem('myCalendarNotes')) || {};
let currentStatusFilter = 'all';
let currentTypeFilter = 'all';
let selectedDateKey = null;
const targetGoal = 50;

const movieForm = document.getElementById('movieForm');
const movieList = document.getElementById('movieList');
const modal = document.getElementById('movieModal');

function openModal() { if(modal) modal.style.display = 'flex'; }
function closeModal() { if(modal) modal.style.display = 'none'; }

function switchTab(tabName, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    document.querySelectorAll('.capsule-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar .nav-item').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById(`tab-${tabName}`);
    if(targetTab) targetTab.classList.add('active-tab');
    if(btn) btn.classList.add('active');

    if (tabName === 'reports') renderReports();
    if (tabName === 'calendar-view') renderFullCalendar();
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
    if(picker) picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.getElementById('btn-theme-light')?.classList.toggle('active', theme === 'light');
    document.getElementById('btn-theme-dark')?.classList.toggle('active', theme === 'dark');
}

function setAccent(color) {
    document.body.setAttribute('data-accent', color);
}

if(movieForm) {
    movieForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveMovieData(
            document.getElementById('title').value,
                      document.getElementById('contentType').value,
                      document.getElementById('status').value,
                      document.getElementById('rating').value || '-',
                      document.getElementById('seasonEpisode').value,
                      document.getElementById('notes').value
        );
    });
}

function saveMovieData(title, contentType, status, rating, seasonEpisode, notes) {
    movies.push({
        id: Date.now(), title, contentType, status, rating, seasonEpisode, notes,
                isFavorite: false, createdAt: new Date().toISOString()
    });
    saveAndRender();
    if(movieForm) movieForm.reset();
    closeModal();
}

function updateStats() {
    const watched = movies.filter(m => m.status === 'İzlendi');
    const favs = movies.filter(m => m.isFavorite).length;
    const watchedCount = watched.length;
    const percentage = Math.min(Math.round((watchedCount / targetGoal) * 100), 100);

    if(document.getElementById('statTotalWatched')) document.getElementById('statTotalWatched').innerText = watchedCount;
    if(document.getElementById('statFavCount')) document.getElementById('statFavCount').innerText = favs;
    if(document.getElementById('statTargetText')) document.getElementById('statTargetText').innerText = `${watchedCount} / ${targetGoal}`;
    if(document.getElementById('targetProgressBar')) document.getElementById('targetProgressBar').style.width = `${percentage}%`;

    const now = new Date();
    const thisMonthCount = watched.filter(m => {
        const d = new Date(m.createdAt || 0);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    if(document.getElementById('statMonthlyBadge')) document.getElementById('statMonthlyBadge').innerText = `+${thisMonthCount} Bu Ay`;
}

function renderMovies() {
    if(!movieList) return;
    movieList.innerHTML = '';
    updateStats();

    const searchQuery = (document.getElementById('searchInput')?.value || '').toLowerCase();

    let filtered = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery);
        let matchesStatus = currentStatusFilter === 'favorites' ? movie.isFavorite : (currentStatusFilter === 'all' || movie.status === currentStatusFilter);
        let matchesType = currentTypeFilter === 'all' || movie.contentType === currentTypeFilter;
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
        <button class="bento-action-btn fav ${movie.isFavorite ? 'active' : ''}" onclick="toggleFavorite(${movie.id})">
        <i class="fa-solid fa-heart"></i>
        </button>
        <button class="bento-action-btn delete" onclick="deleteMovie(${movie.id})">
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

function toggleFavorite(id) {
    movies = movies.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m);
    saveAndRender();
}

function filterMovies(status, event) {
    currentStatusFilter = status;
    document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
    if (event?.target) event.target.classList.add('active');
    renderMovies();
}

function searchMovies() { renderMovies(); }

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(movies));
    const a = document.createElement('a');
    a.href = dataStr; a.download = "hi_app_kutuphane_yedek.json";
    document.body.appendChild(a); a.click(); a.remove();
}

function saveAndRender() {
    localStorage.setItem('myMovies', JSON.stringify(movies));
    renderMovies();
}

/* TAKVİM VE NOT MANTIĞI */
let calendarDate = new Date();

function renderFullCalendar() {
    const monthYearText = document.getElementById('calendarMonthYear');
    const daysGrid = document.getElementById('calendarDaysGrid');
    if (!daysGrid || !monthYearText) return;

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

    monthYearText.innerText = `${monthNames[month]} ${year}`;
    daysGrid.innerHTML = '';

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day-cell', 'empty');
        emptyCell.style.opacity = '0.3';
        daysGrid.appendChild(emptyCell);
    }

    const today = new Date();

    for (let day = 1; day <= lastDay; day++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-day-cell');

        const formattedMonth = (month + 1).toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');
        const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }

        if (selectedDateKey === dateKey) {
            cell.classList.add('selected');
        }

        let dotsHtml = '';
        if (calendarNotes[dateKey] && calendarNotes[dateKey].length > 0) {
            dotsHtml = '<div class="day-dots">' + calendarNotes[dateKey].map(() => '<div class="day-dot"></div>').join('') + '</div>';
        }

        cell.innerHTML = `
        <span class="day-num">${day}</span>
        ${dotsHtml}
        `;

        cell.onclick = () => selectCalendarDate(dateKey, day, monthNames[month]);
        daysGrid.appendChild(cell);
    }
}

function selectCalendarDate(dateKey, day, monthName) {
    selectedDateKey = dateKey;
    document.getElementById('selectedDateTitle').innerText = `${day} ${monthName}`;
    document.getElementById('selectedDateBadge').innerText = dateKey;
    renderDayNotes();
    renderFullCalendar();
}

function renderDayNotes() {
    const container = document.getElementById('dayNotesList');
    if (!container) return;

    if (!selectedDateKey || !calendarNotes[selectedDateKey] || calendarNotes[selectedDateKey].length === 0) {
        container.innerHTML = `<p class="empty-state">Bu tarih için kayıtlı not bulunamadı.</p>`;
        return;
    }

    container.innerHTML = '';
    calendarNotes[selectedDateKey].forEach((note, index) => {
        const div = document.createElement('div');
        div.classList.add('note-item');
        div.innerHTML = `
        <span>${note}</span>
        <button onclick="deleteDayNote(${index})"><i class="fa-solid fa-xmark"></i></button>
        `;
        container.appendChild(div);
    });
}

function addDayNote() {
    const input = document.getElementById('noteInput');
    if (!selectedDateKey) {
        alert("Lütfen önce takvimden bir gün seçin!");
        return;
    }
    if (!input.value.trim()) return;

    if (!calendarNotes[selectedDateKey]) calendarNotes[selectedDateKey] = [];
    calendarNotes[selectedDateKey].push(input.value.trim());

    localStorage.setItem('myCalendarNotes', JSON.stringify(calendarNotes));
    input.value = '';
    renderDayNotes();
    renderFullCalendar();
}

function deleteDayNote(index) {
    if (selectedDateKey && calendarNotes[selectedDateKey]) {
        calendarNotes[selectedDateKey].splice(index, 1);
        if (calendarNotes[selectedDateKey].length === 0) delete calendarNotes[selectedDateKey];
        localStorage.setItem('myCalendarNotes', JSON.stringify(calendarNotes));
        renderDayNotes();
        renderFullCalendar();
    }
}

function goToToday() {
    calendarDate = new Date();
    renderFullCalendar();
}

function renderReports() {
    const filmCount = movies.filter(m => (m.contentType || 'Film') === 'Film').length;
    const diziCount = movies.filter(m => m.contentType === 'Dizi').length;
    if(document.getElementById('typeDistribution')) document.getElementById('typeDistribution').innerText = `🎬 ${filmCount} Film | 📺 ${diziCount} Dizi`;

    const rated = movies.filter(m => !isNaN(parseFloat(m.rating)));
    const avg = rated.length > 0 ? (rated.reduce((acc, m) => acc + parseFloat(m.rating), 0) / rated.length).toFixed(1) : '0.0';
    if(document.getElementById('avgRatingStat')) document.getElementById('avgRatingStat').innerText = `⭐ ${avg} / 10`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('prevMonthBtn')?.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderFullCalendar();
    });

    document.getElementById('nextMonthBtn')?.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderFullCalendar();
    });

    renderMovies();
    renderFullCalendar();
});
