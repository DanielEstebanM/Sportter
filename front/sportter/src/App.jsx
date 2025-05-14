import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimatedRoutes from './AnimatedRoutes';
import PantallaInicio from "./components/PantallaInicio";
import PantallaPrincipal from "./components/PantallaPrincipal";
import PantallaMensajes from './components/PantallaMensajes';

function App() {
  return (
    <Router>
      <AnimatedRoutes>
        <Routes>
          <Route path="/" element={<PantallaInicio />} />
          <Route path="/principal" element={<PantallaPrincipal />} />
          <Route path="/mensajes" element={<PantallaMensajes />} />
        </Routes>
      </AnimatedRoutes>
    </Router>
  );
}

export default App;