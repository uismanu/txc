// src/Login.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import tecemLogo from './assets/tecem-logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
  const GOOGLE_AUTH_ENDPOINT = `${BACKEND_API_URL}/auth/google/token`;

  // <<-- NUEVO: Mapeo de códigos de rol del backend a nombres de rol del frontend -->>
  const backendRoleCodeToFrontend = {
    "1": "standard",
    "2": "professional",
    "3": "consultant",
  };

  useEffect(() => {
    console.log("Ruta actual en Login.js:", location.pathname);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminRole');
  }, [location]);

  const handleTraditionalLogin = (event) => {
    event.preventDefault();
    setError('');

    // <<-- Actualizar login tradicional para usar el mapeo -->>
    let assignedRole = '';
    if (username === 'standard' && password === 'pass') {
      assignedRole = backendRoleCodeToFrontend["1"]; // Asigna "standard"
    } else if (username === 'professional' && password === 'pass') {
      assignedRole = backendRoleCodeToFrontend["2"]; // Asigna "professional"
    } else {
      setError('Usuario o contraseña incorrectos.');
      return;
    }
    localStorage.setItem('userToken', `fake-${assignedRole}-token`);
    localStorage.setItem('userRole', assignedRole);
    navigate('/');
  };

  const handleGoogleSuccess = async (response) => {
    console.log("Login de Google Exitoso. Credential (JWT de Google):", response.credential);

    try {
      const backendResponse = await fetch(GOOGLE_AUTH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleToken: response.credential }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({ message: backendResponse.statusText }));
        throw new Error(`Fallo de autenticación con el backend: ${backendResponse.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const data = await backendResponse.json();
      const appToken = data.token;
      // <<-- CAMBIO CLAVE AQUÍ: Mapear el rol recibido del backend (codrol) a la cadena de frontend -->>
      const userRoleFromBackendCode = data.role; // Asumo que el backend aún devuelve solo el codrol aquí
      const mappedUserRole = backendRoleCodeToFrontend[userRoleFromBackendCode];

      if (!appToken || !mappedUserRole) { // Verificar el mapeo también
          throw new Error("El backend no proporcionó un token o rol válido/mapeable.");
      }

      localStorage.setItem('userToken', appToken);
      localStorage.setItem('userRole', mappedUserRole); // Guardar el rol como string (standard, professional, etc.)

      navigate('/');
    } catch (error) {
      console.error("Error en la autenticación con el backend de Google:", error);
      setError(`No se pudo iniciar sesión con Google: ${error.message}`);
    }
  };

  const handleGoogleError = (errorResponse) => {
    console.error("Login de Google Fallido:", errorResponse);
    setError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
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

        {/* Login Tradicional */}
        <form onSubmit={handleTraditionalLogin} style={{ width: '100%' }}>
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

        <Divider sx={{ my: 3, width: '100%' }}>O</Divider>

        {/* Botón de Google Login */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          // useOneTap // Descomenta si quieres probar el flujo de "un toque"
        />
      </Paper>
    </Box>
  );
}

export default Login;