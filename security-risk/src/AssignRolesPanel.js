// src/AssignRolesPanel.js
import React, { useState } from 'react';
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
  // useTheme, // <<-- ELIMINADO: 'theme' ya no se usa
} from '@mui/material';
import AdjustIcon from '@mui/icons-material/Adjust';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate } from 'react-router-dom';

import securityIconAdmin from './assets/security-icon-admin.png';

// Datos de demostración para la tabla de usuarios
const initialUsersForRoles = [
  { id: 1, email: 'correomuestra@gmail.com', role: 'standard' },
  { id: 2, email: 'profesional_user@tecem.com', role: 'professional' },
  { id: 3, email: 'consultor_ia@tecem.com', role: 'consultant' },
];

function AssignRolesPanel() {
  const navigate = useNavigate();
  // const theme = useTheme(); // <<-- ELIMINADA: 'theme' ya no se usa

  const [users, setUsers] = useState(initialUsersForRoles.map(user => ({ ...user, currentRole: user.role })));

  const primaryGreen = '#68ab2b';
  const lightGreen = '#e0f2d4';
  const darkGreen = '#528a22';

  const handleAdminLogout = () => {
    localStorage.removeItem('adminRole');
    navigate('/admin-login');
  };

  const handleBackToUserManager = () => {
    navigate('/user-manager');
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, currentRole: newRole } : user
    ));
  };

  const handleSaveChanges = () => {
    alert('Simulando guardar cambios de roles de usuarios.');
    console.log('Roles asignados:', users.map(u => ({ id: u.id, email: u.email, role: u.currentRole })));
    navigate('/user-manager');
  };

  const roles = ['standard', 'professional', 'consultant'];

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
          {/* Sección izquierda del AppBar: Icono y Título */}
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
          {/* Sección derecha del AppBar: Botón Volver y Cerrar Sesión Admin */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToUserManager}
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
                  mr: 1,
                }}
            >
              Volver
            </Button>
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
          </Box>
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
                bgcolor: lightGreen,
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
                          onClick={() => handleRoleChange(user.id, role)}
                          color={user.currentRole === role ? 'primary' : 'default'}
                          // Aquí, si necesitas acceder al tema (theme.palette.action.disabled),
                          // entonces sí necesitarías usar el hook useTheme().
                          // Por ahora, como primaryGreen y text.disabled son valores directos,
                          // no es estrictamente necesario, pero si se necesitan colores de la paleta,
                          // useTheme sería necesario.
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