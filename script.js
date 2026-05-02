// ============ GLOBAL VARIABLES ============
let currentUser = null;
let currentDate = new Date();
let waterRecords = [];
let friends = [];
let pendingRequests = [];
let selectedRestDay = null;
let currentGender = 'female';
let activeTheme = localStorage.getItem('activeTheme') || '1';
let lastCheckedDate = localStorage.getItem('lastCheckedDate');

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        loadFromStorage();
        showMainApp();
        // Verificar mudança de dia e registrar presença/falta
        checkDayChange();
        // Carregar tema ativo do usuário
        setTimeout(loadActiveTheme, 100);
    } else {
        showLoginPage();
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('profileModal');
        if (e.target === modal) {
            closeProfile();
        }
    });
    
    // Keyboard navigation for calendar days
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const target = e.target;
            if (target && target.getAttribute('role') === 'button' && target.getAttribute('data-date')) {
                e.preventDefault();
                const date = target.getAttribute('data-date');
                toggleWorkoutDay(date);
            }
        }
    });
});

// ============ LOGIN & SIGNUP ============
function handleCredentialResponse(response) {
    // Decode the JWT token (simplified)
    const userObject = jwt_decode(response.credential);
    
    const user = {
        id: userObject.sub,
        name: userObject.name,
        email: userObject.email,
        picture: userObject.picture
    };
    
    loginUser(user);
}

function jwt_decode(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = {
        id: email,
        name: email.split('@')[0],
        email: email
    };
    
    loginUser(user);
});

document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const password2 = document.getElementById('signupPassword2').value;
    
    if (password !== password2) {
        alert('As senhas não conferem!');
        return;
    }
    
    const user = {
        id: email,
        name: name,
        email: email
    };
    
    loginUser(user);
});

function loginUser(user) {
    currentUser = user;
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    createConfetti();
    
    // Com o novo sistema flexível, não é necessário escolher dia de descanso na primeira vez
    showMainApp();
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        // Fechar todos os modais abertos
        const modals = ['profileModal', 'restDayModal', 'editRestDayModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = 'none';
        });
        
        // Limpar usuário atual
        currentUser = null;
        
        // Limpar todos os dados do usuário do localStorage
        // (mantém activeTheme e outros dados globais)
        const userDataKeys = Object.keys(localStorage).filter(key => 
            key.includes('workouts_') || 
            key.includes('water_') || 
            key.includes('friends_') || 
            key.includes('pending_') || 
            key.includes('missedDays_') ||
            key.includes('lastCheckedDate_') ||
            key.includes('restDays_') ||
            key.includes('restDayColor_') ||
            key.includes('measurements_') ||
            key === 'loggedInUser'
        );
        userDataKeys.forEach(key => localStorage.removeItem(key));
        
        // Limpar variáveis globais
        waterRecords = [];
        friends = [];
        pendingRequests = [];
        selectedRestDay = null;
        currentDate = new Date();
        lastCheckedDate = null;
        
        // Resetar para visualização padrão
        currentGender = 'female';
        activeTheme = '1';
        
        // Esconder todos os tabs e formulários
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });
        
        // Limpar elementos do DOM
        const themesContainer = document.getElementById('themesContainer');
        if (themesContainer) themesContainer.innerHTML = '';
        
        const calendarDays = document.getElementById('calendarDays');
        if (calendarDays) calendarDays.innerHTML = '';
        
        // Resetar formulários
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        if (loginForm) loginForm.reset();
        if (signupForm) signupForm.reset();
        
        // Mostrar página de login
        showLoginPage();
    }
}

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'none';
}

function showSignup() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'block';
}

function showLogin() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('signupPage').style.display = 'none';
}

function showMainApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    switchTab('calendar');
    updateTodayDate();
}

// ============ TAB SWITCHING ============
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    if (tabName === 'calendar') {
        renderCalendar();
    } else if (tabName === 'water') {
        renderWaterTab();
        renderWaterChart();
    } else if (tabName === 'measurements') {
        renderMeasurementsTab();
    } else if (tabName === 'friends') {
        renderFriendsTab();
    } else if (tabName === 'themes') {
        renderThemes();
    } else if (tabName === 'performance') {
        renderPerformanceTab();
    }
}

