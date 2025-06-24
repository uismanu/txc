// src/UserManagerPanel.js
import React, { useState, useEffect } from 'react'; // <<-- Añadir useEffect
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
} from '@mui/material';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useNavigate } from 'react-router-dom';

import securityIconAdmin from './assets/security-icon-admin.png';

// Datos de demostración para la tabla de usuarios
const initialUsers = [
  { id: 1, email: 'correomuestra@gmail.com', role: 'standard', creationDate: '23/06/2025', isActive: true },
  { id: 2, email: 'profesional_user@tecem.com', role: 'professional', creationDate: '20/05/2025', isActive: false },
  { id: 3, email: 'consultor_ia@tecem.com', role: 'consultant', creationDate: '15/04/2025', isActive: true },
];

function UserManagerPanel() {
  const navigate = useNavigate();
  const theme = useTheme();
  // El estado 'users' ahora no necesita 'currentRole' aquí, solo en AssignRolesPanel
  const [users, setUsers] = useState(initialUsers);

  const primaryGreen = '#68ab2b';
  const lightGreen = '#e0f2d4';
  const darkGreen = '#528a22';

  const handleAdminLogout = () => {
    localStorage.removeItem('adminRole');
    navigate('/admin-login');
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
    alert(`Simulando cambio de estado para usuario con ID: ${userId}`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario con ID: ${userId}?`)) {
      setUsers(users.filter(user => user.id !== userId));
      alert(`Usuario con ID: ${userId} eliminado.`);
    }
  };

  const handleSaveChanges = () => {
    alert('Simulando guardar cambios de usuarios.');
    console.log('Usuarios actuales:', users);
  };

  // Nueva función para navegar a la página de asignación de roles
  const handleNavigateToAssignRoles = () => {
    navigate('/assign-roles'); // <<-- Navegar a la nueva ruta
  };

  // Para asegurar que la opción "Listar usuarios" esté siempre activa en este panel
  const [activeAction, setActiveAction] = useState('listUsers'); // Mantenemos un estado para resaltar la acción activa

  // useEffect para manejar el resaltado del menú si la URL cambia (aunque aquí lo controlamos por clic)
  useEffect(() => {
    // Si la URL fuera dinámica, podrías usar useLocation aquí para ajustar activeAction
  }, []);


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
              onClick={() => setActiveAction('listUsers')} // Para resaltar visualmente
              sx={{
                borderRadius: '4px',
                mb: 1,
                bgcolor: activeAction === 'listUsers' ? lightGreen : 'transparent', // Resaltar si está activo
                color: activeAction === 'listUsers' ? primaryGreen : 'text.primary',
                '&:hover': {
                  bgcolor: activeAction === 'listUsers' ? lightGreen : '#f5f5f5',
                },
              }}
            >
              <ListItemText primary="Listar usuarios" />
            </ListItemButton>
            <ListItemButton
              onClick={handleNavigateToAssignRoles} // <<-- Navegar a la nueva página
              sx={{
                borderRadius: '4px',
                mb: 1,
                bgcolor: activeAction === 'assignRoles' ? lightGreen : 'transparent', // Resaltar si está activo (en esta vista no se activará)
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

        {/* Columna Derecha: Lista de Usuarios (Fija en este panel) */}
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
          {/* Contenido de la vista de Listar usuarios */}
          <TableContainer component={Box} sx={{ flexGrow: 1, mb: 3 }}>
            <Table stickyHeader aria-label="user list table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>EMAIL</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Creación</TableCell>
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
                      <IconButton
                        color={user.isActive ? 'success' : 'default'}
                        onClick={() => handleToggleUserStatus(user.id)}
                        sx={{ color: user.isActive ? primaryGreen : theme.palette.action.disabled }}
                      >
                        {user.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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