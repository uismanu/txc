// src/UserManagerPanel.js
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
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useNavigate } from 'react-router-dom';

import securityIconAdmin from './assets/security-icon-admin.png';

function UserManagerPanel() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const primaryGreen = '#68ab2b';
  const lightGreen = '#e0f2d4';
  const darkGreen = '#528a22';

  const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

  // Mapeo de Roles y Status (Frontend a Backend y viceversa)
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

  const frontendStatusToBackend = {
    true: "A", // Activo
    false: "I", // Inactivo
  };

  const backendStatusToFrontend = {
    "A": true, // Activo
    "I": false, // Inactivo
  };

  // Función para obtener la lista de usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_API_URL}/management/user/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${adminToken}`, // Si fuera necesario, añadir token de admin aquí
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Error al listar usuarios: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      // <<-- CAMBIO CLAVE AQUÍ: Usar idusuario y mapear rol y estado -->>
      const mappedUsers = data.users.map(user => ({
        id: user.idusuario, // <<-- Usar idusuario como ID para la key de React y para las peticiones
        email: user.email,
        role: backendRoleToFrontend[user.rol.codrol] || user.rol.rol, // Mapear rol numérico a string
        creationDate: user.fecregistro,
        isActive: backendStatusToFrontend[user.estado] || false,
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
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

  const handleToggleUserStatus = async (userId, currentStatus) => {
    setError(null);
    try {
      const newBackendStatus = frontendStatusToBackend[!currentStatus]; // 'A' o 'I'
      const url = `${BACKEND_API_URL}/management/user/${userId}`; // <<-- userId (que es idusuario) en la URL
      console.log(`Intentando PUT para actualizar estado: ${url} con body:`, { status: newBackendStatus });

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newBackendStatus }), // Solo enviar el campo status
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Error al actualizar estado: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      if (response.status !== 204) {
          await response.json();
      }
      
      setUsers(users.map(user =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      ));
      alert(`Estado de ${userId} actualizado a ${newBackendStatus}.`);

    } catch (err) {
      console.error("Error toggling user status:", err);
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    setError(null);
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario con ID: ${userId}?`)) {
      return;
    }
    try {
      const url = `${BACKEND_API_URL}/management/user/${userId}`; // <<-- userId (que es idusuario) en la URL
      console.log(`Intentando DELETE para eliminar usuario: ${url}`);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Error al eliminar usuario: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      if (response.status !== 204) {
          await response.json();
      }
      
      setUsers(users.filter(user => user.id !== userId));
      alert(`Usuario ${userId} eliminado.`);

    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message);
    }
  };

  const handleSaveChanges = () => {
    alert('Grabar cambios aquí es solo para el estado local de esta vista si las actualizaciones son individuales.');
    console.log('Usuarios actuales en UI (no se envían todos aquí):', users);
  };

  const handleNavigateToAssignRoles = () => {
    navigate('/assign-roles');
  };

  const [activeAction, setActiveAction] = useState('listUsers');

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
        {/* Columna Izquierda: Acciones */}
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
              onClick={() => setActiveAction('listUsers')}
              sx={{
                borderRadius: '4px',
                mb: 1,
                bgcolor: activeAction === 'listUsers' ? lightGreen : 'transparent',
                color: activeAction === 'listUsers' ? primaryGreen : 'text.primary',
                '&:hover': {
                  bgcolor: activeAction === 'listUsers' ? lightGreen : '#f5f5f5',
                },
              }}
            >
              <ListItemText primary="Listar usuarios" />
            </ListItemButton>
            <ListItemButton
              onClick={handleNavigateToAssignRoles}
              sx={{
                borderRadius: '4px',
                mb: 1,
                bgcolor: activeAction === 'assignRoles' ? lightGreen : 'transparent',
                color: activeAction === 'assignRoles' ? primaryGreen : 'text.primary',
                '&:hover': {
                  bgcolor: activeAction === 'assignRoles' ? lightGreen : '#f5f5f5',
                },
              }}
            >
              <ListItemText primary="Asignar roles a usuario" />
            </ListItemButton>
          </List>
        </Paper>

        {/* Columna Derecha: Lista de Usuarios */}
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
              No se encontraron usuarios.
            </Typography>
          )}
          {!loading && users.length > 0 && (
            <TableContainer component={Box} sx={{ flexGrow: 1, mb: 3 }}>
              <Table stickyHeader aria-label="user list table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>EMAIL</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Creación</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tools</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.creationDate}</TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Typography variant="body2" sx={{ color: primaryGreen, fontWeight: 'bold' }}>
                            Activo
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="error" sx={{ fontWeight: 'bold' }}>
                            Inactivo
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color={user.isActive ? 'success' : 'default'}
                          onClick={() => handleToggleUserStatus(user.id, user.isActive)} // user.id es idusuario
                          sx={{ color: user.isActive ? primaryGreen : theme.palette.action.disabled }}
                        >
                          {user.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteUser(user.id)} // user.id es idusuario
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
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

export default UserManagerPanel;