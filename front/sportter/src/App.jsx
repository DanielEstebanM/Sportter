import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PantallaInicio from "./components/PantallaInicio";
import PantallaPrincipal from "./components/PantallaPrincipal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PantallaInicio />} />
        <Route path="/principal" element={<PantallaPrincipal />} />
      </Routes>
    </Router>
  );
}

export default App;