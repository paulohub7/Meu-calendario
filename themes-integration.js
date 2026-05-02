// ============ THEMES INTEGRATION ============

function switchGender(gender) {
    currentGender = gender;
    document.querySelectorAll('.theme-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    renderThemes();
}

function renderThemes() {
    const container = document.getElementById('themesContainer');
    if (!container) return;
    
    const themes = themesData[currentGender];
    if (!themes) return;
    
    // Calcular progresso do usuário
    // Contar treinos reais (array de datas)
    const workoutsDaysKey = `workouts_${currentUser.id}`;
    const workoutsDays = localStorage.getItem(workoutsDaysKey);
    const totalWorkouts = workoutsDays ? JSON.parse(workoutsDays).length : 0;
    
    // Converter água para litros
    const totalWater = waterRecords.reduce((sum, record) => sum + record.amount, 0) / 1000;
    
    // Atualizar barra de info
    const workoutEl = document.getElementById('themeWorkouts');
    const waterEl = document.getElementById('themeWater');
    if (workoutEl) workoutEl.textContent = totalWorkouts;
    if (waterEl) waterEl.textContent = Math.round(totalWater);
    
    container.innerHTML = themes.map(theme => {
        // Verificar se está desbloqueado
        // Se locked === false, sempre desbloqueado
        // Se locked === true, desbloquear apenas se o progresso atender aos requisitos
        const isUnlocked = !theme.locked || 
            (totalWorkouts >= theme.workouts && totalWater >= theme.water);
        
        const isActive = activeTheme === String(theme.id);
        
        let unlockReq = '';
        if (!isUnlocked) {
            if (theme.workouts > 0 && theme.water === 0) {
                unlockReq = `${theme.workouts} treinos`;
            } else if (theme.water > 0 && theme.workouts === 0) {
                unlockReq = `${theme.water}L água`;
            } else if (theme.workouts > 0 && theme.water > 0) {
                unlockReq = `${theme.workouts} treinos + ${theme.water}L`;
            }
        }
        
        return `
            <div class="theme-card ${isUnlocked ? '' : 'theme-locked'} ${isActive ? 'theme-active' : ''}" 
                 onclick="${isUnlocked ? `applyTheme(${theme.id}, '${theme.primary}', '${theme.secondary}', '${theme.accent}', '${theme.bg}', '${theme.button}', '${theme.textColor}')` : ''}">
                <div class="theme-preview" style="background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary})">
                    ${isUnlocked ? '<div class="theme-check">✓</div>' : '<div class="theme-locked-icon">🔒</div>'}
                </div>
                <div class="theme-info">
                    <div class="theme-name">${theme.name}</div>
                    <div class="theme-unlock-status">${isUnlocked ? '✓ Desbloqueado' : '🔒 Bloqueado'}</div>
                    ${unlockReq ? `<div class="theme-unlock-req">${unlockReq}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function applyTheme(themeId, primaryColor, secondaryColor, accentColor, bgGradient, buttonColor, textColorMode) {
    activeTheme = String(themeId);
    localStorage.setItem('activeTheme', activeTheme);
    
    // Determinar cores de texto baseado no modo
    let textColor = '#6B6B6B'; // padrão escuro
    let textSecondary = '#999999'; // padrão cinza
    
    if (textColorMode === 'light') {
        textColor = '#FFFFFF';
        textSecondary = '#E8E8E8';
    }
    
    // Aplicar cores ao documento
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--theme-bg', bgGradient);
    document.documentElement.style.setProperty('--theme-button', buttonColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--text-secondary', textSecondary);
    
    // Atualizar background do body
    document.body.style.background = bgGradient;
    
    // Renderizar novamente para mostrar check
    renderThemes();
}

function loadActiveTheme() {
    const themeId = localStorage.getItem('activeTheme') || '1';
    if (typeof themesData !== 'undefined') {
        const allThemes = [...themesData.female, ...themesData.male];
        const theme = allThemes.find(t => t.id === parseInt(themeId));
        
        if (theme) {
            // Determinar cores de texto baseado no modo
            let textColor = '#6B6B6B';
            let textSecondary = '#999999';
            
            if (theme.textColor === 'light') {
                textColor = '#FFFFFF';
                textSecondary = '#E8E8E8';
            }
            
            document.documentElement.style.setProperty('--primary', theme.primary);
            document.documentElement.style.setProperty('--secondary', theme.secondary);
            document.documentElement.style.setProperty('--accent', theme.accent);
            document.documentElement.style.setProperty('--theme-bg', theme.bg);
            document.documentElement.style.setProperty('--theme-button', theme.button);
            document.documentElement.style.setProperty('--text-color', textColor);
            document.documentElement.style.setProperty('--text-secondary', textSecondary);
            
            // Atualizar background do body
            document.body.style.background = theme.bg;
        }
    }
}
