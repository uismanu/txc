// src/LoginAdmin.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import tecemLogo from './assets/tecem-logo.png'; // Reutilizar el logo existente
import { useNavigate, useLocation } from 'react-router-dom';

function LoginAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Ruta actual en LoginAdmin.js:", location.pathname);
    // Opcional: limpiar cualquier rol de admin si el usuario llega aquí sin estar logueado como admin
    localStorage.removeItem('adminRole'); // Usaremos 'adminRole' para distinguirlo del 'userRole'
  }, [location]);

  const handleLogin = (event) => {
    event.preventDefault();
    setError(''); // Limpiar errores anteriores

    // Credenciales de administrador de demostración
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'adminpass';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('adminRole', 'full_access'); // Almacenar un rol de admin
      navigate('/user-manager'); // Redirigir al panel de administración
    } else {
      setError('Credenciales de administrador incorrectas.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#F0F2F5', // Mantener el mismo fondo que el login de usuarios
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <img
            src={tecemLogo}
            alt="Tecem Sempie Solutions Logo"
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '250px',
            }}
          />
        </Box>

        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
          Acceso de Administrador
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Usuario Administrador"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2, '& fieldset': { borderRadius: '8px' } }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Contraseña"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3, '& fieldset': { borderRadius: '8px' } }}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              bgcolor: '#1976d2', // Color azul como el login principal
              '&:hover': {
                bgcolor: '#1565c0',
              },
              py: 1.5,
            }}
          >
            Entrar al Panel
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginAdmin;