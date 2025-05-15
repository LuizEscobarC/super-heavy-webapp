import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './WorkoutForm.css';

const WorkoutForm = ({ addWorkout, updateWorkout, workoutToEdit, setWorkoutToEdit, exerciseList }) => {
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState([{
        id: uuidv4(),
        name: '',
        weight: '',
        reps: '',
        rest: '',
        series: 1
    }]);

    useEffect(() => {
        if (workoutToEdit) {
            setWorkoutName(workoutToEdit.name);
            
            const updatedExercises = workoutToEdit.exercises;
            
            setExercises(updatedExercises);
        }
    }, [workoutToEdit]);


    const addExerciseField = () => {
        const newExercise = {
            id: uuidv4(),
            name: '',
            weight: '',
            reps: '',
            rest: '',
            series: 1,
            order: exercises.length ?  exercises.length + 1 : 1
        };
    
        setExercises([...exercises, newExercise]);
    };

    const duplicateExercise = (exerciseId) => {
        const exerciseToDuplicate = exercises.find(ex => ex.id === exerciseId);
        if (exerciseToDuplicate) {
            const duplicatedExercise = {
                ...exerciseToDuplicate,
                id: uuidv4()
            };
            setExercises([...exercises, duplicatedExercise]);
        }
    };

    const removeExercise = (id) => {
        setExercises(exercises.filter(exercise => exercise.id !== id));
    };

    const updateExercise = (id, field, value) => {
        setExercises(exercises.map(exercise => {
              if (exercise.id !== id) return exercise;

              if (field === 'exercise') {
                  value = { 
                    ...exerciseList.find(ex => ex.id === value)
                  };

              }
        
              if (field.includes('.')) {
                  const [parent, child] = field.split('.');
                  return {
                      ...exercise,
                      [parent]: {
                          ...exercise[parent],
                          [child]: value
                      }
                  };
              }

              return {
                  ...exercise,
                  [field]: value
              };
          }
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (workoutToEdit) {
            await updateWorkout({
                ...workoutToEdit,
                name: workoutName,
                exercises: exercises
            });
            setWorkoutToEdit(null);
        } else {
            const newWorkout = {
                name: workoutName,
                createdAt: new Date().toLocaleDateString('pt-BR'),
                exercises: exercises
            };

            addWorkout(newWorkout);
        }

        setWorkoutName('');
        setExercises([{
          id: uuidv4(),
          name: '',
          weight: '',
          reps: '',
          rest: '',
          series: 1
        }]);
    };

    return (
        <section className="workout-form">
          <h2>{workoutToEdit ? 'Editar Treino' : 'Criar Novo Treino'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="workout-name">Nome do Treino:</label>
              <input
                type="text"
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                required
                placeholder="Ex: Treino de Peito, Treino de Segunda, etc."
              />
            </div>
    
            <div className="exercise-container">
              <h3>Exercícios</h3>
              {exercises.map((exercise) => (
                <div className="exercise-entry" key={exercise.id}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`exercise-name-${exercise.id}`}>Nome do Exercício:</label>
                      <select
                        id={`exercise-name-${exercise.id}`}
                        onChange={(e) => updateExercise(exercise.id, 'exercise', e.target.value)}
                        required
                      >
                        <option value="">Selecione um exercício</option>
                        {exerciseList.map((exerciseItem) => (
                          <option key={exerciseItem.id} selected={(exercise.exercise?.id === exerciseItem.id) ? 'selected' : ''} value={exerciseItem.id}>
                            {exerciseItem.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`series-${exercise.id}`}>Séries:</label>
                      <input
                        type="number"
                        id={`series-${exercise.id}`}
                        value={exercise.series}
                        onChange={(e) => updateExercise(exercise.id, 'series', parseInt(e.target.value) || 1)}
                        min="1"
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
                  </div>

                  <div className="form-row">
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
                  </div>
                  
                  <div className="exercise-actions">
                    <button
                      type="button"
                      className="duplicate-btn"
                      onClick={() => duplicateExercise(exercise.id)}
                    >
                      Duplicar
                    </button>
                    
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
                </div>
              ))}
            </div>
    
            <button className="btn-add-exercise" type="button" onClick={addExerciseField}>
              + Adicionar Exercício
            </button>
    
            <button type="submit" className="btn-save">
              {workoutToEdit ? 'Atualizar Treino' : 'Salvar Treino'}
            </button>
          </form>
        </section>
    );
};

export default WorkoutForm;