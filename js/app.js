import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


const workoutForm = document.getElementById('workout-form');
const workoutNameInput = document.getElementById('workout-name');
const addExerciseBtn = document.getElementById('add-exercise');
const exerciseContainer = document.querySelector('.exercise-container');
const workoutsContainer = document.getElementById('workouts-container');

let exerciseCounter = 1;

let workouts = JSON.parse(localStorage.getItem('workouts')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadWorkouts();

    addExerciseBtn.addEventListener('click', addExerciseField);
    workoutForm.addEventListener('submit', saveWorkout);
});

function addExerciseField() {
    exerciseCounter++;

    const exerciseEntry = document.createElement('div');
    exerciseEntry.className = 'exercise-entry';

    exerciseEntry.innerHTML = `
        <div class="form-group">
            <label for="exercise-name-${exerciseCounter}">Exercício:</label>
            <input type="text" class="exercise-name" id="exercise-name-${exerciseCounter}" required>
        </div>
        <div class="form-group">
            <label for="weight-${exerciseCounter}">Peso (kg):</label>
            <input type="number" class="weight" id="weight-${exerciseCounter}" min="0" step="0.5" required>
        </div>
        <div class="form-group">
            <label for="reps-${exerciseCounter}">Repetições:</label>
            <input type="number" class="reps" id="reps-${exerciseCounter}" min="1" required>
        </div>
        <div class="form-group">
            <label for="rest-${exerciseCounter}">Descanso (seg):</label>
            <input type="number" class="rest" id="rest-${exerciseCounter}" min="0" required>
        </div>
        <button type="button" class="delete-exercise delete-btn">Remover</button>
    `;

    exerciseContainer.appendChild(exerciseEntry);

    exerciseEntry.querySelector('.delete-exercise').addEventListener('click', () => {
        exerciseEntry.remove();
    });
}

function saveWorkout(event) {
    event.preventDefault();

    const workoutName = workoutNameInput.value;

    const exercisesEntries = document.querySelectorAll('.exercise-entry');
    const exercises = [];

    exercisesEntries.forEach( entry => {
        const exercise = {
            name: entry.querySelector('.exercise-name').value,
            weight: entry.querySelector('.weight').value,
            reps: entry.querySelector('.reps').value,
            rest: entry.querySelector('.rest').value
        };

        exercises.push(exercise);
    });

    const workout = {
        id: uuidv4(),
        name: workoutName,
        date: new Date().toLocaleDateString(),
        exercises: exercises
    };

    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));

    loadWorkouts();

    workoutForm.reset();

    const exercisesEntryList = document.querySelectorAll('.exercise-entry');
    exercisesEntryList.forEach(entry => {
        document.querySelectorAll('.exercise-entry').length === 1
        ? null
        : entry.remove();
    });

    exerciseCounter = 1;
    
    alert('Treino salvo com sucesso!');
}

function loadWorkouts() {
    workoutsContainer.innerHTML = '';
    workoutsContainer.innerHTML = '<p class="no-workouts">Você ainda não tem treinos salvos.</p>'

}