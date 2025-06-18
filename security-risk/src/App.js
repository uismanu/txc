// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes de página
import Login from './Login';
import CrearProject from './crear_project';
import Home from './Home'; // <<-- Solo importamos el Home unificado
import ProjectAnalysis from './ProjectAnalysis';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página de Login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para la página de Creación de Proyecto */}
        <Route path="/create-project" element={<CrearProject />} />

        {/* Ruta para la página de Análisis de Proyecto */}
        <Route path="/project-analysis" element={<ProjectAnalysis />} />

        {/* Ruta para la página principal (Home) */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;