import React, { useState } from 'react';
import { useWorkout } from '../../../contexts/WorkoutContext';
import './WorkoutExecution.css';


const WorkoutExecution = ({ onFinish }) => {
  const { activeWorkout, completeExerciseSeries, finishWorkout } = useWorkout();

  
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
            key={exercise._id}
            exercise={exercise}
            onCompleteSeries={handleCompleteSeries}
          />
        ))}
      </div>
    </section>
  );
};

// Componente para cada exercício
const ExerciseExecution = ({ exercise, onCompleteSeries }) => {
  const { activeWorkout, updateActiveWorkout, removeExerciseSeries, updateExercise } = useWorkout();
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
            {exercise.series.map((serie, serieIndex) => (
              <SeriesExecution 
                key={serie._id} 
                exercise={exercise}
                serie={serie}
                serieIndex={serieIndex}
                onCompleteSeries={onCompleteSeries}
                onRemove={() => removeExerciseSeries(exercise.id)}
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

const SeriesExecution = ({ exercise, serie, serieIndex, onCompleteSeries, onRemove, canRemove }) => {
  const { startTimer, currentExerciseInfo } = useWorkout();
  const seriesData = exercise.series.find((s) => s._id === serie._id);
  const isCompleted = seriesData?.completed;
  
  const [editedData, setEditedData] = useState({
    weight: seriesData.weight,
    reps: seriesData.reps
  });
  
  const isCurrentTimer = currentExerciseInfo &&
                         currentExerciseInfo.exerciseId === exercise.id &&
                         currentExerciseInfo.serieId === serie._id;
  
  const handleCompleteSeries = (e) => {
    const isChecked = e.target.checked;
    
    onCompleteSeries(exercise, serie._id, {
      ...editedData,
      completed: isChecked
    });
    
    if (isChecked) {
      if (!exercise.rest) {
        startTimer(exercise.id, serie._id, parseInt(exercise.rest) || 60);
      }
    }
  };
  
  return (
    <div className={`series-item ${isCompleted ? 'completed' : ''} ${isCurrentTimer ? 'current-timer' : ''}`}>
      <div className="series-row">
        <div className="series-info">
          <div className="series-header">
            <span className="series-number">Série {serieIndex + 1}</span>
            
            {isCompleted && (
              <span className="series-result">
                {seriesData.weight}kg × {seriesData.reps} reps
              </span>
            )}
          </div>
        </div>
        
        <div className="form-row series-inputs">
          <div className="form-group">
            <label htmlFor={`weight-${exercise.id}-${serie._id}`}>Peso (kg):</label>
            <input 
              type="number" 
              value={editedData.weight}
              onChange={(e) => setEditedData({...editedData, actualWeight: e.target.value})}
              step="0.5"
              placeholder="Peso (kg)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`reps-${exercise.id}-${serie._id}`}>Repetições:</label>
            <input 
              type="number" 
              value={editedData.reps}
              onChange={(e) => setEditedData({...editedData, actualReps: e.target.value})}
              placeholder="Repetições"
            />
          </div>
          
          <div className="series-actions">
            <div className="series-checkbox">
              <input 
                type="checkbox" 
                id={`series-${exercise.id}-${serie._id}`}
                checked={isCompleted}
                onChange={handleCompleteSeries}
              />
              <label htmlFor={`series-${exercise.id}-${serie._id}`}>{isCompleted ? "Concluída" : "Concluir"}</label>
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
