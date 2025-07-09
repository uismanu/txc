// src/AssignRolesPanel.js
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import AdjustIcon from '@mui/icons-material/Adjust';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate } from 'react-router-dom';

import securityIconAdmin from './assets/security-icon-admin.png';

function AssignRolesPanel() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const primaryGreen = '#68ab2b';
  const lightGreen = '#e0f2d4';
  const darkGreen = '#528a22';

  const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

  // Mapeo de Roles (Frontend a Backend y viceversa)
  const frontendRoleToBackend = {
    standard: "1",
    professional: "2",
    consultant: "3",
  };

  const backendRoleToFrontend = {
    "1": "standard",
    "2": "professional",
    "3": "consultant",
  };

  const roles = ['standard', 'professional', 'consultant']; // Roles disponibles en frontend (strings)

  // Función para obtener la lista de usuarios (similar a UserManagerPanel)
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_API_URL}/management/user/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Error al listar usuarios para roles: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      // <<-- CAMBIO CLAVE AQUÍ: Usar idusuario y mapear rol -->>
      const mappedUsers = data.users.map(user => ({
        id: user.idusuario, // <<-- Usar idusuario como ID único
        email: user.email,
        currentRole: backendRoleToFrontend[user.rol.codrol] || user.rol.rol, // Rol actual para la edición
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error("Error fetching users for roles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem('adminRole');
    navigate('/admin-login');
  };

  const handleBackToUserManager = () => {
    navigate('/user-manager');
  };

  // Manejador para el cambio de rol
  const handleRoleChange = async (userId, newFrontendRole) => {
    setError(null);
    const newBackendRole = frontendRoleToBackend[newFrontendRole]; // Convertir a "1", "2" o "3"
    if (!newBackendRole) {
        setError("Rol no válido seleccionado.");
        return;
    }

    try {
      const url = `${BACKEND_API_URL}/management/user/${userId}`; // <<-- userId (que es idusuario) en la URL
      console.log(`Intentando PUT para actualizar rol: ${url} con body:`, { role: newBackendRole });

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ role: newBackendRole }), // Solo enviar el campo role
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Error al actualizar rol: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      if (response.status !== 204) {
          await response.json();
      }
      
      setUsers(users.map(user =>
        user.id === userId ? { ...user, currentRole: newFrontendRole } : user
      ));
      alert(`Rol de ${userId} actualizado a ${newFrontendRole}.`);

    } catch (err) {
      console.error("Error updating user role:", err);
      setError(err.message);
    }
  };

  const handleSaveChanges = () => {
    alert('Grabar cambios aquí es solo para el estado local de esta vista si las actualizaciones son individuales.');
    console.log('Roles actuales en UI:', users);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: lightGreen,
        p: '20px',
      }}
    >
      {/* AppBar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderRadius: '8px',
          mb: '20px',
          flexShrink: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToUserManager}
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  color: primaryGreen,
                  '&:hover': {
                    bgcolor: lightGreen,
                  },
                }}
            >
              Volver
            </Button>
            <img src={securityIconAdmin} alt="Security Icon" style={{ width: '32px', height: '32px', ml: 1 }} />
            <Typography
              variant="h5"
              component="div"
              fontWeight="bold"
            >
              Security Risk Management Assistant - Panel User Manager
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ExitToAppIcon />}
            onClick={handleAdminLogout}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: primaryGreen,
              color: primaryGreen,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: lightGreen,
                borderColor: darkGreen,
              },
            }}
          >
            Cerrar Sesión Admin
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido principal de 2 columnas */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '250px 1fr',
          },
          gap: '20px',
        }}
      >
        {/* Columna Izquierda: Acciones (Solo para navegación dentro del panel de administrador) */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '8px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '400px',
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Acciones
          </Typography>
          <List disablePadding>
            <ListItemButton
              onClick={handleBackToUserManager}
              sx={{
                borderRadius: '4px',
                mb: 1,
                bgcolor: 'transparent',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              <ListItemText primary="Listar usuarios" />
            </ListItemButton>
            <ListItemButton
              sx={{
                borderRadius: '4px',
                mb: 1,
                bgcolor: lightGreen, // Resaltar "Asignar roles a usuario" en esta vista
                color: primaryGreen,
                '&:hover': {
                  bgcolor: lightGreen,
                },
              }}
            >
              <ListItemText primary="Asignar roles a usuario" />
            </ListItemButton>
          </List>
        </Paper>

        {/* Columna Derecha: Asignar Roles a Usuario */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '8px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress sx={{ color: primaryGreen }} />
              <Typography sx={{ ml: 2 }}>Cargando usuarios...</Typography>
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error: {error}
            </Alert>
          )}
          {!loading && !error && users.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No se encontraron usuarios para asignar roles.
            </Typography>
          )}
          {!loading && users.length > 0 && (
            <TableContainer component={Box} sx={{ flexGrow: 1, mb: 3 }}>
              <Table stickyHeader aria-label="assign roles table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                    {roles.map(role => (
                      <TableCell key={role} align="center" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {role}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      {roles.map(role => (
                        <TableCell key={role} align="center">
                          <IconButton
                            onClick={() => handleRoleChange(user.id, role)} // user.id es idusuario
                            color={user.currentRole === role ? 'primary' : 'default'}
                            sx={{ color: user.currentRole === role ? primaryGreen : 'text.disabled' }}
                          >
                            <AdjustIcon />
                          </IconButton>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto', pt: 2, borderTop: '1px solid #eee' }}>
            <Button
              variant="contained"
              onClick={handleSaveChanges}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                bgcolor: primaryGreen,
                '&:hover': {
                  bgcolor: darkGreen,
                },
                py: 1.5,
              }}
            >
              Grabar cambios
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default AssignRolesPanel;