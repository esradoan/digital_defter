import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // localStorage'dan theme'i al, yoksa 'dark' kullan
        return localStorage.getItem('theme') || 'dark';
    });

    useEffect(() => {
        // Theme değiştiğinde localStorage'a kaydet ve body'ye class ekle
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Yeni tema değiştirme fonksiyonu (toggle yerine direkt set)
    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    // toggleTheme geriye dönük uyumluluk için, sadece dark/light arası gidip gelir (isteğe bağlı ama lila varken artık setTheme kullanılmalı)
    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: changeTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

