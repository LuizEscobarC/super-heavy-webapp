import React from 'react';
import { useWorkout } from '../../../contexts/WorkoutContext';
import './FloatingTimer.css';

const FloatingTimer = () => {
  const { timerActive, timeLeft, timerDuration, stopTimer, setTimeLeft } = useWorkout();
  
  if (!timerActive) {
    return null;
  }
  
  // Formatação do tempo para exibição
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Adiciona 15 segundos ao timer
  const addFifteenSeconds = () => {
    setTimeLeft(prev => prev + 15);
  };
  
  // Remove 15 segundos do timer
  const removeFifteenSeconds = () => {
    setTimeLeft(prev => Math.max(1, prev - 15));
  };
  
  const progressPercentage = Math.max(0, ((timerDuration - timeLeft) / timerDuration) * 100);
  
  return (
    <div className="floating-timer">
      <div className="timer-progress">
        <div 
          className="timer-progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="timer-content">
        <div className="timer-display">
          <span>Descanso: {formatTime(timeLeft)}</span>
        </div>
        
        <div className="timer-controls">
          <button className="remove-time-btn" onClick={removeFifteenSeconds} title="Remover 15 segundos">
            -15s
          </button>
          <button className="add-time-btn" onClick={addFifteenSeconds} title="Adicionar 15 segundos">
            +15s
          </button>
          <button className="skip-timer-btn" onClick={stopTimer} title="Pular descanso">
            Pular
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingTimer;
