import React, { useState } from 'react';
import WorkoutForm from '../../components/workout/WorkoutForm';
import WorkoutList from '../../components/workout/WorkoutList';
import WorkoutExecution from '../../components/workout/WorkoutExecution/WorkoutExecution';
import { Alert } from '../../components/common';
import { useWorkout } from '../../contexts/WorkoutContext';
import './Dashboard.css';

const Dashboard = () => {
  const { 
    workouts,
    setworkouts,
    loading, 
    error,
    activeWorkout,
    addWorkout, 
    updateWorkout, 
    deleteWorkout,
    startWorkout,
    exerciseList,
    deleteWorkoutExercise,
    addExerciseToWorkout
  } = useWorkout();
  
  const [workoutToEdit, setWorkoutToEdit] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleEdit = (workout) => {
    setWorkoutToEdit(workout);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setWorkoutToEdit(null);
    } else {
      setAlert({ message: 'Erro ao atualizar treino', type: 'error' });
    }
  };

  const handleStartWorkout = (workoutId) => {
    if (startWorkout(workoutId)) {
      setAlert({ message: 'Treino iniciado!', type: 'success' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinishWorkout = () => {
    setAlert({ message: 'Treino concluído com sucesso!', type: 'success' });
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <main className="dashboard">
      {alert && <Alert message={alert.message} type={alert.type} />}
      
      {/* {activeWorkout ? (
        <WorkoutExecution onFinish={handleFinishWorkout} />
      ) : ( */}
        <>
          <WorkoutForm 
            addWorkout={handleAddWorkout} 
            updateWorkout={handleUpdateWorkout}
            workoutToEdit={workoutToEdit}
            setWorkoutToEdit={setWorkoutToEdit}
            exerciseList={exerciseList}
            deleteWorkoutExercise={deleteWorkoutExercise}
            addExerciseToWorkout={addExerciseToWorkout}
            workouts={workouts}
          />
          
          <WorkoutList 
            workouts={workouts}
            setworkouts={setworkouts}
            onDelete={deleteWorkout}
            onEdit={handleEdit}
            onStart={handleStartWorkout}
          />
        </>
      {/* )} */}
    </main>
  );
};

export default Dashboard;