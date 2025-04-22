import React, { useState } from 'react';
import WorkoutForm from '../../components/workout/WorkoutForm';
import WorkoutList from '../../components/workout/WorkoutList';
import useWorkouts from '../../hooks/useWorkouts';
import './Dashboard.css';
import Alert from '../../components/common/Alert/Alert';

const Dashboard = () => {
  const { workouts, loading, error, alert, addWorkout, updateWorkout, deleteWorkout, filterByCategory } = useWorkouts();
  const [workoutToEdit, setWorkoutToEdit] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const handleEdit = (workout) => {
    setWorkoutToEdit(workout);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setFilterCategory(category);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <main className="dashboard">
      {alert && <Alert message={alert.message} type={alert.type} />}
      <WorkoutForm 
        addWorkout={addWorkout} 
        updateWorkout={updateWorkout}
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