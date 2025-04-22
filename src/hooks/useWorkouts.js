import { useState, useEffect } from 'react';
import localStorageService from '../services/localStorage';

const STORAGE_KEY = 'workouts';

const useWorkouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        try {
            const savedWorkouts = localStorageService.get(STORAGE_KEY) || [];
            setWorkouts(savedWorkouts);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }, []);

    const addWorkout = (workout) => {
        try {
            const updatedWorkouts = [...workouts, workout]
            setWorkouts(updatedWorkouts);
            localStorageService.set(STORAGE_KEY, updatedWorkouts);
            setAlert({ message: 'Treino adicionado com sucesso!', type: 'success' });
            return true;
        } catch (error) {
            setError('Erro ao adicionar treino');
            return false;
        }
    };

    const updateWorkout = (updatedWorkout) => {
        try {
            const updatedWorkouts = workouts.map(currentWorkout => 
                currentWorkout.id === updatedWorkout.id ? updatedWorkout : currentWorkout
            );
            setWorkouts(updatedWorkouts);
            localStorageService.set(STORAGE_KEY, updatedWorkouts);
            setAlert({ message: 'Treino atualizado com sucesso!', type: 'success' });
            return true;
        } catch (error) {
            setError('Erro ao atualizar treino');
            return false;
        }
    };

    const deleteWorkout = (id) => {
        try {
            const updatedWorkouts = workouts.filter(workout => workout.id !== id);
            setWorkouts(updatedWorkouts);
            localStorageService.set(STORAGE_KEY, updatedWorkouts);
            setAlert({ message: 'Treino deletado com sucesso!', type: 'success' });
            return true;
        } catch (error) {
            setError('Erro ao excluir treino');
            return false;
        }
    };

    const filterByCategory = (category) => {
        return category === 'all' 
          ? workouts
          : workouts.filter(workout => workout.category === category);
    };

    return {
        workouts,
        loading,
        error,
        alert,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        filterByCategory
    };
};

export default useWorkouts;