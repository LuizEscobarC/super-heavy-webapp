import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import localStorageService from '../services/localStorage';

const STORAGE_KEY = 'workouts';
const HISTORY_KEY = 'workout_history';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentExerciseInfo, setCurrentExerciseInfo] = useState(null);
  
  useEffect(() => {
    try {
      const savedWorkouts = localStorageService.get(STORAGE_KEY) || [];
      const savedHistory = localStorageService.get(HISTORY_KEY) || {};
      
      setWorkouts(savedWorkouts);
      setWorkoutHistory(savedHistory);
      setLoading(false);
    } catch (error) {
      setError('Error loading workouts');
      setLoading(false);
    }
  }, []);

  const addWorkout = (workout) => {
    try {
      const newWorkout = {
        ...workout,
        id: uuidv4(),
        date: new Date().toLocaleDateString('pt-BR')
      };
      
      const updatedWorkouts = [...workouts, newWorkout];
      setWorkouts(updatedWorkouts);
      localStorageService.set(STORAGE_KEY, updatedWorkouts);
      return true;
    } catch (error) {
      setError('Error adding workout');
      return false;
    }
  };

  const updateWorkout = (updatedWorkout) => {
    try {
      const updatedWorkouts = workouts.map(workout => 
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      );
      
      setWorkouts(updatedWorkouts);
      localStorageService.set(STORAGE_KEY, updatedWorkouts);
      return true;
    } catch (error) {
      setError('Error updating workout');
      return false;
    }
  };

  const deleteWorkout = (id) => {
    try {
      const updatedWorkouts = workouts.filter(workout => workout.id !== id);
      setWorkouts(updatedWorkouts);
      localStorageService.set(STORAGE_KEY, updatedWorkouts);
      
      // Remove from history as well
      const updatedHistory = { ...workoutHistory };
      delete updatedHistory[id];
      setWorkoutHistory(updatedHistory);
      localStorageService.set(HISTORY_KEY, updatedHistory);
      
      return true;
    } catch (error) {
      setError('Error deleting workout');
      return false;
    }
  };

  const startWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      const workoutWithProgress = {
        ...workout,
        exercises: workout.exercises.map(exercise => ({
          ...exercise,
          completed: false,
          actualSeries: Array(exercise.series || 1).fill({
            completed: false,
            actualWeight: exercise.weight,
            actualReps: exercise.reps
          })
        }))
      };
      setActiveWorkout(workoutWithProgress);
      return workoutWithProgress;
    }
    return null;
  };

  const completeExerciseSeries = (exerciseId, seriesIndex, data) => {
    if (!activeWorkout) return;

    const updatedExercises = activeWorkout.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const updatedSeries = [...exercise.actualSeries];
        updatedSeries[seriesIndex] = {
          ...updatedSeries[seriesIndex],
          ...data
          // O estado "completed" agora vem diretamente de "data"
        };

        // Check if all series are completed
        const allCompleted = updatedSeries.every(series => series.completed);

        return {
          ...exercise,
          actualSeries: updatedSeries,
          completed: allCompleted
        };
      }
      return exercise;
    });

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const finishWorkout = () => {
    if (!activeWorkout) return false;

    try {
      // Save workout history
      const workoutDate = new Date().toISOString();
      const workoutData = {
        date: workoutDate,
        exercises: activeWorkout.exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          muscle: ex.muscle,
          series: ex.actualSeries
        }))
      };

      const updatedHistory = {
        ...workoutHistory,
        [activeWorkout.id]: [
          ...(workoutHistory[activeWorkout.id] || []).slice(0, 9), // Keep last 10 entries
          workoutData
        ]
      };

      setWorkoutHistory(updatedHistory);
      localStorageService.set(HISTORY_KEY, updatedHistory);
      
      // Clear active workout
      setActiveWorkout(null);
      return true;
    } catch (error) {
      setError('Error finishing workout');
      return false;
    }
  };

  const getLastWorkoutData = (workoutId) => {
    const history = workoutHistory[workoutId];
    return history ? history[history.length - 1] : null;
  };

  const updateActiveWorkout = (updatedWorkout) => {
    setActiveWorkout(updatedWorkout);
  };

  // Função para remover uma série específica de um exercício
  const removeExerciseSeries = (exerciseId, seriesIndex) => {
    if (!activeWorkout) return;

    const updatedExercises = activeWorkout.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        // Remove a série específica
        const updatedSeries = exercise.actualSeries.filter((_, idx) => idx !== seriesIndex);
        
        // Atualiza a contagem de séries
        return {
          ...exercise,
          series: Math.max(1, (exercise.series || 1) - 1),
          actualSeries: updatedSeries,
          // Recalcula se todas as séries estão completas
          completed: updatedSeries.length > 0 && updatedSeries.every(series => series.completed)
        };
      }
      return exercise;
    });

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  // Timer functions
  const startTimer = (exerciseId, seriesIndex, duration) => {
    setTimerActive(true);
    setTimerDuration(duration);
    setTimeLeft(duration);
    setCurrentExerciseInfo({
      exerciseId,
      seriesIndex
    });
  };
  
  const stopTimer = () => {
    setTimerActive(false);
    setTimeLeft(0);
    setCurrentExerciseInfo(null);
  };
  
  // useEffect para o timer
  useEffect(() => {
    let interval;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  const value = {
    workouts,
    loading,
    error,
    activeWorkout,
    workoutHistory,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    startWorkout,
    completeExerciseSeries,
    finishWorkout,
    getLastWorkoutData,
    updateActiveWorkout,
    removeExerciseSeries,
    timerActive,
    timeLeft,
    currentExerciseInfo,
    timerDuration,
    startTimer,
    stopTimer,
    setTimeLeft
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;
