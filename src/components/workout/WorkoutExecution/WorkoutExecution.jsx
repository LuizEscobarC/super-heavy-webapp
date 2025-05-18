import React, { useState } from 'react';
import { useWorkout } from '../../../contexts/WorkoutContext';
import './WorkoutExecution.css';


const WorkoutExecution = ({ onFinish }) => {
  const { activeWorkout, completeExerciseSeries, finishWorkout, updateExercise } = useWorkout();

  console.log('activeWorkout', activeWorkout);
  
  if (!activeWorkout) {
    return <div>Nenhum treino ativo</div>;
  }

  const handleCompleteSeries = (exercise, seriesIndex, data) => {
    completeExerciseSeries(exercise.id, seriesIndex, data);
  };

  const handleFinishWorkout = () => {
    const allCompleted = activeWorkout.exercises.every(exercise => 
      exercise.actualSeries.every(series => series.completed)
    );
    
    if (!allCompleted && !window.confirm('Alguns exercícios não foram marcados como concluídos. Deseja finalizar o treino mesmo assim?')) {
      return;
    }
    
    if (finishWorkout()) {
      onFinish();
    }
  };

  return (
    <section className="workout-execution">
      <div className="execution-header">
        <h2>{activeWorkout.name}</h2>
        <button className="finish-btn" onClick={handleFinishWorkout}>
          Finalizar Treino
        </button>
      </div>
      
      <div className="exercise-progress">
        {activeWorkout.exercises.map((exercise) => (
          <ExerciseExecution 
            key={exercise.id}
            exercise={exercise}
            onCompleteSeries={handleCompleteSeries}
            updateExercise={updateExercise}
          />
        ))}
      </div>
    </section>
  );
};

// Componente para cada exercício
const ExerciseExecution = ({ exercise, onCompleteSeries, updateExercise }) => {
  const { activeWorkout, updateActiveWorkout, removeExerciseSeries } = useWorkout();
  const [isExpanded, setIsExpanded] = useState(true);
  const isCompleted = exercise.completed;
  
  const addSeries = async () => {
    const updatedExercisesPromises = await activeWorkout.exercises.map(async (ex) => {
      if (ex.id === exercise.id) {
        const newSeriesCount = (ex.series || 1) + 1;        
        const updatedSeries = [
          ...(ex.actualSeries || []),
          {
            completed: false,
            actualWeight: ex.weight,
            actualReps: ex.reps
          }
        ];

        await updateExercise(activeWorkout.id, ex.id, {
          ...ex,
          series: newSeriesCount,
        });
    
        return {
          ...ex,
          series: newSeriesCount,
          actualSeries: updatedSeries
        };
      }
      return ex;
    });
    
    const updatedExercises = await Promise.all(updatedExercisesPromises);
    // Atualiza o workout ativo
    updateActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };
  
  return (
    <div className={`execution-exercise ${isCompleted ? 'completed' : ''}`}>
      <div 
        className="exercise-header clickable"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="exercise-title">
          <h3>{exercise.exercise.name}</h3>
          {exercise.exercise.muscle && <span className="muscle-tag">{exercise.exercise.muscle}</span>}
        </div>
        <div className="exercise-meta">
          <span>{exercise.reps} repetições</span>
          <span>{exercise.weight}kg</span> 
          <span>{exercise.rest}s descanso</span>
          <span className="expand-icon">{isExpanded ? '▼' : '►'}</span>
        </div>
      </div>
      
      {isExpanded && (
        <>
          <div className="series-container">
            {Array.from({ length: exercise.series || 1 }).map((_, index) => (
              <SeriesExecution 
                key={index} 
                exercise={exercise}
                seriesIndex={index}
                onCompleteSeries={onCompleteSeries}
                onRemove={() => removeExerciseSeries(exercise.id, index)}
                canRemove={(exercise.series || 1) > 1}
              />
            ))}
          </div>
          
          <div className="add-series-container">
            <button className="add-series-btn" onClick={addSeries}>
              + Adicionar Série
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Componente para cada série de um exercício
const SeriesExecution = ({ exercise, seriesIndex, onCompleteSeries, onRemove, canRemove }) => {
  const { startTimer, currentExerciseInfo } = useWorkout();
  const seriesData = exercise.actualSeries[seriesIndex];
  console.log('seriesData', seriesData);
  const isCompleted = seriesData?.completed;
  
  const [editedData, setEditedData] = useState({
    actualWeight: seriesData?.actualWeight || exercise.weight,
    actualReps: seriesData?.actualReps || exercise.reps
  });
  
  // Verificar se esta série está associada ao timer atual
  const isCurrentTimer = currentExerciseInfo &&
                         currentExerciseInfo.exerciseId === exercise.id &&
                         currentExerciseInfo.seriesIndex === seriesIndex;
  
  // Marcar/desmarcar série como completa
  const handleCompleteSeries = (e) => {
    const isChecked = e.target.checked;
    
    // Atualiza os dados com base no estado do checkbox
    onCompleteSeries(exercise, seriesIndex, {
      ...editedData,
      completed: isChecked
    });
    
    // Se estiver marcando como concluído, inicia o timer de descanso
    if (isChecked) {
      startTimer(exercise.id, seriesIndex, parseInt(exercise.rest) || 60);
    }
  };
  
  return (
    <div className={`series-item ${isCompleted ? 'completed' : ''} ${isCurrentTimer ? 'current-timer' : ''}`}>
      <div className="series-row">
        <div className="series-info">
          <div className="series-header">
            <span className="series-number">Série {seriesIndex + 1}</span>
            
            {isCompleted && (
              <span className="series-result">
                {seriesData.actualWeight}kg × {seriesData.actualReps} reps
              </span>
            )}
          </div>
        </div>
        
        <div className="form-row series-inputs">
          <div className="form-group">
            <label htmlFor={`weight-${exercise.id}-${seriesIndex}`}>Peso (kg):</label>
            <input 
              type="number" 
              value={editedData.actualWeight}
              onChange={(e) => setEditedData({...editedData, actualWeight: e.target.value})}
              step="0.5"
              placeholder="Peso (kg)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`reps-${exercise.id}-${seriesIndex}`}>Repetições:</label>
            <input 
              type="number" 
              value={editedData.actualReps}
              onChange={(e) => setEditedData({...editedData, actualReps: e.target.value})}
              placeholder="Repetições"
            />
          </div>
          
          <div className="series-actions">
            <div className="series-checkbox">
              <input 
                type="checkbox" 
                id={`series-${exercise.id}-${seriesIndex}`}
                checked={isCompleted}
                onChange={handleCompleteSeries}
              />
              <label htmlFor={`series-${exercise.id}-${seriesIndex}`}>{isCompleted ? "Concluída" : "Concluir"}</label>
            </div>
            
            {canRemove && (
              <button 
                className="remove-series-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Deseja remover esta série?')) {
                    onRemove();
                  }
                }}
                title="Remover série"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutExecution;
