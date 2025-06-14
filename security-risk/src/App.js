// src/App.js (REVERTIDO A LA VERSIÓN ANTERIOR + CORRECCIÓN DE UN DETALLE)
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  Avatar,
  TextField,
  // Divider, // Puedes quitarlo si no lo usas
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import securityIcon from './assets/security-icon.png';
import tecemLogo from './assets/tecem-logo.png';
import CrearProject from './crear_project';
import Login from './Login';

// Componente principal que contiene el diseño de la barra superior y las rutas
function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation(); // Sigue siendo útil aquí para el isLoginPage check del AppBar

  const projects = [
    'Auditoría de Seguridad de Red',
    'Evaluación de Riesgos de Instalaciones',
    'Evaluación de Protección de Datos',
    'Revisión de Seguridad de la Cadena de Suministro',
  ];

  const [activeTab, setActiveTab] = useState(0);

  const [messages, setMessages] = useState([
    { id: 1, type: 'agent', text: '¡Hola! Soy el Asistente de Gestión de Riesgos de Seguridad. Ayudaré a evaluar amenazas y vulnerabilidades de seguridad. Por favor, proporcione una descripción general de su red.' },
    { id: 2, type: 'user', text: 'Nuestra red incluye firewalls y protocolos de cifrado.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const [generatedOutputFile, setGeneratedOutputFile] = useState(null);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;

    const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    setMessages([...messages, { id: newId, type: 'user', text: chatInput.trim() }]);
    setChatInput('');
  };

  const handleExportData = () => {
    alert('Simulando la exportación de datos del chat...');
    setGeneratedOutputFile('informe_analisis_total.pdf');
  };

  const handleAddSimulation = () => {
    alert('Simulando la adición de una simulación...');
    setGeneratedOutputFile('resultados_simulacion_detallados.xlsx');
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [projectsExpanded, setProjectsExpanded] = useState(isDesktop);

  const handleProjectsAccordionChange = (event, newExpanded) => {
    if (isDesktop) {
      setProjectsExpanded(true);
    } else {
      setProjectsExpanded(newExpanded);
    }
  };

  useEffect(() => {
    setProjectsExpanded(isDesktop);
  }, [isDesktop]);

  // Determinar si la ruta actual es la página de login
  const isLoginPage = location.pathname === '/login';
  const isCreateProjectPage = location.pathname === '/create-project'; // <<-- NUEVA VERIFICACIÓN

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      p: (isLoginPage || isCreateProjectPage) ? 0 : '20px', // <<-- AJUSTE AQUÍ
      bgcolor: '#F0F2F5',
    }}>
      {/* HEADER - SOLO SE MUESTRA SI NO ES LA PÁGINA DE LOGIN NI CREAR PROYECTO (si no lo tiene incorporado) */}
      {(!isLoginPage && !isCreateProjectPage) && ( // <<-- AJUSTE AQUÍ: NO MOSTRAR EL HEADER EN CREAR_PROJECT TAMPOCO
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
              <img src={securityIcon} alt="Security Icon" style={{ width: '32px', height: '32px' }} />
              <Typography
                variant="h5"
                component="div"
                fontWeight="bold"
              >
                Asistente de Gestión de Riesgos de Seguridad
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create-project')}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0',
                }
              }}
            >
              Nuevo Proyecto
            </Button>
          </Toolbar>
        </AppBar>
      )}

      {/* CONTENIDO DE LA PÁGINA ACTUAL BASADO EN LA RUTA */}
      <Routes>
        {/* Ruta para la página de Login (sin MainLayout ni AppBar) */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para la nueva página de creación de proyecto (sin MainLayout ni AppBar, por ahora) */}
        <Route path="/create-project" element={<CrearProject />} /> {/* <<-- SE QUEDA ASÍ POR AHORA */}

        {/* Ruta para la página principal (App.js con el chat) */}
        {/* Solo se renderiza si NO es la página de Login ni Crear Project */}
        <Route path="/" element={
          (!isLoginPage && !isCreateProjectPage) && ( // <<-- CONDICIÓN PARA NO RENDERIZAR EN EL LOGIN O CREAR_PROJECT
            <Box
              sx={{
                flexGrow: 1,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr',
                  md: '250px 1fr',
                },
                gap: '20px',
              }}
            >
              {/* Columna Izquierda: Proyectos (AHORA CON ACORDEÓN) y Logo */}
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '8px',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: { xs: 'auto', md: '0' },
                }}
              >
                {/* INICIO ACORDEÓN DE PROYECTOS */}
                <Accordion
                  expanded={projectsExpanded}
                  onChange={handleProjectsAccordionChange}
                  disableGutters
                  elevation={0}
                  sx={{
                    bgcolor: 'transparent',
                    flexGrow: 1,
                    overflowY: 'auto',
                    '&.Mui-expanded': {
                      margin: 0,
                    },
                    '&::before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={!isDesktop ? <ExpandMoreIcon /> : null}
                    aria-controls="projects-content"
                    id="projects-header"
                    sx={{
                      minHeight: '48px',
                      '&.Mui-expanded': {
                        minHeight: '48px',
                      },
                      px: 0,
                      mb: 2,
                      '& .MuiAccordionSummary-expandIconWrapper': {
                        display: isDesktop ? 'none' : 'block',
                      }
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Proyectos
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0, overflowY: 'auto' }}>
                    <List disablePadding>
                      {projects.map((project, index) => (
                        <ListItemButton
                          key={index}
                          selected={index === 0}
                          sx={{
                            borderRadius: '4px',
                            mb: 1,
                            '&.Mui-selected': {
                              bgcolor: '#E3F2FD',
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: '#C1E0FA,',
                              },
                            },
                            '&:hover': {
                              bgcolor: '#F5F5F5',
                            },
                          }}
                        >
                          <ListItemText primary={project} />
                        </ListItemButton>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
                {/* FIN ACORDEÓN DE PROYECTOS */}

                {/* Logo al final de la columna */}
                <Box sx={{ textAlign: 'center', mt: 4, flexShrink: 0 }}>
                  <img
                    src={tecemLogo}
                    alt="Tecem Sempie Solutions Logo"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: '200px',
                    }}
                  />
                </Box>
              </Paper>

              {/* CONTENEDOR FLEXIBLE PARA COLUMNA DERECHA (Chat y Datos de Salida apilados) */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* PRIMER BOX DE LA COLUMNA DERECHA: Interacción con el Agente y Chat */}
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: { xs: '300px', md: '0' },
                    flexGrow: 1,
                  }}
                >
                  <Typography variant="h6" component="h2" gutterBottom sx={{ flexShrink: 0 }}>
                    Interacción con el Agente
                  </Typography>

                  {/* Pestañas de Agente (SOLO DOS) */}
                  <Tabs value={activeTab} onChange={handleChangeTab} indicatorColor="primary" textColor="primary"
                        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                    <Tab label="Entrevistador" />
                    <Tab label="Evaluador" />
                  </Tabs>

                  <Box
                    sx={{
                      flexGrow: 1,
                      overflowY: 'auto',
                      p: 2,
                      bgcolor: '#FBFBFB',
                      borderRadius: '4px',
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    {messages.map((message) => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                          alignItems: 'flex-start',
                        }}
                      >
                        {message.type === 'agent' && (
                          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#e0e0e0', flexShrink: 0 }}>
                            🤖
                          </Avatar>
                        )}
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            maxWidth: '70%',
                            bgcolor: message.type === 'user' ? '#1976d2' : '#ffffff',
                            color: message.type === 'user' ? '#ffffff' : '#000000',
                            borderColor: message.type === 'user' ? '#1976d2' : '#e0e0e0',
                            borderBottomLeftRadius: message.type === 'user' ? '12px' : '0px',
                            borderBottomRightRadius: message.type === 'user' ? '0px' : '12px',
                          }}
                        >
                          <Typography variant="body2">
                            {message.text}
                          </Typography>
                        </Paper>
                        {message.type === 'user' && (
                          <Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: '#e0e0e0', flexShrink: 0 }}>
                            👤
                          </Avatar>
                        )}
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto', flexShrink: 0 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Escribe tu mensaje..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      sx={{ '& fieldset': { borderRadius: '8px' } }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      sx={{ borderRadius: '8px', px: 3 }}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
                </Paper>

                {/* SEGUNDO BOX DE LA COLUMNA DERECHA: Datos de Salida (AHORA SEPARADO) */}
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="h6" component="h2" gutterBottom sx={{ flexShrink: 0 }}>
                    Datos de Salida
                  </Typography>

                  <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 2,
                      mb: 2,
                      flexShrink: 0,
                  }}>
                      {/* 1. Sección del archivo de salida (primero) */}
                      {generatedOutputFile ? (
                          <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 1,
                              borderRadius: '4px',
                              bgcolor: '#f0f0f0',
                              flexShrink: 0,
                              minWidth: 'fit-content',
                          }}>
                              <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', flexShrink: 0 }} />
                              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                  {generatedOutputFile}
                              </Typography>
                          </Box>
                      ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                              No se ha generado ningún archivo de salida.
                          </Typography>
                      )}

                      {/* 2. Botón "Exportar" */}
                      <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          onClick={handleExportData}
                          sx={{
                              textTransform: 'none',
                              borderRadius: '8px',
                              borderColor: '#e0e0e0',
                              color: 'text.primary',
                              '&:hover': {
                                  borderColor: '#bdbdbd',
                                  bgcolor: '#f5f5f5',
                              },
                              flexShrink: 0
                          }}
                      >
                          Exportar
                      </Button>

                      {/* 3. Botón "Agrega simulación" */}
                      <Button
                          variant="outlined"
                          startIcon={<PlayArrowIcon />}
                          onClick={handleAddSimulation}
                          sx={{
                              textTransform: 'none',
                              borderRadius: '8px',
                              borderColor: '#e0e0e0',
                              color: 'text.primary',
                              '&:hover': {
                                  borderColor: '#bdbdbd',
                                  bgcolor: '#f5f5f5',
                              },
                              flexShrink: 0
                          }}
                      >
                          Agrega simulación
                      </Button>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )
        } />
      </Routes>
    </Box>
  );
}

// Wrapper para BrowserRouter
function App() {
  return (
    <Router>
      <MainLayout /> {/* <<-- MainLayout ahora contiene las Routes */}
    </Router>
  );
}

export default App;