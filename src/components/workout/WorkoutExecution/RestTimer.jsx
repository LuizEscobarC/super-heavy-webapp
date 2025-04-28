import React, { useState, useEffect } from 'react';
import './RestTimer.css';

const RestTimer = ({ duration, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);
  
  useEffect(() => {
    let timer;
    
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }
    
    return () => clearTimeout(timer);
  }, [timeLeft, isRunning, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(true);
  };

  const calculateProgress = () => {
    return ((duration - timeLeft) / duration) * 100;
  };

  return (
    <div className="rest-timer">
      <div className="timer-container">
        <h3>Tempo de Descanso</h3>
        <div className="timer-progress">
          <div 
            className="timer-progress-bar" 
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <div className="timer-display">{formatTime(timeLeft)}</div>
        
        <div className="timer-controls">
          <button 
            className={isRunning ? "pause-btn" : "play-btn"}
            onClick={toggleTimer}
          >
            {isRunning ? "Pausar" : "Continuar"}
          </button>
          <button className="reset-btn" onClick={resetTimer}>
            Reiniciar
          </button>
          <button className="skip-btn" onClick={onComplete}>
            Pular Descanso
          </button>
        </div>
      </div>
      
      <button className="cancel-btn" onClick={onCancel}>
        Fechar
      </button>
    </div>
  );
};

export default RestTimer;
