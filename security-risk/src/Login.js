// src/Login.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import tecemLogo from './assets/tecem-logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Ruta actual en Login.js:", location.pathname);
    localStorage.removeItem('userRole'); // Limpia cualquier rol al llegar a la página de login
  }, [location]);

  const handleLogin = (event) => {
    event.preventDefault();
    setError('');

    if (username === 'standard' && password === 'pass') {
      localStorage.setItem('userRole', 'standard');
      navigate('/');
    } else if (username === 'professional' && password === 'pass') {
      localStorage.setItem('userRole', 'professional');
      navigate('/');
    } else {
      setError('Usuario o contraseña incorrectos.');
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
        bgcolor: '#F0F2F5',
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
          Iniciar Sesión
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

export default Login; // <<-- Correcto: exporta Login