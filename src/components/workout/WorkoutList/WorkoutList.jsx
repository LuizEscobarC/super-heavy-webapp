import React from 'react';
import './WorkoutList.css';

const WorkoutList = ({ 
  workouts, 
  onDelete, 
  onEdit, 
  filterCategory, 
  onCategoryChange 
}) => {
  return (
    <section className="workout-list">
      <h2>Meus Treinos</h2>
      
      <div className="filter-controls">
        <label htmlFor="filter-category">Filtrar por categoria:</label>
        <select 
          id="filter-category"
          value={filterCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">Todas as categorias</option>
          <option value="Peito">Peito</option>
          <option value="Costas">Costas</option>
          <option value="Pernas">Pernas</option>
          <option value="Ombros">Ombros</option>
          <option value="Braços">Braços</option>
          <option value="Abdômen">Abdômen</option>
          <option value="Cardio">Cardio</option>
          <option value="Outro">Outro</option>
        </select>
      </div>
      
      <div className="workouts-container">
        {workouts.length === 0 ? (
          <p className="no-workouts">Nenhum treino encontrado.</p>
        ) : (
          workouts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((workout) => (
              <div className="workout-item" key={workout.id}>
                <div className="workout-header">
                  <div>
                    <h3>{workout.name}</h3>
                    {workout.category && <span className="workout-category">{workout.category}</span>}
                  </div>
                  <div className="workout-actions">
                    <span className="workout-date">{workout.date}</span>
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
                  {workout.exercises.map((exercise, index) => (
                    <div className="exercise-item" key={index}>
                      <strong>{exercise.name}</strong>
                      <div className="exercise-details">
                        <span>{exercise.weight}kg</span> | 
                        <span>{exercise.reps} repetições</span> | 
                        <span>{exercise.rest} segundos de descanso</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </section>
  );
};

export default WorkoutList;