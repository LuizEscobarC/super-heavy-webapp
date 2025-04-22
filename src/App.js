import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import { Header, Footer } from './components/common';

function App() {
  return (
    <div className="App">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  );
}

export default App;