// ============ CALENDAR ============
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const restDayColor = getRestDayColor();
    
    let days = '';
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        days += `<article class="day other-month" aria-disabled="true">${daysInPrevMonth - i}</article>`;
    }
    
    // Current month days
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const workouts = getCheckedWorkouts();
    const missedDays = getMissedDays();
    
    for (let i = 1; i <= daysInMonth; i++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dateObj = new Date(year, month, i);
        const dayOfWeek = dateObj.getDay();
        const isToday = todayString === date;
        const isChecked = workouts.includes(date);
        const isMissed = missedDays.includes(date);
        const isPast = date < todayString;
        const isFuture = date > todayString;
        const isRestDayDate = isRestDay(date);
        
        let dayClass = 'day';
        if (isToday) dayClass += ' today';
        if (isChecked) dayClass += ' checked';
        if (isMissed) dayClass += ' missed';
        if (isRestDayDate) dayClass += ' rest-day';
        
        let dayContent = i;
        let isDisabled = isPast || isFuture || isRestDayDate;
        let clickHandler = isDisabled ? '' : `onclick="toggleWorkoutDay('${date}')"`;
        
        if (isRestDayDate) {
            dayClass += ' disabled';
            days += `<article class="${dayClass}" aria-disabled="true" aria-label="Dia de descanso - ${i}" style="background: ${restDayColor}; border-color: ${restDayColor};"><span>${dayContent}</span></article>`;
        } else if (isDisabled) {
            days += `<article class="${dayClass} disabled" aria-disabled="true" aria-label="Dia ${i}">${dayContent}</article>`;
        } else {
            days += `<article class="${dayClass}" role="button" tabindex="0" ${clickHandler} aria-label="Marcar treino - Dia ${i}" data-date="${date}">${dayContent}</article>`;
        }
    }
    
    
    // Next month days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    for (let i = 1; i <= totalCells - firstDay - daysInMonth; i++) {
        days += `<div class="day other-month">${i}</div>`;
    }
    
    document.getElementById('calendarDays').innerHTML = days;
    
    // Update stats
    updateCalendarStats();
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function toggleWorkoutDay(date) {
    let workouts = getCheckedWorkouts();
    const index = workouts.indexOf(date);
    let isAdding = false;
    
    if (index > -1) {
        workouts.splice(index, 1);
    } else {
        workouts.push(date);
        isAdding = true;
    }
    
    localStorage.setItem(`workouts_${currentUser.id}`, JSON.stringify(workouts));
    
    if (isAdding) {
        createConfetti();
    }
    
    renderCalendar();
}

function getCheckedWorkouts() {
    const workouts = localStorage.getItem(`workouts_${currentUser.id}`);
    return workouts ? JSON.parse(workouts) : [];
}

function updateCalendarStats() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const workouts = getCheckedWorkouts();
    const monthWorkouts = workouts.filter(date => {
        const d = new Date(date);
        return d.getFullYear() === year && d.getMonth() === month;
    });
    
    document.getElementById('monthWorkouts').textContent = monthWorkouts.length;
    
    // Calculate streak
    const streakDays = calculateStreak();
    document.getElementById('streakDays').textContent = streakDays;
}

function calculateStreak() {
    const workouts = getCheckedWorkouts().sort().reverse();
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        if (workouts.includes(dateStr)) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    
    return streak;
}

// ============ DAY CHANGE VERIFICATION ============
function checkDayChange() {
    const today = new Date().toISOString().split('T')[0];
    const previousDate = localStorage.getItem(`lastCheckedDate_${currentUser.id}`);
    
    // Se não há data anterior ou a data mudou
    if (!previousDate || previousDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        // Se é a primeira vez, apenas guardar a data
        if (!previousDate) {
            localStorage.setItem(`lastCheckedDate_${currentUser.id}`, today);
            return;
        }
        
        // Verificar se o dia anterior foi marcado como treino
        const workouts = getCheckedWorkouts();
        const isYesterdayRestDay = isRestDay(yesterdayString);
        
        // Se não era dia de descanso e não foi marcado treino, registrar como falta
        if (!isYesterdayRestDay && !workouts.includes(yesterdayString)) {
            // Marcar como falta (adicionar à lista de faltas)
            markAsMissedDay(yesterdayString);
        }
        
        // Atualizar a data atual
        localStorage.setItem(`lastCheckedDate_${currentUser.id}`, today);
    }
}

function markAsMissedDay(date) {
    let missedDays = getMissedDays();
    if (!missedDays.includes(date)) {
        missedDays.push(date);
        localStorage.setItem(`missedDays_${currentUser.id}`, JSON.stringify(missedDays));
    }
}

function getMissedDays() {
    const missedDays = localStorage.getItem(`missedDays_${currentUser.id}`);
    return missedDays ? JSON.parse(missedDays) : [];
}

// ============ WATER TRACKING ============
function updateTodayDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('pt-BR', options);
    document.getElementById('todayDate').textContent = today;
}

function getTodayWater() {
    const today = new Date().toISOString().split('T')[0];
    const records = getWaterRecords();
    return records.filter(r => r.date === today);
}

function getTodayWaterAmount() {
    return getTodayWater().reduce((sum, r) => sum + r.amount, 0);
}

function getWaterRecords() {
    const records = localStorage.getItem(`water_${currentUser.id}`);
    return records ? JSON.parse(records) : [];
}

function saveWaterRecords() {
    localStorage.setItem(`water_${currentUser.id}`, JSON.stringify(waterRecords));
}

function loadFromStorage() {
    waterRecords = getWaterRecords();
}

function addWaterCup(ml) {
    addWater(ml);
}

function increaseWater() {
    const input = document.getElementById('waterInput');
    input.value = parseInt(input.value) + 50;
}

function decreaseWater() {
    const input = document.getElementById('waterInput');
    const current = parseInt(input.value);
    if (current > 50) {
        input.value = current - 50;
    }
}

function addCustomWater() {
    const amount = parseInt(document.getElementById('waterInput').value);
    if (amount > 0) {
        addWater(amount);
        document.getElementById('waterInput').value = 250;
    }
}

function addWater(amount) {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const record = {
        id: Date.now(),
        date: today,
        time: time,
        amount: amount
    };
    
    waterRecords.push(record);
    saveWaterRecords();
    renderWaterTab();
    renderWaterChart();
}

