import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';


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
