import React, { useEffect, useState } from 'react';
import { useWorkout } from '../../../contexts/WorkoutContext';
import './WorkoutList.css';

const WorkoutList =  ({ 
  workouts, 
  onDelete, 
  onEdit,
  onStart,
  setWorkouts
}) => {
  const { getLastWorkoutData } = useWorkout();

  return (
    <section className="workout-list">
      <h2>Meus Treinos</h2>
      
      
      <div className="workouts-container">
        {workouts.length === 0 ? (
          <p className="no-workouts">Nenhum treino encontrado. Crie seu primeiro treino acima!</p>
        ) : (
          workouts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((workout) => {
              const lastWorkoutData = getLastWorkoutData(workout.id);
              
              return (
                <div className="workout-item" key={workout.id}>
                  <div className="workout-header">
                    <div className="workout-info">
                      <h3>{workout.name}</h3>
                      <span className="workout-date">Criado em: {workout.createdAt}</span>
                      {lastWorkoutData && (
                        <span className="last-performed">
                          Último treino: {new Date(lastWorkoutData.date).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                    <div className="workout-actions">
                      <button
                        className="start-btn"
                        onClick={() => onStart(workout.id)}
                      >
                        Iniciar Treino
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => onEdit(workout)}
                      >
                        Editar
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir este treino?')) {
                            onDelete(workout.id);
                          }
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

            
                  <div className="exercise-list">
                    {(workout.exercises || []).map((exercise, index) => (
                      <div className="exercise-item" key={index}>
                        <div className="exercise-header">
                          <strong>{exercise.exercise.muscle}</strong>
                          {exercise.exercise.name && <span className="muscle-tag">{exercise.exercise.mescle}</span>}
                        </div>
                        <div className="exercise-details">
                          <span>{exercise.series || 1} séries</span> | 
                          <span>{exercise.reps} repetições</span> | 
                          <span>{exercise.weight}kg</span> | 
                          <span>{exercise.rest}s descanso</span>
                        </div>
                        
                        {/* Show last workout data if available */}
                        {/* {lastWorkoutData && lastWorkoutData.exercises && (
                          <div className="last-workout-data">
                            {lastWorkoutData.exercises
                              .find(ex => ex.id === exercise.id)?.series
                              .map((series, i) => (
                                <span key={i} className="series-history">
                                  Série {i+1}: {series.actualWeight}kg × {series.actualReps} reps
                                </span>
                              ))
                            }
                          </div>
                        )} */}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </section>
  );
};

export default WorkoutList;