function resetWaterToday() {
    if (confirm('Resetar água de hoje?')) {
        const today = new Date().toISOString().split('T')[0];
        waterRecords = waterRecords.filter(r => r.date !== today);
        saveWaterRecords();
        renderWaterTab();
        renderWaterChart();
    }
}

function deleteWaterRecord(id) {
    waterRecords = waterRecords.filter(r => r.id !== id);
    saveWaterRecords();
    renderWaterTab();
    renderWaterChart();
}

function renderWaterTab() {
    const todayAmount = getTodayWaterAmount();
    const percentage = (todayAmount / 2000) * 100;
    const circumference = 2 * Math.PI * 90;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    document.getElementById('waterAmount').textContent = todayAmount;
    document.getElementById('progressCircle').style.strokeDashoffset = strokeDashoffset + 'px';
    
    // Celebration when reaching 2000ml
    if (todayAmount >= 2000 && todayAmount < 2250) {
        createConfetti();
        document.getElementById('waterAmount').style.color = '#FFD93D';
        document.getElementById('waterAmount').style.animation = 'pulse 0.5s ease-out';
    } else {
        document.getElementById('waterAmount').style.color = 'var(--water-blue)';
    }
    
    renderWaterRecords();
}

function renderWaterRecords() {
    const records = getWaterRecords();
    const tbody = document.getElementById('recordsTableBody');
    
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">Nenhum registro</td></tr>';
        return;
    }
    
    tbody.innerHTML = records.map(r => `
        <tr>
            <td>${new Date(r.date).toLocaleDateString('pt-BR')}</td>
            <td><strong>${r.amount}ml</strong></td>
            <td>${r.time}</td>
            <td><button class="delete-btn" onclick="deleteWaterRecord(${r.id})">Deletar</button></td>
        </tr>
    `).reverse().join('');
}

function filterRecords(type) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    if (type === 'week') {
        document.getElementById('filterWeek').classList.add('active');
    } else if (type === 'month') {
        document.getElementById('filterMonth').classList.add('active');
    } else {
        document.getElementById('filterAll').classList.add('active');
    }
    
    renderWaterRecords();
}

function renderWaterChart() {
    const chart = document.getElementById('waterChart');
    const records = getWaterRecords();
    
    // Get last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }
    
    let html = '';
    const maxAmount = 2500;
    
    days.forEach((day, index) => {
        const dayRecords = records.filter(r => r.date === day);
        const total = dayRecords.reduce((sum, r) => sum + r.amount, 0);
        const height = (total / maxAmount) * 100;
        const dayName = new Date(day).toLocaleDateString('pt-BR', { weekday: 'short' });
        
        html += `
            <div class="chart-bar" style="height: ${Math.max(height, 5)}%;" title="${total}ml">
                <div class="chart-bar-value">${total > 0 ? (total / 1000).toFixed(1) + 'L' : ''}</div>
                <div class="chart-bar-label">${dayName}</div>
            </div>
        `;
    });
    
    chart.innerHTML = html;
}

// ============ REST DAY FUNCTIONS ============
// Funções de descanso foram atualizadas para sistema flexível por data

// Obter array de datas de descanso
function getRestDays() {
    const restDays = localStorage.getItem(`restDays_${currentUser.id}`);
    return restDays ? JSON.parse(restDays) : [];
}

// Verificar se uma data é dia de descanso
function isRestDay(dateString) {
    const restDays = getRestDays();
    return restDays.includes(dateString);
}

// Adicionar data como dia de descanso
function addRestDay(dateString) {
    const restDays = getRestDays();
    if (!restDays.includes(dateString)) {
        restDays.push(dateString);
        localStorage.setItem(`restDays_${currentUser.id}`, JSON.stringify(restDays));
    }
}

// Remover data como dia de descanso
function removeRestDay(dateString) {
    const restDays = getRestDays();
    const index = restDays.indexOf(dateString);
    if (index > -1) {
        restDays.splice(index, 1);
        localStorage.setItem(`restDays_${currentUser.id}`, JSON.stringify(restDays));
    }
}

function getRestDayColor() {
    const color = localStorage.getItem(`restDayColor_${currentUser.id}`);
    return color || '#B3E5FC';
}

function changeRestDayColor(color) {
    localStorage.setItem(`restDayColor_${currentUser.id}`, color);
    renderCalendar();
}

// Obter próximo dia de descanso recomendado
function getNextRecommendedRestDay() {
    const today = new Date();
    const restDays = getRestDays();
    
    // Procurar por um dia de descanso futuro neste mês
    for (let i = 1; i <= 31; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        if (date.getMonth() !== today.getMonth()) break; // Parou de olhar no próximo mês
        
        const dateString = date.toISOString().split('T')[0];
        if (!restDays.includes(dateString)) {
            return dateString;
        }
    }
    
    // Se não encontrou, retorna o próximo dia
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
}

