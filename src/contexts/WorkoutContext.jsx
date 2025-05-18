import React, { createContext, useState, useContext, useEffect } from 'react';
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
        const [savedApiDataWorkouts, exercisesListSelectForm] = await Promise.all([superHeavyApi.get(STORAGE_KEY), superHeavyApi.get('exercises')]);
        const savedHistory = localStorageService.get(HISTORY_KEY) || {};

        
        setExerciseList(exercisesListSelectForm);
        setWorkouts(savedApiDataWorkouts);
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

  const updateExercise = async (workoutId, exerciseId, updatedExercise) => {
    try {
      const updatedWorkouts = workouts.map(workout => {
        if (workout.id === workoutId) {
          const updatedExercises = workout.exercises.map(exercise => 
            exercise.id === exerciseId ? updatedExercise : exercise
          );
          return {
            ...workout,
            exercises: updatedExercises
          };
        }
        return workout;
      });

      setWorkouts(updatedWorkouts);
      await superHeavyApi.put(`workouts/${workoutId}/exercises/${exerciseId}`, updatedExercise);
      
      return true;
    }
    catch (error) {
      console.log(error);
      setError('Error updating exercise');
      return false;
    }
  }

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

  const deleteWorkoutExercise = async (workoutId, exerciseId) => {
    try {
      await superHeavyApi.delete(`workouts/${workoutId}/exercises/${exerciseId}`);
      
      const updatedWorkouts = workouts.map(workout => {
        if (workout.id === workoutId) {
          const updatedExercises = workout.exercises.filter(exercise => exercise.id !== exerciseId);
          return {
            ...workout,
            exercises: updatedExercises
          };
        }
        return workout;
      });

      setWorkouts(updatedWorkouts);

      return true;
    } catch (error) {
      console.log(error);
      setError('Error deleting workout exercise');
      return false;
    }
  }

  const addExerciseToWorkout = async (workoutId, exercise) => {
    try {
      const newExerciseAdded = await superHeavyApi.post(`${STORAGE_KEY}/${workoutId}/exercises`, exercise);

      const updatedWorkouts = workouts.map(workout => {
        if (workout.id === workoutId) {
          const updatedExercises = [...workout.exercises, newExerciseAdded];
          return {
            ...workout,
            exercises: updatedExercises
          };
        }
        return workout;
      });

      setWorkouts(updatedWorkouts);
      return newExerciseAdded;
    } catch (error) {
      console.log(error);
      setError('Error adding exercise to workout');
      return false;
    }
  };

  const startWorkout = async (workoutId) => {
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
          }),
        }))
      };

      await superHeavyApi.post(`${STORAGE_KEY}/${workoutId}/start`, {
        workoutId: workoutId,
        exercises: workoutWithProgress.exercises.map(ex => ({
          id: ex.id,
          exerciseId: ex.exercise.id,
          completed: ex.completed,
          rest: ex.rest,
          series: ex.actualSeries.map(serie => ({
            completed: serie.completed,
            weight: serie.actualWeight,
            reps: serie.actualReps
          })),
        })),
      });

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

  const removeExerciseSeries = async(exerciseId, seriesIndex) => {
    if (!activeWorkout) return;

    const updatedExercisesPromises = activeWorkout.exercises.map(async (exercise) => {
      if (exercise.id === exerciseId) {
        const updatedSeries = exercise.actualSeries.filter((_, idx) => idx !== seriesIndex);
        
        const newSeriesCount = Math.max(1, (exercise.series || 1) - 1);

        await superHeavyApi.put(`workouts/${activeWorkout.id}/exercises/${exerciseId}`, {
          ...exercise,
          series: newSeriesCount,
        });

        return {
          ...exercise,
          series: newSeriesCount,
          actualSeries: updatedSeries,
          completed: updatedSeries.length > 0 && updatedSeries.every(series => series.completed)
        };
      }
      return exercise;
    });

    const updatedExercises = await Promise.all(updatedExercisesPromises);

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
    deleteWorkoutExercise,
    addExerciseToWorkout,
    updateExercise
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;
