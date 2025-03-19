import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Reservas from './components/Reservas';
import Historial from './components/Historial';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/historial" element={<Historial />} />
      </Routes>
    </Router>
  );
}

export default App;