function editRestDay() {
    const editModal = document.getElementById('editRestDayModal');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Clear previous selector
    const selector = document.getElementById('editRestDaySelector');
    selector.innerHTML = '';
    
    // Create calendar buttons for the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const restDays = getRestDays();
    
    for (let i = 1; i <= daysInMonth; i++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dateObj = new Date(year, month, i);
        const isPast = date < todayString;
        const isCurrentRestDay = restDays.includes(date);
        
        const button = document.createElement('button');
        button.className = 'day-selector';
        button.setAttribute('data-date', date);
        button.textContent = i;
        button.disabled = isPast; // Desabilitar datas passadas
        button.onclick = () => selectEditRestDay(date, button);
        
        if (isCurrentRestDay) {
            button.classList.add('selected');
            button.style.backgroundColor = 'var(--success)';
            button.style.color = 'white';
        }
        
        selector.appendChild(button);
    }
    
    // Close profile modal and open edit modal
    document.getElementById('profileModal').style.display = 'none';
    editModal.style.display = 'flex';
}

function selectEditRestDay(dateString, buttonElement) {
    // Se já é dia de descanso, desmarcar. Senão, marcar.
    if (buttonElement.classList.contains('selected')) {
        removeRestDay(dateString);
        buttonElement.classList.remove('selected');
    } else {
        addRestDay(dateString);
        buttonElement.classList.add('selected');
    }
    // Atualizar o calendário automaticamente
    renderCalendar();
}

function confirmEditRestDay() {
    // Salvar foi feito automaticamente em selectEditRestDay
    document.getElementById('editRestDayModal').style.display = 'none';
    renderCalendar();
    showProfile();
}

function closeEditRestDay() {
    document.getElementById('editRestDayModal').style.display = 'none';
    showProfile();
}

// ============ FRIENDS ============
function getFriends() {
    const friends = localStorage.getItem(`friends_${currentUser.id}`);
    return friends ? JSON.parse(friends) : [];
}

function saveFriends(friendsList) {
    localStorage.setItem(`friends_${currentUser.id}`, JSON.stringify(friendsList));
}

function getPendingRequests() {
    const requests = localStorage.getItem(`pending_${currentUser.id}`);
    return requests ? JSON.parse(requests) : [];
}

function savePendingRequests(requests) {
    localStorage.setItem(`pending_${currentUser.id}`, JSON.stringify(requests));
}

function addFriend() {
    const email = document.getElementById('friendEmail').value.trim();
    const messageDiv = document.getElementById('friendsMessage');
    
    if (!email) {
        showMessage('Por favor, insira um email', 'error', messageDiv);
        return;
    }
    
    if (email === currentUser.email) {
        showMessage('Você não pode adicionar a si mesmo!', 'error', messageDiv);
        return;
    }
    
    const friends = getFriends();
    if (friends.some(f => f.email === email)) {
        showMessage('Este amigo já está na sua lista!', 'error', messageDiv);
        return;
    }
    
    // Simulate adding friend
    const newFriend = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
        addedDate: new Date().toISOString().split('T')[0]
    };
    
    friends.push(newFriend);
    saveFriends(friends);
    document.getElementById('friendEmail').value = '';
    showMessage('Amigo adicionado com sucesso!', 'success', messageDiv);
    
    renderFriendsTab();
}

function removeFriend(friendId) {
    if (confirm('Remover este amigo?')) {
        const friends = getFriends();
        const updatedFriends = friends.filter(f => f.id !== friendId);
        saveFriends(updatedFriends);
        renderFriendsTab();
    }
}

function showMessage(text, type, element) {
    element.textContent = text;
    element.className = `message ${type}`;
    setTimeout(() => {
        element.className = 'message';
    }, 3000);
}

function renderFriendsTab() {
    const friends = getFriends();
    const friendsContainer = document.getElementById('friendsListContainer');
    const friendsCount = document.getElementById('friendsCount');
    
    friendsCount.textContent = friends.length;
    
    if (friends.length === 0) {
        friendsContainer.innerHTML = '<div class="empty-state">Nenhum amigo adicionado ainda</div>';
    } else {
        friendsContainer.innerHTML = friends.map(friend => `
            <div class="friend-card">
                <div class="friend-avatar">${friend.name.charAt(0).toUpperCase()}</div>
                <div class="friend-name">${friend.name}</div>
                <div class="friend-water">Email: ${friend.email}</div>
                <div class="friend-actions">
                    <button class="btn-danger" onclick="removeFriend(${friend.id})">Remover</button>
                </div>
            </div>
        `).join('');
    }
    
    renderLeaderboard();
}

function renderLeaderboard() {
    const friends = getFriends();
    const leaderboard = document.getElementById('leaderboard');
    
    if (friends.length === 0) {
        leaderboard.innerHTML = '<div class="empty-state">Adicione amigos para ver o ranking</div>';
        return;
    }
    
    // Simulate getting water data for friends
    const friendsData = friends.map((friend, index) => ({
        ...friend,
        water: Math.floor(Math.random() * 3000) + 500
    })).sort((a, b) => b.water - a.water);
    
    leaderboard.innerHTML = friendsData.map((friend, index) => {
        let rankClass = '';
        let rankEmoji = (index + 1) + '';
        
        if (index === 0) rankClass = 'first';
        if (index === 1) rankClass = 'second';
        if (index === 2) rankClass = 'third';
        
        return `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${friend.name}</div>
                    <div class="leaderboard-water">${friend.email}</div>
                </div>
                <div class="leaderboard-value">${(friend.water / 1000).toFixed(1)}L</div>
            </div>
        `;
    }).join('');
}

// ============ STORAGE ============
function saveToStorage() {
    localStorage.setItem(`water_${currentUser.id}`, JSON.stringify(waterRecords));
}

