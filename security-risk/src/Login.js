// src/Login.js
import React, { useState, useEffect } from 'react'; // <<-- Añadir useEffect
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import tecemLogo from './assets/tecem-logo.png';
import { useLocation } from 'react-router-dom'; // <<-- Añadir useLocation

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation(); // <<-- Obtener la ubicación

  useEffect(() => {
    console.log("Ruta actual en Login.js:", location.pathname);
  }, [location]);

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
    alert(`Intentando iniciar sesión con usuario: ${username}`);
  };

  return (

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#F0F2F5', // Color de fondo similar al de tu aplicación
        p: 2,
      }}
    >
      <Paper
        elevation={0} // Sin sombra para un look más plano
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
              maxWidth: '250px', // Ajusta el tamaño del logo si es necesario
            }}
          />
        </Box>

        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Usuario"
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
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              },
              py: 1.5,
            }}
          >
            Entrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;