import { useState, useEffect } from 'react';

const useTheme = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedPreference = localStorage.getItem('darkMode');
        const perfersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedPreference !== null ? savedPreference === 'true' : perfersDarkMode;
    });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode])

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return {
        darkMode,
        toggleDarkMode
    };
};

export default useTheme;