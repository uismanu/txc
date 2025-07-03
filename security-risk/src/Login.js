// src/Login.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider, // Para separar el login tradicional del de Google
} from '@mui/material';
import tecemLogo from './assets/tecem-logo.png';
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useNavigate y useLocation para navegación y manejo de rutas
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // <<-- NUEVAS IMPORTACIONES

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // URL del backend desde las variables de entorno
  const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
  const GOOGLE_AUTH_ENDPOINT = `${BACKEND_API_URL}/auth/google/token`; // Endpoint para enviar el token de Google

  useEffect(() => {
    console.log("Ruta actual en Login.js:", location.pathname);
    // Limpia cualquier token o rol al llegar a la página de login
    localStorage.removeItem('userToken'); // Nuevo token de aplicación
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminRole'); // Asegurarse de limpiar también el rol de admin si existe
  }, [location]);

  // Manejador para el login tradicional (manteniendo como alternativa)
  const handleTraditionalLogin = (event) => {
    event.preventDefault();
    setError('');

    if (username === 'standard' && password === 'pass') {
      // Simular un token de aplicación para login tradicional
      localStorage.setItem('userToken', 'fake-standard-token');
      localStorage.setItem('userRole', 'standard');
      navigate('/');
    } else if (username === 'professional' && password === 'pass') {
      // Simular un token de aplicación para login tradicional
      localStorage.setItem('userToken', 'fake-professional-token');
      localStorage.setItem('userRole', 'professional');
      navigate('/');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  // Manejador para el éxito del login con Google
  const handleGoogleSuccess = async (response) => {
    console.log("Login de Google Exitoso. Credential (JWT de Google):", response.credential);

    try {
      // Envía el JWT de Google al backend para validación y obtención del token de tu app
      const backendResponse = await fetch(GOOGLE_AUTH_ENDPOINT, {
        method: 'POST', // Método HTTP POST según lo que el backend espere (Postman muestra PUT, pero para token suele ser POST)
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleToken: response.credential }), // Enviar el JWT de Google
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({ message: backendResponse.statusText }));
        throw new Error(`Fallo de autenticación con el backend: ${backendResponse.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const data = await backendResponse.json();
      // Asumimos que el backend devuelve { token: "tu_app_token", role: "standard"|"professional" }
      const appToken = data.token;
      const userRoleFromBackend = data.role;

      if (!appToken || !userRoleFromBackend) {
          throw new Error("El backend no proporcionó un token o rol válido.");
      }

      localStorage.setItem('userToken', appToken); // Almacena el token de tu aplicación
      localStorage.setItem('userRole', userRoleFromBackend); // Almacena el rol del usuario

      navigate('/'); // Redirige al Home
    } catch (error) {
      console.error("Error en la autenticación con el backend de Google:", error);
      setError(`No se pudo iniciar sesión con Google: ${error.message}`);
    }
  };

  // Manejador para errores en el login de Google
  const handleGoogleError = (errorResponse) => {
    console.error("Login de Google Fallido:", errorResponse);
    setError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
  };

  return (
    // Es CRÍTICO que el componente esté envuelto en GoogleOAuthProvider en App.js
    // El clientId se obtiene de las variables de entorno para seguridad.
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