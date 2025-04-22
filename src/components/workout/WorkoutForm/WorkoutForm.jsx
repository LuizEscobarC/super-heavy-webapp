import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './WorkoutForm.css';

const WorkoutForm = ({ addWorkout, updateWorkout, workoutToEdit, setWorkoutToEdit }) => {
    const [workoutName, setWorkoutName] = useState('');
    const [workoutCategory, setWorkoutCategory] = useState('');
    const [exercises, setExercises] = useState([{
        id: uuidv4(),
        name: '',
        weight: '',
        reps: '',
        rest: ''
    }]);

    useEffect(() => {
        if (workoutToEdit) {
            setWorkoutName(workoutToEdit.name);
            setWorkoutCategory(workoutToEdit.category || '');
            setExercises(workoutToEdit.exercises);
        }
    }, [workoutToEdit]);

    const addExerciseField = () => {
        const newExercise = {
            id: uuidv4(),
            name: '',
            weight: '',
            reps: '',
            rest: ''
        };
    
        setExercises([...exercises, newExercise]);
    };

    const removeExercise = (id) => {
        setExercises(exercises.filter(exercise => exercise.id !== id))
    };

    const updateExercise = (id, field, value) => {
        setExercises(exercises.map(exercise => 
            exercise.id === id ? {...exercise, [field]: value} : exercise
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (workoutToEdit) {
            updateWorkout({
                ...workoutToEdit,
                name: workoutName,
                category: workoutCategory,
                exercises: exercises
            });
            setWorkoutToEdit(null);
        } else {
            const newWorkout = {
                id: uuidv4(),
                name: workoutName,
                category: workoutCategory,
                date: new Date().toLocaleDateString('pt-BR'),
                exercises: exercises
            };

            addWorkout(newWorkout);
        }

        setWorkoutName('');
        setWorkoutCategory('');
        setExercises([{
          id: uuidv4(),
          name: '',
          weight: '',
          reps: '',
          rest: ''
        }]);
    };

    return (
        <section className="workout-form">
          <h2>{workoutToEdit ? 'Editar Treino' : 'Registrar Treino'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="workout-name">Nome do Treino:</label>
              <input
                type="text"
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                required
              />
            </div>
    
            <div className="form-group">
              <label htmlFor="workout-category">Categoria:</label>
              <select
                id="workout-category"
                value={workoutCategory}
                onChange={(e) => setWorkoutCategory(e.target.value)}
                required
              >
                <option value="">Selecione uma categoria</option>
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
    
            <div className="exercise-container">
              <h3>Exercícios</h3>
              {exercises.map((exercise) => (
                <div className="exercise-entry" key={exercise.id}>
                  <div className="form-group">
                    <label htmlFor={`exercise-name-${exercise.id}`}>Exercício:</label>
                    <input
                      type="text"
                      id={`exercise-name-${exercise.id}`}
                      value={exercise.name}
                      onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                      required
                    />
                  </div>
    
                  <div className="form-group">
                    <label htmlFor={`weight-${exercise.id}`}>Peso (kg):</label>
                    <input
                      type="number"
                      id={`weight-${exercise.id}`}
                      value={exercise.weight}
                      onChange={(e) => updateExercise(exercise.id, 'weight', e.target.value)}
                      min="0"
                      step="0.5"
                      required
                    />
                  </div>
    
                  <div className="form-group">
                    <label htmlFor={`reps-${exercise.id}`}>Repetições:</label>
                    <input 
                      type="number" 
                      id={`reps-${exercise.id}`}
                      value={exercise.reps}
                      onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                      min="1" 
                      required
                    />
                  </div>
    
                  <div className="form-group">
                    <label htmlFor={`rest-${exercise.id}`}>Descanso (seg):</label>
                    <input 
                      type="number" 
                      id={`rest-${exercise.id}`}
                      value={exercise.rest}
                      onChange={(e) => updateExercise(exercise.id, 'rest', e.target.value)}
                      min="0" 
                      required 
                    />
                  </div>
                  
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => removeExercise(exercise.id)}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
    
            <button type="button" onClick={addExerciseField}>
              + Adicionar Exercício
            </button>
    
            <button type="submit">
              {workoutToEdit ? 'Atualizar Treino' : 'Salvar Treino'}
            </button>
          </form>
        </section>
    );
};

export default WorkoutForm;