import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
    return (
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle"
          aria-label={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      );
};

export default ThemeToggle;