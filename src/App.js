import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import { Header, Footer } from './components/common';
import FloatingTimer from './components/workout/FloatingTimer/FloatingTimer';
import { WorkoutProvider } from './contexts/WorkoutContext';

function App() {
  return (
    <div className="App">
      <WorkoutProvider>
        <Header />
        <Dashboard />
        <Footer />
        <FloatingTimer />
      </WorkoutProvider>
    </div>
  );
}

export default App;
