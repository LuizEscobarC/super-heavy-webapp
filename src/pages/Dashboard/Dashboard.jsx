import React, { useState } from 'react';
import WorkoutForm from '../../components/workout/WorkoutForm';
import WorkoutList from '../../components/workout/WorkoutList';
import useWorkouts from '../../hooks/useWorkouts';
import './Dashboard.css';
import{ Alert } from '../../components/common';

const Dashboard = () => {
  const { workouts, loading, error, addWorkout, updateWorkout, deleteWorkout, filterByCategory } = useWorkouts();
  const [workoutToEdit, setWorkoutToEdit] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [alert, setAlert] = useState(null);

  const handleEdit = (workout) => {
    setWorkoutToEdit(workout);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setFilterCategory(category);
  };

  const handleAddWorkout = (workout) => {
    const success = addWorkout(workout);
    if (success) {
      setAlert({ message: 'Treino adicionado com sucesso!', type: 'success' });
    } else {
      setAlert({ message: 'Erro ao adicionar treino', type: 'error' });
    }
  };

  const handleUpdateWorkout = (workout) => {
    const success = updateWorkout(workout);
    if (success) {
      setAlert({ message: 'Treino atualizado com sucesso!', type: 'success' });
    } else {
      setAlert({ message: 'Erro ao atualizar treino', type: 'error' });
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <main className="dashboard">
      {alert && <Alert message={alert.message} type={alert.type} />}
      <WorkoutForm 
        addWorkout={handleAddWorkout} 
        updateWorkout={handleUpdateWorkout}
        workoutToEdit={workoutToEdit}
        setWorkoutToEdit={setWorkoutToEdit}
      />
      
      <WorkoutList 
        workouts={filterByCategory(filterCategory)} 
        onDelete={deleteWorkout}
        onEdit={handleEdit}
        filterCategory={filterCategory}
        onCategoryChange={handleCategoryChange}
      />
    </main>
  );
};

export default Dashboard;