// ============ EXPORT SVG GRADIENT INLINE ============
document.addEventListener('DOMContentLoaded', () => {
    // Create SVG for gradient
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.display = 'none';
    svg.innerHTML = `
        <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#00BCD4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#0097A7;stop-opacity:1" />
            </linearGradient>
        </defs>
    `;
    document.body.appendChild(svg);
    
    // Setup theme tabs
    setTimeout(() => {
        const themeFemaleBtn = document.querySelector('[onclick*="switchGender(\'female\')"]');
        const themeMaleBtn = document.querySelector('[onclick*="switchGender(\'male\')"]');
        if (themeFemaleBtn) themeFemaleBtn.classList.add('active');
    }, 100);
});

// ============ PROFILE FUNCTIONS ============
function showProfile() {
    const modal = document.getElementById('profileModal');
    const workouts = getCheckedWorkouts();
    const waterTotal = (getTotalWater() / 1000).toFixed(1);
    const streak = calculateStreak();
    
    // Set profile info
    document.getElementById('profileName').value = currentUser.name || 'Usuário';
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profileAvatarLarge').textContent = (currentUser.name || 'U')[0].toUpperCase();
    document.getElementById('profileWorkouts').textContent = workouts.length;
    document.getElementById('profileWaterTotal').textContent = waterTotal;
    document.getElementById('profileStreak').textContent = streak;
    
    // Display rest days (próximo descanso ou lista)
    const restDays = getRestDays();
    const today = new Date().toISOString().split('T')[0];
    const nextRestDay = restDays.filter(d => d > today).sort()[0];
    
    if (nextRestDay) {
        const restDate = new Date(nextRestDay);
        const formattedDate = restDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
        document.getElementById('profileRestDay').textContent = `Próximo: ${formattedDate}`;
    } else {
        document.getElementById('profileRestDay').textContent = 'Nenhum descanso programado';
    }
    
    // Load rest day color
    const restDayColor = getRestDayColor();
    document.getElementById('restDayColor').value = restDayColor;
    
    // Generate achievements
    generateAchievements(workouts.length, parseFloat(waterTotal), streak);
    
    modal.style.display = 'flex';
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}

function generateAchievements(workouts, water, streak) {
    const achievements = [];
    
    // Badges baseadas em conquistas
    if (workouts >= 1) achievements.push({ emoji: '💪', name: 'Primeira vez' });
    if (workouts >= 5) achievements.push({ emoji: '🔥', name: '5 treinos' });
    if (workouts >= 10) achievements.push({ emoji: '⭐', name: '10 treinos' });
    if (workouts >= 20) achievements.push({ emoji: '👑', name: 'Campeão' });
    if (water >= 10) achievements.push({ emoji: '💧', name: '10L água' });
    if (water >= 50) achievements.push({ emoji: '🌊', name: '50L água' });
    if (streak >= 3) achievements.push({ emoji: '🏃', name: '3 dias' });
    if (streak >= 7) achievements.push({ emoji: '🎯', name: 'Uma semana' });
    if (streak >= 30) achievements.push({ emoji: '🏆', name: 'Um mês' });
    
    const achievementsList = document.getElementById('achievementsList');
    if (achievements.length === 0) {
        achievementsList.innerHTML = '<div class=\"empty-state\" style=\"grid-column: 1/-1; background: var(--light); padding: 20px; border-radius: 10px;\">Continue trabalhando para ganhar conquistas! 🎉</div>';
    } else {
        achievementsList.innerHTML = achievements.map(a => `
            <div class=\"achievement\" title=\"${a.name}\">
                ${a.emoji}
                <div class=\"achievement-name\">${a.name}</div>
            </div>
        `).join('');
    }
}

// ============ RESET ACCOUNT FUNCTIONS ============
function resetAccount() {
    const confirmMessage = 'Tem certeza que deseja resetar TODOS os dados da sua conta?\n\nIsso irá apagar:\n- Todos os treinos marcados\n- Histórico de água\n- Medidas corporais\n- Conquistas\n- Amigos\n- Tema personalizado\n\nEsta ação NÃO pode ser desfeita!';
    
    if (confirm(confirmMessage)) {
        const secondConfirm = prompt('Digite "RESETAR" para confirmar o reset de sua conta:');
        
        if (secondConfirm === 'RESETAR') {
            // Apagar todos os dados
            localStorage.removeItem(`workouts_${currentUser.id}`);
            localStorage.removeItem(`water_${currentUser.id}`);
            localStorage.removeItem(`friends_${currentUser.id}`);
            localStorage.removeItem(`pending_${currentUser.id}`);
            localStorage.removeItem(`missedDays_${currentUser.id}`);
            localStorage.removeItem(`lastCheckedDate_${currentUser.id}`);
            localStorage.removeItem(`restDays_${currentUser.id}`);
            localStorage.removeItem(`restDayColor_${currentUser.id}`);
            localStorage.removeItem(`measurements_${currentUser.id}`);
            localStorage.removeItem('activeTheme');
            
            // Resetar variáveis globais
            waterRecords = [];
            friends = [];
            pendingRequests = [];
            activeTheme = '1';
            
            // Recarregar tema padrão
            document.documentElement.style.setProperty('--primary', '#FFB3D9');
            document.documentElement.style.setProperty('--secondary', '#B3E5FC');
            
            alert('Sua conta foi resetada com sucesso! 🔄');
            
            // Fechar modal e atualizar calendário
            closeProfile();
            renderCalendar();
            renderWaterTab();
            renderFriendsTab();
            
            // Recarregar temas com progresso zerado
            setTimeout(() => {
                renderThemes();
            }, 100);
        } else if (secondConfirm !== null) {
            alert('Confirmação incorreta. Reset cancelado.');
        }
    }
}

