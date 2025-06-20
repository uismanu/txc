// src/Home.js
import React, { useState, useEffect, useMemo } from 'react';
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
  Slider, // Necesario para los sliders en Home (si se reintroducen)
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
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useNavigate } from 'react-router-dom';

import securityIcon from './assets/security-icon.png';
import tecemLogo from './assets/tecem-logo.png';

const getRiskColor = (probability, impact) => {
  const combinedRiskForHue = (probability + impact) / 2;
  const hue = (100 - combinedRiskForHue) * 1.2;

  const saturation = 50 + (impact * 0.5);
  const lightness = 60 - (impact * 0.2);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [userRole] = useState(localStorage.getItem('userRole') || 'guest');

  useEffect(() => {
    if (!localStorage.getItem('userRole')) {
      navigate('/login');
    }
  }, [navigate]);

  const showCreateProjectButton = userRole === 'professional';
  const showSavedProjects = userRole === 'professional';
  const showHotspotColumn = userRole === 'professional'; // <<-- RE-ACTIVADA esta variable
  const enableAddSimulationButton = userRole === 'professional';

  const showInterviewerAgent = userRole === 'standard';
  const showEvaluatorAgent = userRole === 'professional';

  const projects = showSavedProjects ? [
    'Auditoría de Seguridad de Red',
    'Evaluación de Riesgos de Instalaciones',
    'Evaluación de Protección de Datos',
    'Revisión de Seguridad de la Cadena de Suministro',
  ] : [];

  const interviewerMessages = useMemo(() => [
    { id: 1, type: 'agent', text: '¡Hola! Soy el Asistente de Gestión de Riesgos de Seguridad. Ayudaré a evaluar amenazas y vulnerabilidades de seguridad. Por favor, proporcione una descripción general de su red.' },
    { id: 2, type: 'user', text: 'Nuestra red incluye firewalls y protocolos de cifrado.' },
  ], []);

  const evaluatorMessages = useMemo(() => [
    { id: 1, type: 'agent', text: '¡Hola! Soy el Agente Evaluador. Estoy listo para analizar los riesgos. ¿Hay algún informe o datos específicos que le gustaría que revise?' },
    { id: 2, type: 'user', text: 'Sí, revisa el informe de auditoría reciente.' },
  ], []);

  const [messages, setMessages] = useState([]);

  const [chatInput, setChatInput] = useState('');

  const [attachedFiles, setAttachedFiles] = useState([
    { id: 1, name: 'documento_adjunto_1.pdf' },
    { id: 2, name: 'imagen_de_red.png' },
  ]);

  // Mantener los estados de los sliders para perfilar la pregunta, aunque no controlen el gráfico
  const [probabilitySliderValue, setProbabilitySliderValue] = useState(50);
  const [impactSliderValue, setImpactSliderValue] = useState(50);

  const [projectsExpanded, setProjectsExpanded] = useState(isDesktop);

  // Variables para el SVG (ahora vuelven a ser necesarias si se muestra la columna)
  const svgWidth = 220;
  const svgHeight = 220;
  const svgCenterX = svgWidth / 2;
  const svgCenterY = svgHeight / 2;
  const baseRadius = 20;
  const maxRadiusIncrease = 70;
  const maxRadius = baseRadius + maxRadiusIncrease; // Definido correctamente

  const handleProjectsAccordionChange = (event, newExpanded) => {
    if (isDesktop) {
      setProjectsExpanded(true);
    } else {
      setProjectsExpanded(newExpanded);
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;
    const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    setMessages([...messages, { id: newId, type: 'user', text: chatInput.trim() }]);
    setChatInput('');
  };

  const handleExportData = () => {
    alert('Simulando la descarga del informe en PDF...');
  };

  const handleAddSimulation = () => {
    alert('Simulando la adición de una simulación...');
    const newFileId = attachedFiles.length > 0 ? Math.max(...attachedFiles.map(f => f.id)) + 1 : 1;
    setAttachedFiles([...attachedFiles, { id: newFileId, name: `simulacion_generada_${newFileId}.xlsx` }]);
  };

  const handleUploadClick = () => {
    alert('Simulando la carga de un archivo...');
    const newFileId = attachedFiles.length > 0 ? Math.max(...attachedFiles.map(f => f.id)) + 1 : 1;
    setAttachedFiles([...attachedFiles, { id: newFileId, name: `archivo_subido_${newFileId}.jpg` }]);
  };

  // Manejadores de sliders
  const handleProbabilitySliderChange = (event, newValue) => {
    setProbabilitySliderValue(newValue);
  };

  const handleImpactSliderChange = (event, newValue) => {
    setImpactSliderValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  useEffect(() => {
    setProjectsExpanded(isDesktop);
    if (userRole === 'standard') {
      setMessages(interviewerMessages);
    } else if (userRole === 'professional') {
      setMessages(evaluatorMessages);
    }
  }, [isDesktop, userRole, interviewerMessages, evaluatorMessages]);

  // Cálculos para el SVG (volverán a ser relevantes si la columna existe)
  const staticProbabilityForGraph = 60; // Valores fijos para el gráfico
  const staticImpactForGraph = 75;

  const graphPolygonRadius = baseRadius + (staticProbabilityForGraph / 100) * maxRadiusIncrease;

  const points = [];
  const numPoints = 5;
  const angleIncrement = (2 * Math.PI) / numPoints;

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleIncrement - Math.PI / 2;
    const x = svgCenterX + graphPolygonRadius * Math.cos(angle);
    const y = svgCenterY + graphPolygonRadius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  const polygonPoints = points.join(' ');

  const polygonColor = getRiskColor(staticProbabilityForGraph, staticImpactForGraph);

  const averageRisk = (staticProbabilityForGraph + staticImpactForGraph) / 2;


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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showCreateProjectButton && ( // <<-- Botón "Nuevo Proyecto" condicional
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
                  mr: 1,
                }}
              >
                Nuevo Proyecto
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: '#e0e0e0',
                color: 'text.primary',
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  borderColor: '#bdbdbd',
                },
                ml: 'auto',
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
          // <<-- RE-ACTIVADA la lógica de 3 columnas para professional -->>
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr',
            md: showHotspotColumn ? '250px 1fr 250px' : '250px 1fr', // 3 columnas si es profesional, 2 si es standard
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
              pb: '100px',
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

          {/* Logo al final de la columna - Posición ajustada */}
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

            {/* Pestañas de Agente (Condicional según rol) */}
            {showInterviewerAgent && (
              <Tabs value={0} onChange={() => {}} indicatorColor="primary" textColor="primary"
                    sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Tab label="Entrevistador" />
              </Tabs>
            )}
            {showEvaluatorAgent && (
              <Tabs value={0} onChange={() => {}} indicatorColor="primary" textColor="primary"
                    sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Tab label="Evaluador" />
              </Tabs>
            )}

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
                margin="normal"
                label="Escribe tu mensaje..."
                variant="outlined"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                sx={{ mb: 0, '& fieldset': { borderRadius: '8px' } }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                sx={{ borderRadius: '8px', px: 3, height: '56px' }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Paper>

          {/* SEGUNDO BOX DE LA COLUMNA CENTRAL: Información Adicional - REESTRUCTURADA */}
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

            {/* Sub-sección 1: Archivos y Upload */}
            <Box sx={{ mb: 3, flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Archivos
              </Typography>
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
                      mb: 2,
                  }}
              >
                  Upload
              </Button>
              <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
                {attachedFiles.length > 0 ? (
                  <List dense disablePadding>
                    {attachedFiles.map((file) => (
                      <ListItemButton
                        key={file.id}
                        sx={{
                          borderRadius: '4px',
                          mb: 0.5,
                          bgcolor: '#f5f5f5',
                          '&:hover': { bgcolor: '#ebebeb' },
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <DescriptionIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
                        <ListItemText primary={file.name} sx={{ flexGrow: 1 }} />
                      </ListItemButton>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No se han adjuntado archivos.
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Sub-sección 2: Acciones (Exportar y Simular) */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                pt: 2,
                borderTop: '1px solid #eee',
            }}>
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
                        flexGrow: 1,
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

        {/* Tercera columna para gráfico hotspot (solo para professional) */}
        {showHotspotColumn && ( // <<-- RE-ACTIVADO el renderizado condicional de la tercera columna
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
              Análisis de Riesgo
            </Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 3,
              }}
            >
              {/* SVG para simular el gráfico vectorial dinámico */}
              <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                {/* Círculos de fondo para simular un radar */}
                <circle cx={svgCenterX} cy={svgCenterY} r={maxRadius * 0.4} stroke="#ccc" fill="none" />
                <circle cx={svgCenterX} cy={svgCenterY} r={maxRadius * 0.7} stroke="#ccc" fill="none" />
                <circle cx={svgCenterX} cy={svgCenterY} r={maxRadius} stroke="#ccc" fill="none" />

                {/* Líneas desde el centro a los vértices (ejes) */}
                {Array.from({ length: numPoints }).map((_, i) => {
                  const angle = i * angleIncrement - Math.PI / 2;
                  const x = svgCenterX + maxRadius * Math.cos(angle);
                  const y = svgCenterY + maxRadius * Math.sin(angle);
                  return (
                    <line
                      key={`line-${i}`}
                      x1={svgCenterX}
                      y1={svgCenterY}
                      x2={x}
                      y2={y}
                      stroke="#ccc"
                    />
                  );
                })}

                {/* Polígono de riesgo - AHORA CON VALORES ESTÁTICOS */}
                <polygon
                  points={polygonPoints}
                  fill={polygonColor}
                  fillOpacity="0.7"
                  stroke={polygonColor}
                  strokeWidth="2"
                />

                {/* Texto central para el valor de riesgo */}
                <text
                  x={svgCenterX}
                  y={svgCenterY + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Riesgo: {averageRisk.toFixed(0)}%
                </text>
              </svg>
            </Box>
            {/* Deslizadores - Ahora solo sirven para perfilar la pregunta, no para el gráfico */}
            <Typography variant="subtitle1" gutterBottom>
              Probabilidad
            </Typography>
            <Slider
              value={probabilitySliderValue}
              onChange={handleProbabilitySliderChange}
              aria-labelledby="input-slider-probabilidad"
              valueLabelDisplay="auto"
              min={0}
              max={100}
              sx={{ mb: 3 }}
            />
            <Typography variant="subtitle1" gutterBottom>
              Impacto
            </Typography>
            <Slider
              value={impactSliderValue}
              onChange={handleImpactSliderChange}
              aria-labelledby="input-slider-impacto"
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