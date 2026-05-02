// ============ THEMES DATA ============

const themesData = {
    female: [
        // Desbloqueados por padrão
        { id: 1, name: 'Sakura', primary: '#FFB3D9', secondary: '#FFE0F0', accent: '#FF69B4', bg: 'linear-gradient(135deg, #FFF5F8 0%, #FFE6F0 50%, #FFF0F8 100%)', button: '#FFB3D9', textColor: 'dark', workouts: 0, water: 0, locked: false },
        { id: 2, name: 'Lavanda', primary: '#D8B3FF', secondary: '#E8D0FF', accent: '#C699FF', bg: 'linear-gradient(135deg, #F5F0FF 0%, #E8D0FF 50%, #F8F5FF 100%)', button: '#D8B3FF', textColor: 'dark', workouts: 0, water: 0, locked: false },
        
        // Desbloqueáveis por treinos
        { id: 3, name: 'Flamingo', primary: '#FF9DBD', secondary: '#FFB3D9', accent: '#FF6B9D', bg: 'linear-gradient(135deg, #FFE8F0 0%, #FFD1E0 50%, #FFEBF5 100%)', button: '#FF7BA3', textColor: 'dark', workouts: 5, water: 0, locked: true },
        { id: 4, name: 'Doce', primary: '#FFD4E5', secondary: '#FFF0F6', accent: '#FFADD9', bg: 'linear-gradient(135deg, #FFF8FC 0%, #FFE8F0 50%, #FFFBFD 100%)', button: '#FFBCE0', textColor: 'dark', workouts: 10, water: 0, locked: true },
        { id: 5, name: 'Rosa Quartz', primary: '#F7BACF', secondary: '#FFC0D9', accent: '#F5A8C7', bg: 'linear-gradient(135deg, #FFEEF5 0%, #FFD9E8 50%, #FFF3F8 100%)', button: '#F7BACF', textColor: 'dark', workouts: 15, water: 0, locked: true },
        { id: 6, name: 'Macarons', primary: '#E8C5E5', secondary: '#F5D8FF', accent: '#D9A5D9', bg: 'linear-gradient(135deg, #F8F0FF 0%, #EFD9FF 50%, #FAF5FF 100%)', button: '#E8C5E5', textColor: 'dark', workouts: 20, water: 0, locked: true },
        { id: 7, name: 'Algodão Doce', primary: '#FFB3E6', secondary: '#FFCCF2', accent: '#FF7FD4', bg: 'linear-gradient(135deg, #FFF0FA 0%, #FFE0F0 50%, #FFF5FB 100%)', button: '#FF99DD', textColor: 'dark', workouts: 25, water: 0, locked: true },
        { id: 8, name: 'Aurora', primary: '#FFD9B3', secondary: '#FFECCC', accent: '#FFCC99', bg: 'linear-gradient(135deg, #FFFAF0 0%, #FFE8D1 50%, #FFFDFA 100%)', button: '#FFCC99', textColor: 'dark', workouts: 30, water: 0, locked: true },
        
        // Desbloqueáveis por água
        { id: 9, name: 'Céu Pastel', primary: '#B3E5FC', secondary: '#D1F0FF', accent: '#81D4FA', bg: 'linear-gradient(135deg, #E0F7FF 0%, #D1F0FF 50%, #E8FAFF 100%)', button: '#B3E5FC', textColor: 'dark', workouts: 0, water: 5, locked: true },
        { id: 10, name: 'Oceano Doce', primary: '#B3D9FF', secondary: '#D1E7FF', accent: '#81C6FF', bg: 'linear-gradient(135deg, #E0EEFF 0%, #D1E7FF 50%, #E8F2FF 100%)', button: '#B3D9FF', textColor: 'dark', workouts: 0, water: 10, locked: true },
        { id: 11, name: 'Menta', primary: '#B3E5D0', secondary: '#CCEFF5', accent: '#81D9C1', bg: 'linear-gradient(135deg, #E0F7F0 0%, #CCEFF5 50%, #E8FBFA 100%)', button: '#99E0C1', textColor: 'dark', workouts: 0, water: 15, locked: true },
        { id: 12, name: 'Água Fresca', primary: '#7FE5D0', secondary: '#A3F0E5', accent: '#52D9C1', bg: 'linear-gradient(135deg, #D1F7F0 0%, #B3F0E5 50%, #D9FBF8 100%)', button: '#7FE5D0', textColor: 'dark', workouts: 0, water: 20, locked: true },
        { id: 13, name: 'Gelado', primary: '#A8D8D8', secondary: '#C5E5E5', accent: '#81C8C8', bg: 'linear-gradient(135deg, #E0F2F2 0%, #C5E5E5 50%, #E8F8F8 100%)', button: '#99CDCD', textColor: 'dark', workouts: 0, water: 25, locked: true },
        { id: 14, name: 'Turquesa', primary: '#7FD8D8', secondary: '#A8E5E5', accent: '#5FBFBF', bg: 'linear-gradient(135deg, #D1EDED 0%, #A8E5E5 50%, #D9F5F5 100%)', button: '#6DCFD0', textColor: 'dark', workouts: 0, water: 30, locked: true },
        
        // Combinadas (treinos + água)
        { id: 15, name: 'Princesa', primary: '#FFB3D9', secondary: '#B3E5FC', accent: '#FF69B4', bg: 'linear-gradient(135deg, #FFF5F8 0%, #E8F7FF 50%, #FFF8FA 100%)', button: '#FFB3D9', textColor: 'dark', workouts: 10, water: 10, locked: true },
        { id: 16, name: 'Harmonia', primary: '#C8E6C9', secondary: '#FFB3D9', accent: '#A3D8A3', bg: 'linear-gradient(135deg, #E8F5E9 0%, #FFF5F8 50%, #F0FBF1 100%)', button: '#B3E0B3', textColor: 'dark', workouts: 15, water: 15, locked: true },
        { id: 17, name: 'Equilíbrio', primary: '#FFECB3', secondary: '#B3E5FC', accent: '#FFD966', bg: 'linear-gradient(135deg, #FFFAF0 0%, #E8F7FF 50%, #FFFCF5 100%)', button: '#FFE066', textColor: 'dark', workouts: 20, water: 20, locked: true },
        { id: 18, name: 'Flor de Cerejeira', primary: '#FFB3D9', secondary: '#D8B3FF', accent: '#FF7FD1', bg: 'linear-gradient(135deg, #FFF5F8 0%, #F0E8FF 50%, #FFF8FA 100%)', button: '#FFB3D9', textColor: 'dark', workouts: 25, water: 25, locked: true },
        { id: 19, name: 'Pôr do Sol', primary: '#FFD9B3', secondary: '#FFB3D9', accent: '#FFC266', bg: 'linear-gradient(135deg, #FFFAF0 0%, #FFF5F8 50%, #FFFCF5 100%)', button: '#FFCC99', textColor: 'dark', workouts: 30, water: 30, locked: true },
        { id: 20, name: 'Arco-Íris Pastel', primary: '#FFB3D9', secondary: '#B3E5FC', accent: '#D8B3FF', bg: 'linear-gradient(135deg, #FFF5F8 0%, #E8F7FF 50%, #F0E8FF 100%)', button: '#FFB3D9', textColor: 'dark', workouts: 40, water: 40, locked: true },
        { id: 21, name: 'Diamante Rosa', primary: '#FFB3D9', secondary: '#E8D0FF', accent: '#FFB3D9', bg: 'linear-gradient(135deg, #FFF5F8 0%, #F0E8FF 50%, #FFF8FA 100%)', button: '#FF99CC', textColor: 'dark', workouts: 50, water: 50, locked: true },
        { id: 22, name: 'Ouro Rosado', primary: '#FFD9B3', secondary: '#FFB3D9', accent: '#FFCC99', bg: 'linear-gradient(135deg, #FFFAF0 0%, #FFF5F8 50%, #FFFCF5 100%)', button: '#FFCC99', textColor: 'dark', workouts: 60, water: 60, locked: true },
        { id: 23, name: 'Cristal', primary: '#D1F0FF', secondary: '#E8D0FF', accent: '#A3E0FF', bg: 'linear-gradient(135deg, #E8FAFF 0%, #F0E8FF 50%, #F5FBFF 100%)', button: '#B3E5FC', textColor: 'dark', workouts: 70, water: 70, locked: true },
        { id: 24, name: 'Encantado', primary: '#FFB3D9', secondary: '#D8B3FF', accent: '#FF99CC', bg: 'linear-gradient(135deg, #FFF5F8 0%, #F0E8FF 50%, #FFF8FA 100%)', button: '#FFB3D9', textColor: 'dark', workouts: 80, water: 80, locked: true },
        { id: 25, name: 'Magia Rosa', primary: '#E8B3FF', secondary: '#FFB3D9', accent: '#D999FF', bg: 'linear-gradient(135deg, #F5E8FF 0%, #FFF5F8 50%, #F8F0FF 100%)', button: '#E8B3FF', textColor: 'dark', workouts: 90, water: 90, locked: true },
        { id: 26, name: 'Suprema', primary: '#FFB3D9', secondary: '#B3E5FC', accent: '#FF69B4', bg: 'linear-gradient(135deg, #FFF5F8 0%, #E8F7FF 50%, #FFF8FA 100%)', button: '#FFB3D9', textColor: 'dark', workouts: 100, water: 100, locked: true },
        { id: 27, name: 'Radiante', primary: '#FFD9B3', secondary: '#D8B3FF', accent: '#FFCC99', bg: 'linear-gradient(135deg, #FFFAF0 0%, #F0E8FF 50%, #FFFCF5 100%)', button: '#FFCC99', textColor: 'dark', workouts: 110, water: 110, locked: true },
        { id: 28, name: 'Perfeição', primary: '#FFB3D9', secondary: '#C8E6C9', accent: '#FF99CC', bg: 'linear-gradient(135deg, #FFF5F8 0%, #E8F5E9 50%, #FFF8FA 100%)', button: '#FFB3D9', textColor: 'dark', workouts: 120, water: 120, locked: true },
        { id: 29, name: 'Lendária', primary: '#E8D0FF', secondary: '#FFB3D9', accent: '#D9B3FF', bg: 'linear-gradient(135deg, #F0E8FF 0%, #FFF5F8 50%, #F8F0FF 100%)', button: '#E8D0FF', textColor: 'dark', workouts: 130, water: 130, locked: true },
        { id: 30, name: 'Imortal', primary: '#FFB3D9', secondary: '#B3E5FC', accent: '#FF69B4', bg: 'linear-gradient(135deg, #FFF5F8 0%, #E8F7FF 50%, #FFF8FA 100%)', button: '#FFB3D9', textColor: 'dark', workouts: 150, water: 150, locked: true },
    ],
    male: [
        // Desbloqueados por padrão
        { id: 101, name: 'Ocean', primary: '#B3E5FC', secondary: '#81D4FA', accent: '#4FC3F7', bg: 'linear-gradient(135deg, #E0F7FF 0%, #B3E5FC 50%, #E8FBFF 100%)', button: '#81D4FA', textColor: 'dark', workouts: 0, water: 0, locked: false },
        { id: 102, name: 'Mountain', primary: '#B3D9FF', secondary: '#90CAF9', accent: '#7FB3E5', bg: 'linear-gradient(135deg, #E0EEFF 0%, #B3D9FF 50%, #E8F2FF 100%)', button: '#90CAF9', textColor: 'dark', workouts: 0, water: 0, locked: false },
        
        // Desbloqueáveis por treinos
        { id: 103, name: 'Thunder', primary: '#FFD9B3', secondary: '#FFCA81', accent: '#FFC266', bg: 'linear-gradient(135deg, #FFFAF0 0%, #FFE8CC 50%, #FFFDFB 100%)', button: '#FFCC99', textColor: 'dark', workouts: 5, water: 0, locked: true },
        { id: 104, name: 'Midnight', primary: '#C8D8FF', secondary: '#A3B8FF', accent: '#90A8FF', bg: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)', button: '#A3B8FF', textColor: 'light', workouts: 10, water: 0, locked: true },
        { id: 105, name: 'Fuego', primary: '#FFB3B3', secondary: '#FF9D9D', accent: '#FF8A8A', bg: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FF4500 100%)', button: '#FF6B6B', textColor: 'light', workouts: 15, water: 0, locked: true },
        { id: 106, name: 'Gelo', primary: '#B3E5FF', secondary: '#81D4FF', accent: '#4FC3FF', bg: 'linear-gradient(135deg, #E0F7FF 0%, #B3E5FF 50%, #E8FBFF 100%)', button: '#81D4FF', textColor: 'dark', workouts: 20, water: 0, locked: true },
        { id: 107, name: 'Ninja', primary: '#D8D8FF', secondary: '#B3B3FF', accent: '#9999FF', bg: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D5F 50%, #3D3D7F 100%)', button: '#B3B3FF', textColor: 'light', workouts: 25, water: 0, locked: true },
        { id: 108, name: 'Aventura', primary: '#C8E6C9', secondary: '#A8D8A8', accent: '#99D4A3', bg: 'linear-gradient(135deg, #E8F5E9 0%, #D1F0D9 50%, #F0FBF1 100%)', button: '#B3E0B3', textColor: 'dark', workouts: 30, water: 0, locked: true },
        
        // Desbloqueáveis por água
        { id: 109, name: 'Azul Céu', primary: '#B3E5FC', secondary: '#81D4FA', accent: '#4FC3F7', bg: 'linear-gradient(135deg, #E0F7FF 0%, #B3E5FC 50%, #E8FBFF 100%)', button: '#81D4FA', textColor: 'dark', workouts: 0, water: 5, locked: true },
        { id: 110, name: 'Água Pura', primary: '#B3E5FF', secondary: '#6FC1FF', accent: '#4DA6FF', bg: 'linear-gradient(135deg, #E0F5FF 0%, #B3E5FF 50%, #E8F9FF 100%)', button: '#81D4FF', textColor: 'dark', workouts: 0, water: 10, locked: true },
        { id: 111, name: 'Profundo', primary: '#7FBFFF', secondary: '#5B9AFF', accent: '#4A7AFF', bg: 'linear-gradient(135deg, #003366 0%, #004C99 50%, #0066CC 100%)', button: '#6BA3FF', textColor: 'light', workouts: 0, water: 15, locked: true },
        { id: 112, name: 'Cristalino', primary: '#6FC1FF', secondary: '#5B9AFF', accent: '#4A85FF', bg: 'linear-gradient(135deg, #0047AB 0%, #0063CC 50%, #0099FF 100%)', button: '#5BA8FF', textColor: 'light', workouts: 0, water: 20, locked: true },
        { id: 113, name: 'Neon Azul', primary: '#00E5FF', secondary: '#00D4FF', accent: '#00C8FF', bg: 'linear-gradient(135deg, #001A4D 0%, #003366 50%, #004D99 100%)', button: '#00D4FF', textColor: 'light', workouts: 0, water: 25, locked: true },
        { id: 114, name: 'Elétrico', primary: '#00E5FF', secondary: '#00BCD4', accent: '#00B4CC', bg: 'linear-gradient(135deg, #000033 0%, #001F4D 50%, #003366 100%)', button: '#00D4FF', textColor: 'light', workouts: 0, water: 30, locked: true },
        
        // Combinadas (treinos + água)
        { id: 115, name: 'Guerreiro', primary: '#B3E5FC', secondary: '#FFD9B3', accent: '#81D4FA', bg: 'linear-gradient(135deg, #1A1A2E 0%, #FFE8CC 50%, #0F3460 100%)', button: '#81D4FA', textColor: 'light', workouts: 10, water: 10, locked: true },
        { id: 116, name: 'Tempestade', primary: '#FFD9B3', secondary: '#B3E5FF', accent: '#FFC266', bg: 'linear-gradient(135deg, #2C2C54 0%, #FFE8CC 50%, #0F3460 100%)', button: '#FFCC99', textColor: 'light', workouts: 15, water: 15, locked: true },
        { id: 117, name: 'Perfeito', primary: '#B3E5FC', secondary: '#D8B3FF', accent: '#81D4FA', bg: 'linear-gradient(135deg, #E0F7FF 0%, #F0E8FF 50%, #E8FBFF 100%)', button: '#B3E5FC', textColor: 'dark', workouts: 20, water: 20, locked: true },
        { id: 118, name: 'Épico', primary: '#FFD9B3', secondary: '#B3E5FC', accent: '#FFCC99', bg: 'linear-gradient(135deg, #4D2600 0%, #E0F7FF 50%, #FFB84D 100%)', button: '#FFCC99', textColor: 'dark', workouts: 25, water: 25, locked: true },
        { id: 119, name: 'Dragão', primary: '#FFB3B3', secondary: '#B3E5FC', accent: '#FF9999', bg: 'linear-gradient(135deg, #3D0000 0%, #E0F7FF 50%, #660000 100%)', button: '#FF9999', textColor: 'light', workouts: 30, water: 30, locked: true },
        { id: 120, name: 'Luta', primary: '#FFD9B3', secondary: '#B3E5FF', accent: '#FFCC99', bg: 'linear-gradient(135deg, #4D2600 0%, #E0F5FF 50%, #FFB84D 100%)', button: '#FFCC99', textColor: 'dark', workouts: 40, water: 40, locked: true },
        { id: 121, name: 'Campeão', primary: '#C8E6C9', secondary: '#FFD9B3', accent: '#B3E0B3', bg: 'linear-gradient(135deg, #1A3A1A 0%, #FFE8CC 50%, #2D5A2D 100%)', button: '#B3E0B3', textColor: 'light', workouts: 50, water: 50, locked: true },
        { id: 122, name: 'Invicto', primary: '#FFB3B3', secondary: '#B3E5FC', accent: '#FF9999', bg: 'linear-gradient(135deg, #4D0000 0%, #E0F7FF 50%, #8B0000 100%)', button: '#FF9999', textColor: 'light', workouts: 60, water: 60, locked: true },
        { id: 123, name: 'Titã', primary: '#D8B3FF', secondary: '#FFD9B3', accent: '#C999FF', bg: 'linear-gradient(135deg, #2D1B4E 0%, #FFE8CC 50%, #4D2B7F 100%)', button: '#D8B3FF', textColor: 'light', workouts: 70, water: 70, locked: true },
        { id: 124, name: 'Fenômeno', primary: '#B3E5FC', secondary: '#C8E6C9', accent: '#81D4FA', bg: 'linear-gradient(135deg, #E0F7FF 0%, #E8F5E9 50%, #E8FBFF 100%)', button: '#B3E5FC', textColor: 'dark', workouts: 80, water: 80, locked: true },
        { id: 125, name: 'Relâmpago', primary: '#FFD9B3', secondary: '#B3E5FF', accent: '#FFCC99', bg: 'linear-gradient(135deg, #4D3300 0%, #E0F5FF 50%, #FF9900 100%)', button: '#FFCC99', textColor: 'dark', workouts: 90, water: 90, locked: true },
        { id: 126, name: 'Supremo', primary: '#B3E5FC', secondary: '#FFB3B3', accent: '#4FC3F7', bg: 'linear-gradient(135deg, #E0F7FF 0%, #3D0000 50%, #E8FBFF 100%)', button: '#81D4FA', textColor: 'dark', workouts: 100, water: 100, locked: true },
        { id: 127, name: 'Divino', primary: '#D8B3FF', secondary: '#B3E5FC', accent: '#C999FF', bg: 'linear-gradient(135deg, #2D1B4E 0%, #E0F7FF 50%, #4D2B7F 100%)', button: '#D8B3FF', textColor: 'light', workouts: 110, water: 110, locked: true },
        { id: 128, name: 'Imortal', primary: '#FFD9B3', secondary: '#D8B3FF', accent: '#FFCC99', bg: 'linear-gradient(135deg, #4D3300 0%, #2D1B4E 50%, #FF9900 100%)', button: '#FFCC99', textColor: 'dark', workouts: 120, water: 120, locked: true },
        { id: 129, name: 'Infinito', primary: '#B3E5FC', secondary: '#C8E6C9', accent: '#81D4FA', bg: 'linear-gradient(135deg, #E0F7FF 0%, #E8F5E9 50%, #E8FBFF 100%)', button: '#B3E5FC', textColor: 'dark', workouts: 130, water: 130, locked: true },
        { id: 130, name: 'Absoluto', primary: '#D8B3FF', secondary: '#FFD9B3', accent: '#C999FF', bg: 'linear-gradient(135deg, #2D1B4E 0%, #FFE8CC 50%, #4D2B7F 100%)', button: '#D8B3FF', textColor: 'light', workouts: 150, water: 150, locked: true },
    ]
};