function getTotalWater() {
    return waterRecords.reduce((sum, r) => sum + r.amount, 0);
}

// ============ UTILITY FUNCTIONS ============
function getTodayFormatted() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

// ============ CELEBRATORY EFFECTS ============
function celebrateAchievement() {
    // Adiciona animação ao adicionar água
    const waterAmount = document.getElementById('waterAmount');
    waterAmount.style.animation = 'bounce 0.5s ease-out';
    setTimeout(() => {
        waterAmount.style.animation = '';
    }, 500);
}

function addWater(amount) {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const record = {
        id: Date.now(),
        date: today,
        time: time,
        amount: amount
    };
    
    waterRecords.push(record);
    saveWaterRecords();
    celebrateAchievement();
    renderWaterTab();
    renderWaterChart();
}

// ============ MEASUREMENTS ============
function getMeasurements() {
    const measurements = localStorage.getItem(`measurements_${currentUser.id}`);
    return measurements ? JSON.parse(measurements) : {};
}

function saveMeasurements() {
    const measurements = getMeasurements();
    const today = new Date();
    const monthKey = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
    
    const newMeasurement = {
        weight: parseFloat(document.getElementById('weight').value) || 0,
        height: parseFloat(document.getElementById('height').value) || 0,
        arm: parseFloat(document.getElementById('arm').value) || 0,
        chest: parseFloat(document.getElementById('chest').value) || 0,
        abdomen: parseFloat(document.getElementById('abdomen').value) || 0,
        waist: parseFloat(document.getElementById('waist').value) || 0,
        thigh: parseFloat(document.getElementById('thigh').value) || 0,
        calf: parseFloat(document.getElementById('calf').value) || 0,
    };
    
    measurements[monthKey] = newMeasurement;
    localStorage.setItem(`measurements_${currentUser.id}`, JSON.stringify(measurements));
    
    // Limpar formulário
    document.getElementById('weight').value = '';
    document.getElementById('height').value = '';
    document.getElementById('arm').value = '';
    document.getElementById('chest').value = '';
    document.getElementById('abdomen').value = '';
    document.getElementById('waist').value = '';
    document.getElementById('thigh').value = '';
    document.getElementById('calf').value = '';
    
    alert('Medidas salvas com sucesso! 📏');
    renderMeasurementsTab();
}

