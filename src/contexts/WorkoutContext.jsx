import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import localStorageService from '../services/localStorage';
import superHeavyApi from '../services/superHeavyApi';

const STORAGE_KEY = 'workouts';
const HISTORY_KEY = 'workout_history';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentExerciseInfo, setCurrentExerciseInfo] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        let savedWorkouts = await superHeavyApi.get(STORAGE_KEY) || [];
        const savedHistory = localStorageService.get(HISTORY_KEY) || {};
        const exercises = await superHeavyApi.get('exercises') || [];

        if (savedWorkouts) {
         const workoutsPromises = await savedWorkouts.map(async (workout) => {
              const exercises = await getWorkoutExercises(workout) || [];
              return {
                ...workout,
                exercises: exercises
              };
            });
            savedWorkouts = await Promise.all(workoutsPromises);
        }

        
        
        setExerciseList(exercises);
        setWorkouts(savedWorkouts);
        setWorkoutHistory(savedHistory);
        setLoading(false);
      } catch (error) {
        setError('Error loading workouts');
        setLoading(false);
      }
   };

  fetchWorkouts();
  }, []);

  const addWorkout = async (workout) => {
    try {
      const newWorkout = {
        ...workout,
      };
      
      const updatedWorkouts = [...workouts, newWorkout];
      setWorkouts(updatedWorkouts);
      const {id: createdWorkoutId} = await superHeavyApi.post(STORAGE_KEY, {
        name: newWorkout.name,
      });

      const orderedExercises = newWorkout.exercises.map((exercise, index) => ({
        ...exercise,
        order: index + 1,
      }));

      await superHeavyApi.put(`${STORAGE_KEY}/${createdWorkoutId}/exercises`, {
        exercises: orderedExercises,
      });

      return true;
    } catch (error) {
      setError('Error adding workout');
      return false;
    }
  };

  const updateWorkout = async (updatedWorkout) => {
    try {

      const updatedWorkouts = workouts.map(workout => 
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      );

      setWorkouts(updatedWorkouts);
      await superHeavyApi.put(`${STORAGE_KEY}/${updatedWorkout.id}`, {
        name: updatedWorkout.name
      });

      await superHeavyApi.put(`workouts/${updatedWorkout.id}/exercises`, {
        exercises: updatedWorkout.exercises
      });
      return true;
    } catch (error) {
      setError('Error updating workout');
      return false;
    }
  };

  const deleteWorkout = async (id) => {
    try {
      const updatedWorkouts = workouts.filter(workout => workout.id !== id);
      setWorkouts(updatedWorkouts);

      await superHeavyApi.delete(`${STORAGE_KEY}/${id}`);
      
      return true;
    } catch (error) {
      console.log(error);
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
        const allCompleted = updatedSeries.every(serie => serie.completed);

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
          ...(workoutHistory[activeWorkout.id] || []).slice(-9),
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

  const getWorkoutExercises = async (workout) => {
    if (!workout.id) return [];
    const exercises = await superHeavyApi.get(`workouts/${workout.id}/exercises`);
    return exercises ?? [];
  }

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
    exerciseList,
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
    setTimeLeft,
    getWorkoutExercises,
    setWorkouts,
    setExerciseList,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;
