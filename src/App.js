import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import { Header, Footer } from './components/common';
import ThemeToggle from './components/common/ThemeToggle';
import useTheme from './hooks/useTheme.js';

function App() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="App">
      <Header />
      <Dashboard />
      <Footer />
      <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
}

export default App;
