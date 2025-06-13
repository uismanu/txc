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
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete'; // Necesario para los archivos adjuntos
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Importar tu icono personalizado para el header
import securityIcon from './assets/security-icon.png';

// Importar tu logo de Tecem
import tecemLogo from './assets/tecem-logo.png';

function App() {
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

  const [attachedFiles, setAttachedFiles] = useState([
    'informe_inicial.pdf',
    'diagrama_de_red.png',
    'evaluacion_de_amenazas.docx',
  ]);

  // ESTADO PARA EL ÚNICO ARCHIVO DE SALIDA GENERADO
  const [generatedOutputFile, setGeneratedOutputFile] = useState(null); // Inicialmente no hay archivo

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;

    const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    setMessages([...messages, { id: newId, type: 'user', text: chatInput.trim() }]);
    setChatInput('');
  };

  const handleUploadDocument = () => {
    const newFileName = `documento_adjunto_${Date.now()}.pdf`;
    setAttachedFiles(prevFiles => [...prevFiles, newFileName]);
    alert(`Archivo "${newFileName}" adjuntado (simulado).`);
  };

  const handleExportData = () => {
    alert('Simulando la exportación de datos del chat...');
    // Cuando se exporta, se "genera" un archivo de salida
    setGeneratedOutputFile('reporte_exportado_final.pdf'); // Nombre de archivo de ejemplo
  };

  const handleAddSimulation = () => {
    alert('Simulando la adición de una simulación...');
    // Cuando se agrega una simulación, se "genera" otro archivo de salida
    setGeneratedOutputFile('resultados_simulacion.xlsx'); // Nombre de archivo de ejemplo
  };

  // Esta función es solo para los archivos adjuntos, no para el archivo de salida
  const handleDeleteFile = (fileNameToDelete) => {
    setAttachedFiles(prevFiles => prevFiles.filter(file => file !== fileNameToDelete));
    alert(`Archivo "${fileNameToDelete}" eliminado.`);
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


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      p: '20px',
      bgcolor: '#F0F2F5',
    }}>
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
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

      {/* CONTENEDOR DE COLUMNAS */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr',
            md: '250px 1fr 1fr',
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
                          bgcolor: '#C1E0FA', // <<-- ¡Comilla de cierre corregida aquí!
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

        {/* Columna Central: Interacción con el Agente y Chat */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '8px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: '300px', md: '0' },
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

        {/* COLUMNA DERECHA: Fuentes Adicionales y Datos de Salida (MODIFICADA) */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '8px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: 'auto', md: '0' },
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom sx={{ flexShrink: 0 }}>
            Fuentes adicionales
          </Typography>

          <Box sx={{ mb: 2, flexShrink: 0 }}>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              fullWidth
              onClick={handleUploadDocument}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: '#e0e0e0',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#bdbdbd',
                  bgcolor: '#f5f5f5',
                }
              }}
            >
              Subir documento
            </Button>
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, flexShrink: 0 }}>
            Archivos Adjuntos
          </Typography>
          {attachedFiles.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexShrink: 0 }}>
              No hay archivos adjuntos.
            </Typography>
            ) : (
            <List dense disablePadding sx={{ mb: 2, flexShrink: 0 }}>
              {attachedFiles.map((file, index) => (
                <ListItemButton key={index} sx={{ borderRadius: '4px', mb: 0.5, pr: 1 }}>
                  <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', flexShrink: 0 }} />
                  <ListItemText primary={file} sx={{ flexGrow: 1 }} />
                  {/* El botón de borrar SÍ está aquí, porque es para archivos adjuntos */}
                  <IconButton edge="end" aria-label="eliminar archivo adjunto" onClick={() => handleDeleteFile(file)} size="small" sx={{ flexShrink: 0 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          )}

          <Divider sx={{ my: 2, flexShrink: 0 }} />

          <Typography variant="h6" component="h2" gutterBottom sx={{ flexShrink: 0 }}>
            Datos de Salida
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexShrink: 0 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              fullWidth
              onClick={handleExportData}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: '#e0e0e0',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#bdbdbd',
                  bgcolor: '#f5f5f5',
                }
              }}
            >
              Exportar
            </Button>
            <Button
              variant="outlined"
              startIcon={<PlayArrowIcon />}
              fullWidth
              onClick={handleAddSimulation}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: '#e0e0e0',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#bdbdbd',
                  bgcolor: '#f5f5f5',
                }
              }}
            >
              Agrega simulación
            </Button>
          </Box>

          {/* Sección para mostrar el único archivo de salida generado SIN ICONO DE BORRAR */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, flexShrink: 0 }}>
            Último Archivo Generado
          </Typography>
          {generatedOutputFile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, p: 1, borderRadius: '4px', bgcolor: '#f0f0f0' }}>
              <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {generatedOutputFile}
              </Typography>
              {/* ¡AQUÍ NO HAY ICONO DE BORRAR! */}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
              No se ha generado ningún archivo de salida.
            </Typography>
          )}

        </Paper>
      </Box>
    </Box>
  );
}

export default App;