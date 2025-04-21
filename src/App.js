import './App.css';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [workouts, setWorkouts] = useState([]);

  const [workoutName, setWorkoutName] = useState('');
  const [workoutCategory, setWorkoutCategory] = useState('');
  const [exercises, setExercises] = useState([{
    id: uuidv4(),
    name: '',
    weight: '',
    reps: '',
    rest: ''
  }]);

  const [editWorkoutId, setEditWorkoutId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    setWorkouts(savedWorkouts);
  }, []);

  const generateId = () => {
    return uuidv4();
  };

  const addExerciseField = () => {
    const newExercise = {
      id: generateId(),
      name: '',
      weight: '',
      reps: '',
      rest: ''
    };

    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id) =>{
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const saveWorkout = (e) => {
    e.preventDefault();
    if (editWorkoutId) {
      const updatedWorkouts = workouts.map(workout => 
        workout.id === editWorkoutId
          ? {
            ...workout,
            name: workoutName,
            category: workoutCategory,
            exercises: exercises
          } : workout
      );

      setWorkouts(updatedWorkouts);
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      setEditWorkoutId(null);
      alert('Treino atualizado com sucesso!');
    } else {
      const newWorkout = {
        id: generateId(),
        name: workoutName,
        category: workoutCategory,
        date: new Date().toLocaleDateString('pt-BR'),
        exercises: exercises
      };

      const updatedWorkouts= [...workouts, newWorkout];
      setWorkouts(updatedWorkouts);
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      alert('Treino salvo com sucesso!');
    }

    setWorkoutName('');
    setWorkoutCategory('');
    setExercises([{ 
      id: generateId(),
      name: '',
      weight: '',
      reps: '',
      rest: ''
    }]);
  };

  return (
    <div className="App">
      <header>
        <h1>SuperHeavy</h1>
        <p>Gerencie seus treinos de forma simples e eficiente com IA</p>
      </header>

      <main>
        {
          <section className="workout-form">
            <h2> {editWorkoutId ? 'Editar Treino' : 'Salvar Treino'}</h2>
            <form onSubmit={saveWorkout}>
            
            <div className='form-group'>
              <label htmlFor='workout-name'>Nome do treino:</label>
              <input
                type='text'
                id='workout-name'
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor="workout-category">Categoria:</label>
              <select
                id='workout-category'
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

            <div className='exercise-container'>
              <h3>Exercícios</h3>
              {exercises.map((exercise) => (

                  <div className='exercise-entry' key={exercise.id}>
                    <div className='form-group'>
                      <label htmlFor={`exercise-name-${exercise.id}`}>Exercício:</label>
                      <input
                        type='text'
                        id={`exercise-name-${exercise.id}`}
                        value={exercise.name}
                        onChange={(e) => {
                          const updatedExercises = exercises.map((currentExecise) => 
                            currentExecise.id === exercise.id
                            ? {...currentExecise,
                              name: e.target.value}
                            : currentExecise
                          );

                          setExercises(updatedExercises);
                        }}
                        required
                      />
                    </div>

                    <div className='form-group'>
                        <label htmlFor={`weight-${exercise.id}`}>Peso (kg):</label>
                        <input
                          type='number'
                          id={`weight-${exercise.id}`}
                          value={exercise.weight}
                          onChange={(e) => {
                            const updatedExercises = exercises.map((currentExecise) => 
                            currentExecise.id === exercise.id
                              ? {...currentExecise, weight: e.target.value}
                              : currentExecise
                            );
                            setExercises(updatedExercises);
                          }}
                          min='0'
                          step="0.5"
                          required
                        />
                    </div>

                    <div className='form-group'>
                      <label htmlFor={`reps-${exercise.id}`}>Repetições:</label>
                      <input 
                        type="number" 
                        id={`reps-${exercise.id}`}
                        value={exercise.reps}
                        onChange={(e) => {
                          const updatedExercises = exercises.map((currentExecise) => 
                            currentExecise.id === exercise.id
                              ? {...currentExecise, reps: e.target.value}
                              : currentExecise
                          );
                          setExercises(updatedExercises);
                        }}
                        min="1" 
                        required
                      />
                    </div>

                    <div className='form-group'>
                      <label htmlFor={`rest-${exercise.id}`}>Descanso (seg):</label>
                      <input 
                        type="number" 
                        id={`rest-${exercise.id}`}
                        value={exercise.rest}
                        onChange={(e) => {
                          const updatedExercises = exercises.map(ex => 
                            ex.id === exercise.id 
                              ? {...ex, rest: e.target.value} 
                              : ex
                          );
                          setExercises(updatedExercises);
                        }}
                        min="0" 
                        required 
                      />
                    </div>
                    
                    {exercises.length > 1 && (
                        <button
                          type='button'
                          className='delete-btn'
                          onClick={
                            () => removeExercise(exercise.id)
                          }
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
              {editWorkoutId ? 'Atualizar Treino' : 'Salvar Treino'}
            </button>
            </form>
          </section>
        }
        {
          <section className="workout-list">
            <h2>Meus Treinos</h2>
            <div className="filter-controls">
              <label htmlFor="filter-category">Filtrar por categoria:</label>
              <select 
                id="filter-category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
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

            <div id="workouts-container">
              {workouts.lenght === 0 ? (
                <p className="no-workouts">Você ainda não tem treinos salvos.</p>
              ) : (
                workouts.filter(workout => filterCategory === 'all' || workout.category === filterCategory)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((workout) => (
                  <div className="workout-item" key={workout.id}>
                    <div>
                      <h3>{workout.name}</h3>
                      {workout.category && <span className="workout-category">{workout.category}</span>}
                    </div>
                    <div className="workout-actions">
                      <span className="workout-date">{workout.date}</span>
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setWorkoutName(workout.name);
                          setWorkoutName(workout.name);
                          setWorkoutCategory(workout.category || '');
                          setExercises(workout.exercises);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Editar
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir este treino?')) {
                            const updatedWorkouts = workouts.filter(currentWorkout => currentWorkout.id !== workout.id);
                            setWorkouts(updatedWorkouts);
                            localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
                          }
                        }}
                      >
                        Excluir
                      </button>
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
        }
      </main>

      <footer>
        <p>&copy; 2025 SuperHeavy. Todos os direitos reservados.</p>
        <p>Desenvolvido por Luiz Paulo e equipe (Copilot).</p>
      </footer>
    </div>
  );
}

export default App;
