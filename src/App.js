import './App.css';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [workout, setWorkouts] = useState([]);

  const [workoutName, setWorkoutName] = useState('');
  const [workoutCategory, setWorkoutCategory] = useState('');
  const [exercises, setExercises] = useState([{
    id: uuidv4(),
    name: '',
    weight: '',
    reps: '',
    rest: ''
  }]);

  const [editWorkoutId, setEditWorkout] = useState(null);
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
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log("Formulário enviado!")
            }}>
            
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
                onChenge={(e) => setWorkoutCategory(e.target.value)}
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
                            ? {...currentExecise, name: e.target.value}
                            : currentExecise
                          );

                          setExercises(updatedExercises);
                        }}
                        required
                      />
                    </div>

                    <div className='form-group'>

                    </div>

                    <div className='form-group'>

                    </div>

                    <div className='form-group'>
                      
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

            <button type="submit">
              {editWorkoutId ? 'Atualizar Treino' : 'Salvar Treino'}
            </button>
            </form>
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
