// src/Home.js
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Send as SendIcon } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Importar el icono de Cerrar Sesión

import { useNavigate } from 'react-router-dom';

import securityIcon from './assets/security-icon.png';
import tecemLogo from './assets/tecem-logo.png';

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'guest');

  useEffect(() => {
    if (!localStorage.getItem('userRole')) {
      navigate('/login');
    }
  }, [navigate]);

  const showCreateProjectButton = userRole === 'professional';
  const showSavedProjects = userRole === 'professional';
  const showHotspotColumn = userRole === 'professional';
  const enableAddSimulationButton = userRole === 'professional';

  const projects = showSavedProjects ? [
    'Auditoría de Seguridad de Red',
    'Evaluación de Riesgos de Instalaciones',
    'Evaluación de Protección de Datos',
    'Revisión de Seguridad de la Cadena de Suministro',
  ] : [];

  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState([
    { id: 1, type: 'agent', text: '¡Hola! Soy el Asistente de Gestión de Riesgos de Seguridad. Ayudaré a evaluar amenazas y vulnerabilidades de seguridad. Por favor, proporcione una descripción general de su red.' },
    { id: 2, type: 'user', text: 'Nuestra red incluye firewalls y protocolos de cifrado.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [generatedOutputFile, setGeneratedOutputFile] = useState(null);

  const [sliderValue1, setSliderValue1] = useState(50);
  const [sliderValue2, setSliderValue2] = useState(50);

  const [projectsExpanded, setProjectsExpanded] = useState(isDesktop);

  const handleProjectsAccordionChange = (event, newExpanded) => {
    if (isDesktop) {
      setProjectsExpanded(true);
    } else {
      setProjectsExpanded(newExpanded);
    }
  };

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

  const handleUploadClick = () => {
    alert('Simulando la carga de un archivo...');
  };

  const handleSliderChange1 = (event, newValue) => {
    setSliderValue1(newValue);
  };

  const handleSliderChange2 = (event, newValue) => {
    setSliderValue2(newValue);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('userRole'); // Eliminar el rol del usuario
    navigate('/login'); // Redirigir a la página de login
  };

  useEffect(() => {
    setProjectsExpanded(isDesktop);
  }, [isDesktop]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', p: '20px', bgcolor: '#F0F2F5' }}>
      {/* HEADER */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* Contenedor para botones de acción */}
            {showCreateProjectButton && (
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
                  },
                  mr: 1, // Margen a la derecha para separar del botón de logout
                }}
              >
                Nuevo Proyecto
              </Button>
            )}
            {/* Botón de Cerrar Sesión */}
            <Button
              variant="outlined" // O "contained" si prefieres un estilo más prominente
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: '#e0e0e0', // Borde para el estilo outlined
                color: 'text.primary',  // Color del texto para el estilo outlined
                bgcolor: 'background.paper', // Fondo blanco para el estilo outlined
                '&:hover': {
                  bgcolor: '#f5f5f5', // Ligero cambio de fondo al pasar el mouse
                  borderColor: '#bdbdbd',
                },
                ml: 'auto', // Asegura que se alinee a la derecha si no hay otros botones
              }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* CONTENIDO PRINCIPAL DE HOME */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr',
            md: showHotspotColumn ? '250px 1fr 250px' : '250px 1fr',
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
              flexGrow: 1, // Esto hace que el acordeón ocupe el espacio restante
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
                {showSavedProjects ? (
                  projects.map((project, index) => (
                    <ListItemButton
                      key={index}
                      selected={index === 0}
                      onClick={() => {
                          if (index === 0) {
                              navigate('/project-analysis');
                          }
                      }}
                      sx={{
                        borderRadius: '4px',
                        mb: 1,
                        '&.Mui-selected': {
                          bgcolor: '#E3F2FD',
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: '#C1E0FA',
                          },
                        },
                        '&:hover': {
                          bgcolor: '#F5F5F5',
                        },
                      }}
                    >
                      <ListItemText primary={project} />
                    </ListItemButton>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    No hay proyectos disponibles para su nivel de usuario.
                  </Typography>
                )}
              </List>
            </AccordionDetails>
          </Accordion>
          {/* FIN ACORDEÓN DE PROYECTOS */}

          {/* Logo al final de la columna - AJUSTE DE POSICIÓN */}
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

        {/* CONTENEDOR FLEXIBLE PARA COLUMNA CENTRAL (Chat y Información Adicional apilados) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* PRIMER BOX DE LA COLUMNA CENTRAL: Interacción con el Agente y Chat */}
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

          {/* SEGUNDO BOX DE LA COLUMNA CENTRAL: Información Adicional */}
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
              Información Adicional
            </Typography>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2,
                flexShrink: 0,
            }}>
                <Button
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    onClick={handleUploadClick}
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
                    Upload
                </Button>

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
                        <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {generatedOutputFile}
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                        No se ha generado ningún archivo de salida.
                    </Typography>
                )}

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

                <Button
                    variant="outlined"
                    startIcon={<PlayArrowIcon />}
                    onClick={handleAddSimulation}
                    disabled={!enableAddSimulationButton}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        borderColor: '#e0e0e0',
                        color: 'text.primary',
                        opacity: enableAddSimulationButton ? 1 : 0.5,
                        cursor: enableAddSimulationButton ? 'pointer' : 'not-allowed',
                        '&:hover': {
                            borderColor: '#bdbdbd',
                            bgcolor: enableAddSimulationButton ? '#f5f5f5' : 'transparent',
                        },
                        flexShrink: 0
                    }}
                >
                    Agrega simulación
                </Button>
            </Box>
          </Paper>
        </Box>

        {/* Tercera columna para gráfico hotspot (solo para profesional) */}
        {showHotspotColumn && (
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
              Mapa de Calor de Riesgos
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                bgcolor: '#e0e0e0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                minHeight: '200px',
                color: 'text.secondary',
                fontSize: '1.2rem',
                textAlign: 'center',
              }}
            >
              [Gráfico Hotspot Aquí]
            </Box>
            <Typography variant="subtitle1" gutterBottom>
              Configuración Hotspot 1
            </Typography>
            <Slider
              value={sliderValue1}
              onChange={(_event, newValue) => setSliderValue1(newValue)}
              aria-labelledby="input-slider-1"
              valueLabelDisplay="auto"
              min={0}
              max={100}
              sx={{ mb: 3 }}
            />
            <Typography variant="subtitle1" gutterBottom>
              Configuración Hotspot 2
            </Typography>
            <Slider
              value={sliderValue2}
              onChange={(_event, newValue) => setSliderValue2(newValue)}
              aria-labelledby="input-slider-2"
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default Home;