function renderMeasurementsTab() {
    const today = new Date();
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const currentMonth = monthNames[today.getMonth()] + ' de ' + today.getFullYear();
    document.getElementById('currentMonth').textContent = currentMonth;
    
    const measurements = getMeasurements();
    const historyContainer = document.getElementById('measurementsHistoryContainer');
    
    if (Object.keys(measurements).length === 0) {
        historyContainer.innerHTML = '<p style="text-align: center; color: var(--text-color); padding: 20px;">Nenhuma medida registrada ainda</p>';
        return;
    }
    
    // Ordenar as medidas por data (mais recente primeiro)
    const sortedMonths = Object.keys(measurements).sort().reverse();
    
    let html = '<div class="measurements-history-list">';
    
    sortedMonths.forEach((monthKey, index) => {
        const measurement = measurements[monthKey];
        const [year, month] = monthKey.split('-');
        const monthName = monthNames[parseInt(month) - 1];
        const displayMonth = monthName + ' ' + year;
        
        // Calcular variação em relação ao mês anterior
        let differences = {};
        if (index < sortedMonths.length - 1) {
            const previousMeasurement = measurements[sortedMonths[index + 1]];
            differences = {
                weight: measurement.weight - previousMeasurement.weight,
                height: measurement.height - previousMeasurement.height,
                arm: measurement.arm - previousMeasurement.arm,
                chest: measurement.chest - previousMeasurement.chest,
                abdomen: measurement.abdomen - previousMeasurement.abdomen,
                waist: measurement.waist - previousMeasurement.waist,
                thigh: measurement.thigh - previousMeasurement.thigh,
                calf: measurement.calf - previousMeasurement.calf,
            };
        }
        
        const getDifferenceHTML = (value) => {
            if (value === undefined || value === 0) return '';
            const sign = value > 0 ? '+' : '';
            const color = value > 0 ? '#FF6B6B' : '#52B788';
            return `<span style="color: ${color}; font-weight: 600; margin-left: 8px;">${sign}${value.toFixed(1)}</span>`;
        };
        
        html += `
            <div class="measurement-card">
                <div class="measurement-card-header">
                    <h4>${displayMonth}</h4>
                    <button onclick="deleteMeasurement('${monthKey}')" class="btn-small btn-delete" style="padding: 4px 8px; font-size: 11px;">Deletar</button>
                </div>
                <div class="measurement-card-body">
                    <div class="measurement-row">
                        <span class="measurement-label">Peso:</span>
                        <span class="measurement-value">${measurement.weight.toFixed(1)} kg ${getDifferenceHTML(differences.weight)}</span>
                    </div>
                    <div class="measurement-row">
                        <span class="measurement-label">Altura:</span>
                        <span class="measurement-value">${measurement.height.toFixed(1)} cm ${getDifferenceHTML(differences.height)}</span>
                    </div>
                    <div class="measurement-row">
                        <span class="measurement-label">Braço:</span>
                        <span class="measurement-value">${measurement.arm.toFixed(1)} cm ${getDifferenceHTML(differences.arm)}</span>
                    </div>
                    <div class="measurement-row">
                        <span class="measurement-label">Peito:</span>
                        <span class="measurement-value">${measurement.chest.toFixed(1)} cm ${getDifferenceHTML(differences.chest)}</span>
                    </div>
                    <div class="measurement-row">
                        <span class="measurement-label">Abdômen:</span>
                        <span class="measurement-value">${measurement.abdomen.toFixed(1)} cm ${getDifferenceHTML(differences.abdomen)}</span>
                    </div>
                    <div class="measurement-row">
                        <span class="measurement-label">Cintura:</span>
                        <span class="measurement-value">${measurement.waist.toFixed(1)} cm ${getDifferenceHTML(differences.waist)}</span>
                    </div>
                    <div class="measurement-row">
                        <span class="measurement-label">Coxa:</span>
                        <span class="measurement-value">${measurement.thigh.toFixed(1)} cm ${getDifferenceHTML(differences.thigh)}</span>
                    </div>
                    <div class="measurement-row">
                        <span class="measurement-label">Panturrilha:</span>
                        <span class="measurement-value">${measurement.calf.toFixed(1)} cm ${getDifferenceHTML(differences.calf)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    historyContainer.innerHTML = html;
}

function deleteMeasurement(monthKey) {
    if (confirm('Tem certeza que deseja deletar as medidas deste mês?')) {
        const measurements = getMeasurements();
        delete measurements[monthKey];
        localStorage.setItem(`measurements_${currentUser.id}`, JSON.stringify(measurements));
        renderMeasurementsTab();
    }
}

// ============ PERFORMANCE ============
function getWeightData() {
    const measurements = getMeasurements();
    const weightData = [];
    
    Object.keys(measurements).sort().forEach(monthKey => {
        const [year, month] = monthKey.split('-');
        const monthName = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const label = monthName[parseInt(month) - 1] + ' ' + year;
        weightData.push({
            label: label,
            weight: measurements[monthKey].weight,
            monthKey: monthKey
        });
    });
    
    return weightData;
}

function getFriendWeightData(friendEmail) {
    const friendMeasurements = localStorage.getItem(`measurements_${friendEmail}`);
    if (!friendMeasurements) return [];
    
    try {
        const measurements = JSON.parse(friendMeasurements);
        const weightData = [];
        
        Object.keys(measurements).sort().forEach(monthKey => {
            const [year, month] = monthKey.split('-');
            const monthName = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const label = monthName[parseInt(month) - 1] + ' ' + year;
            weightData.push({
                label: label,
                weight: measurements[monthKey].weight,
                monthKey: monthKey
            });
        });
        
        return weightData;
    } catch (e) {
        return [];
    }
}

function renderPerformanceTab() {
    const myWeightData = getWeightData();
    const friendSelector = document.getElementById('friendSelector');
    const friendsList = getFriends();
    
    // Carregar opções de amigos
    friendSelector.innerHTML = '<option value="">Apenas meu desempenho</option>';
    friendsList.forEach(friend => {
        const option = document.createElement('option');
        option.value = friend.email;
        option.textContent = friend.name;
        friendSelector.appendChild(option);
    });
    
    // Desenhar gráfico
    drawWeightChart(myWeightData);
    
    // Atualizar stats do usuário
    if (myWeightData.length > 0) {
        const weights = myWeightData.map(d => d.weight);
        const currentWeight = weights[weights.length - 1];
        const previousWeight = weights.length > 1 ? weights[weights.length - 2] : currentWeight;
        const difference = (currentWeight - previousWeight).toFixed(1);
        const sign = difference > 0 ? '+' : '';
        const color = difference > 0 ? '#FF6B6B' : '#52B788';
        
        document.getElementById('currentWeight').textContent = currentWeight.toFixed(1) + ' kg';
        document.getElementById('weightChange').textContent = sign + difference + ' kg';
        document.getElementById('weightChange').style.color = color;
        document.getElementById('minWeight').textContent = Math.min(...weights).toFixed(1) + ' kg';
        document.getElementById('maxWeight').textContent = Math.max(...weights).toFixed(1) + ' kg';
    }
    
    // Se um amigo foi selecionado
    const selectedFriendEmail = friendSelector.value;
    if (selectedFriendEmail) {
        const friendWeightData = getFriendWeightData(selectedFriendEmail);
        const friendWeightStats = document.getElementById('friendWeightStats');
        
        if (friendWeightData.length > 0) {
            friendWeightStats.style.display = 'block';
            const friendName = friendsList.find(f => f.email === selectedFriendEmail).name;
            document.getElementById('friendNameStats').textContent = 'Peso de ' + friendName;
            
            const weights = friendWeightData.map(d => d.weight);
            const currentWeight = weights[weights.length - 1];
            const previousWeight = weights.length > 1 ? weights[weights.length - 2] : currentWeight;
            const difference = (currentWeight - previousWeight).toFixed(1);
            const sign = difference > 0 ? '+' : '';
            const color = difference > 0 ? '#FF6B6B' : '#52B788';
            
            document.getElementById('friendCurrentWeight').textContent = currentWeight.toFixed(1) + ' kg';
            document.getElementById('friendWeightChange').textContent = sign + difference + ' kg';
            document.getElementById('friendWeightChange').style.color = color;
            document.getElementById('friendMinWeight').textContent = Math.min(...weights).toFixed(1) + ' kg';
            document.getElementById('friendMaxWeight').textContent = Math.max(...weights).toFixed(1) + ' kg';
        } else {
            friendWeightStats.style.display = 'none';
        }
    } else {
        document.getElementById('friendWeightStats').style.display = 'none';
    }
}

function drawWeightChart(myWeightData) {
    const canvas = document.getElementById('weightChart');
    const ctx = canvas.getContext('2d');
    const selectedFriendId = document.getElementById('friendSelector').value;
    const friendWeightData = selectedFriendId ? getFriendWeightData(selectedFriendId) : [];
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (myWeightData.length === 0) {
        ctx.fillStyle = '#6B6B6B';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhum dado de peso registrado', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Configurar dimensões
    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    // Encontrar min/max de pesos
    const allWeights = myWeightData.map(d => d.weight);
    if (friendWeightData.length > 0) {
        allWeights.push(...friendWeightData.map(d => d.weight));
    }
    
    const minWeight = Math.min(...allWeights);
    const maxWeight = Math.max(...allWeights);
    const range = maxWeight - minWeight || 1;
    const padding_weight = range * 0.1;
    
    // Desenhar grid e labels
    ctx.strokeStyle = '#f0f0f0';
    ctx.fillStyle = '#6B6B6B';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
        const weight = minWeight - padding_weight + (range + 2 * padding_weight) * (i / 5);
        const y = canvas.height - padding - (height * i / 5);
        
        ctx.fillText(weight.toFixed(1), padding - 10, y + 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // Desenhar dados do usuário (linha azul)
    ctx.strokeStyle = '#FFB3D9';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    myWeightData.forEach((data, index) => {
        const x = padding + (width * index) / (myWeightData.length - 1 || 1);
        const weightNormalized = (data.weight - (minWeight - padding_weight)) / (range + 2 * padding_weight);
        const y = canvas.height - padding - (height * weightNormalized);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Desenhar pontos do usuário
    ctx.fillStyle = '#FFB3D9';
    myWeightData.forEach((data, index) => {
        const x = padding + (width * index) / (myWeightData.length - 1 || 1);
        const weightNormalized = (data.weight - (minWeight - padding_weight)) / (range + 2 * padding_weight);
        const y = canvas.height - padding - (height * weightNormalized);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Desenhar dados do amigo (linha verde)
    if (friendWeightData.length > 0) {
        ctx.strokeStyle = '#52B788';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        friendWeightData.forEach((data, index) => {
            const x = padding + (width * index) / (friendWeightData.length - 1 || 1);
            const weightNormalized = (data.weight - (minWeight - padding_weight)) / (range + 2 * padding_weight);
            const y = canvas.height - padding - (height * weightNormalized);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Desenhar pontos do amigo
        ctx.fillStyle = '#52B788';
        friendWeightData.forEach((data, index) => {
            const x = padding + (width * index) / (friendWeightData.length - 1 || 1);
            const weightNormalized = (data.weight - (minWeight - padding_weight)) / (range + 2 * padding_weight);
            const y = canvas.height - padding - (height * weightNormalized);
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    // X-axis labels
    ctx.fillStyle = '#6B6B6B';
    ctx.textAlign = 'center';
    myWeightData.forEach((data, index) => {
        const x = padding + (width * index) / (myWeightData.length - 1 || 1);
        const y = canvas.height - padding + 25;
        ctx.fillText(data.label, x, y);
    });
    
    // Draw legend
    ctx.textAlign = 'left';
    ctx.font = 'bold 14px Arial';
    
    ctx.fillStyle = '#FFB3D9';
    ctx.fillRect(canvas.width - 200, 20, 15, 15);
    ctx.fillStyle = '#6B6B6B';
    ctx.fillText('Seu peso', canvas.width - 175, 32);
    
    if (friendWeightData.length > 0) {
        ctx.fillStyle = '#52B788';
        ctx.fillRect(canvas.width - 200, 45, 15, 15);
        ctx.fillStyle = '#6B6B6B';
        ctx.fillText('Peso do amigo', canvas.width - 175, 57);
    }
}

// ============ CONFETTI EFFECT ============
function createConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    const confetti = [];
    
    for (let i = 0; i < 50; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 8 + 5,
            h: Math.random() * 8 + 5,
            opacity: Math.random() * 0.5 + 0.5,
            vx: Math.random() * 4 - 2,
            vy: Math.random() * 4 + 2,
            color: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77'][Math.floor(Math.random() * 4)]
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.opacity -= 0.01;
            
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.restore();
            
            if (p.opacity <= 0) confetti.splice(i, 1);
        });
        
        if (confetti.length > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }
    
    animate();
}
