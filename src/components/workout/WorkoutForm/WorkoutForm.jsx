import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './WorkoutForm.css';

const WorkoutForm = ({ addWorkout, updateWorkout, workoutToEdit, setWorkoutToEdit, exerciseList, deleteWorkoutExercise, addExerciseToWorkout, workouts }) => {
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState([{
        id: 1,
        name: '',
        weight: '',
        reps: '',
        rest: '',
        series: 1
    }]);

    useEffect(() => {
        if (workoutToEdit) {
            setWorkoutName(workoutToEdit.name);
            const workout = workouts.find(w => w.id === workoutToEdit.id);
            const updatedExercises = workout.exercises;
            setExercises(updatedExercises);
        }
    }, [workoutToEdit, workouts]);


    const addExerciseField = () => {
        const newExercise = {
            id: exercises.length ?  exercises.length + 1 : 1,
            name: '',
            weight: '',
            reps: '',
            rest: '',
            series: 1,
            order: exercises.length ?  exercises.length + 1 : 1
        };
    
        setExercises([...exercises, newExercise]);
    };

    const duplicateExercise = async (exerciseId) => {
        if(!workoutToEdit) {
          addExerciseField();
          return;
        }
        const workout = workouts.find(w => w.id === workoutToEdit.id);
        const exerciseToDuplicate = workout.exercises.find(ex => ex.id === exerciseId);
        if(!exerciseToDuplicate || !exerciseToDuplicate?.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
          addExerciseField();
          return;
        }
        if (exerciseToDuplicate) {
           const  newExercise = await addExerciseToWorkout(workoutToEdit.id, {
              ...exerciseToDuplicate,
              id: undefined,
              order: exercises.length ?  exercises.length + 1 : 1
            });

          setExercises([...exercises, newExercise]);
        }
    };

    const removeExercise = async (id) => {
        if(! workoutToEdit) {
          const filteredExercises = exercises.filter(ex => ex.id !== id);
          setExercises(filteredExercises);
          return;
        }
        await deleteWorkoutExercise(workoutToEdit.id, id);
    };

    const updateExercise = (id, field, value) => {
        setExercises(exercises.map(exercise => {
              if (exercise.id !== id) return exercise;

              if (field === 'exercise') {
                  value = { 
                    ...exerciseList.find(ex => ex.id === value)
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
                        value={exercise.exercise?.id || ''}
                        onChange={(e) => updateExercise(exercise.id, 'exercise', e.target.value)}
                        required
                      >
                        <option value="">Selecione um exercício</option>
                        {exerciseList.map((exerciseItem) => (
                          <option key={exerciseItem.id} value={exerciseItem.id}>
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
                        onChange={async (e) => updateExercise(exercise.id, 'rest', e.target.value)}
                        min="0" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="exercise-actions">
                    <button
                      type="button"
                      className="duplicate-btn"
                      onClick={async () => await duplicateExercise(exercise.id)}
                    >
                      Duplicar
                    </button>
                    
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={async () => await removeExercise(exercise.id)}
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