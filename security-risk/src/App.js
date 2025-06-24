// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes de página
import Login from './Login';
import CrearProject from './crear_project';
import Home from './Home';
import ProjectAnalysis from './ProjectAnalysis';
import UserManagerPanel from './UserManagerPanel';
import LoginAdmin from './LoginAdmin';
import AssignRolesPanel from './AssignRolesPanel'; // <<-- NUEVA IMPORTACIÓN

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el Login de Usuarios Normales */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para el Login de Administrador */}
        <Route path="/admin-login" element={<LoginAdmin />} />

        {/* Ruta para la página de Creación de Proyecto */}
        <Route path="/create-project" element={<CrearProject />} />

        {/* Ruta para la página de Análisis de Proyecto */}
        <Route path="/project-analysis" element={<ProjectAnalysis />} />

        {/* Ruta para el Panel de Administración de Usuarios (Listar usuarios) */}
        <Route path="/user-manager" element={<UserManagerPanel />} />

        {/* Ruta para el Panel de Asignación de Roles */}
        <Route path="/assign-roles" element={<AssignRolesPanel />} /> {/* <<-- NUEVA RUTA */}

        {/* Ruta para la página principal (Home), que contiene el chat y proyectos */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;