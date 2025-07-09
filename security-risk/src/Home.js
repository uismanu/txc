// src/Home.js
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  useMediaQuery,
  useTheme,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Send as SendIcon } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useNavigate, useLocation } from 'react-router-dom'; // <<-- Importar useLocation

import securityIcon from './assets/security-icon.png';
import tecemLogo from './assets/tecem-logo.png';
import matrizDeRiesgoImage from './assets/matriz-de-riesgo1.jpg';

function Home() {
  const navigate = useNavigate();
  const location = useLocation(); // <<-- Usar useLocation para detectar cambios de ruta/estado
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // <<-- CAMBIO CLAVE AQUÍ: userToken y userRole se actualizan en useEffect -->>
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'guest');

  // <<-- NUEVOS ESTADOS PARA ADJUNTAR ARCHIVOS -->>
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Estado para el feedback de arrastrar y soltar
  const [isDragOver, setIsDragOver] = useState(false);
  // <<-- FIN NUEVOS ESTADOS -->>

  useEffect(() => {
    // Re-leer el token y el rol de localStorage cada vez que la URL (location) cambia,
    // o cuando el componente se monta por primera vez.
    const storedToken = localStorage.getItem('userToken');
    const storedRole = localStorage.getItem('userRole') || 'guest';

    if (!storedToken) {
      navigate('/login');
    } else {
      setUserToken(storedToken); // Asegurar que el estado userToken esté actualizado
      setUserRole(storedRole);   // Asegurar que el estado userRole esté actualizado

      // Nueva validación del rol con el backend
      const validateUserRole = async () => {
        const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
        const PROFILE_ENDPOINT = `${BACKEND_API_URL}/api/user/profile`;

        try {
          const response = await fetch(PROFILE_ENDPOINT, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`Error al validar el perfil: ${response.status} - ${errorData.message || 'Error desconocido'}`);
          }

          const data = await response.json();
          let backendRole = data.role; // Asume que el backend devuelve "role": "3" o similar
          if (data.rol && data.rol.codrol) {
            backendRole = data.rol.codrol; // Si el backend devuelve {"rol": {"codrol": "3", "rol": "Consultant"}}
          }

          const roleMapping = {
            "1": "standard",
            "2": "professional",
            "3": "consultant",
          };

          const mappedRole = roleMapping[backendRole] || 'guest';
          if (mappedRole !== storedRole) {
            localStorage.setItem('userRole', mappedRole);
            setUserRole(mappedRole);
          }
        } catch (error) {
          console.error('Error al validar el rol con el backend:', error);
          if (error.message.includes('401') || error.message.includes('403')) {
            // Token inválido o no autorizado, forzar logout
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
            navigate('/login');
          }
        }
      };

      validateUserRole();
    }
  }, [navigate, location]); // location como dependencia para re-evaluar al navegar al Home

  const isProfessionalOrConsultant = userRole === 'professional' || userRole === 'consultant';

  const showCreateProjectButton = isProfessionalOrConsultant;
  const showSavedProjects = isProfessionalOrConsultant;
  const showHotspotColumn = isProfessionalOrConsultant;
  const enableAddSimulationButton = isProfessionalOrConsultant;

  const showInterviewerAgent = userRole === 'standard';
  const showEvaluatorAgent = isProfessionalOrConsultant;

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

  const [projectsExpanded, setProjectsExpanded] = useState(isDesktop);

  const handleProjectsAccordionChange = (event, newExpanded) => {
    if (isDesktop) {
      setProjectsExpanded(true);
    } else {
      setProjectsExpanded(newExpanded);
    }
  };

  // Función para obtener URL firmada y subir archivo
  const getSignedUrlAndUploadFile = async (file) => {
    setIsUploadingFile(true);
    setUploadError(null);
    const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
    const GENERATE_UPLOAD_URL_ENDPOINT = `${BACKEND_API_URL}/api/storage/generate-upload-url`;

    const currentToken = localStorage.getItem('userToken');
    if (!currentToken) {
        setUploadError("No autenticado. Por favor, inicia sesión de nuevo.");
        setIsUploadingFile(false);
        navigate('/login');
        return null;
    }

    try {
      const response = await fetch(GENERATE_UPLOAD_URL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          file_name: file.name,
          content_type: file.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Error al obtener URL firmada: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const { signedUrl, publicUrl } = await response.json();

      if (!signedUrl || !publicUrl) {
          throw new Error("El backend no proporcionó URL firmada o pública válida.");
      }

      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Error al subir el archivo a Cloud Storage: ${uploadResponse.status} - ${uploadResponse.statusText}`);
      }

      setIsUploadingFile(false);
      return publicUrl; 
    } catch (error) {
      console.error('Error en la subida de archivo:', error);
      setUploadError(`Error al subir archivo: ${error.message}`);
      setIsUploadingFile(false);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() === '' && !selectedFile) return;

    const userMessageText = chatInput.trim();
    const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    const currentToken = localStorage.getItem('userToken');

    if (!currentToken) {
        console.error("Error: userToken no encontrado en localStorage al enviar mensaje.");
        setMessages(prevMessages => [...prevMessages, { id: newId + 1, type: 'agent', text: `Error: No autenticado. Por favor, inicia sesión de nuevo.` }]);
        navigate('/login');
        return;
    }

    let adjuntosData = [];
    let messageToDisplay = userMessageText;
    
    if (selectedFile) {
        if (isUploadingFile) {
            alert("Por favor espera a que el archivo termine de subirse.");
            return;
        }
        
        if (!userMessageText) {
            messageToDisplay = `Adjuntando archivo: ${selectedFile.name}`;
        }
        setMessages(prevMessages => [...prevMessages, { 
            id: newId, 
            type: 'user', 
            text: messageToDisplay,
            file: { name: selectedFile.name, status: 'pending' }
        }]);
        setChatInput('');

        const publicUrl = await getSignedUrlAndUploadFile(selectedFile);
        
        if (!publicUrl) {
            setMessages(prevMessages => prevMessages.map(msg => 
                msg.id === newId ? { ...msg, file: { ...msg.file, status: 'failed' }, text: `Error al adjuntar ${selectedFile.name}. ` + msg.text } : msg
            ));
            setSelectedFile(null);
            return;
        }

        const fileExtension = selectedFile.name.split('.').pop() || '';
        adjuntosData.push({
            nombre: selectedFile.name,
            extension: fileExtension,
            url: publicUrl
        });

        setMessages(prevMessages => prevMessages.map(msg => 
            msg.id === newId && msg.file ? { ...msg, file: { ...msg.file, url: publicUrl, status: 'success' } } : msg
        ));
        setSelectedFile(null);
    } else {
        setMessages(prevMessages => [...prevMessages, { id: newId, type: 'user', text: userMessageText }]);
        setChatInput('');
    }

    const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
    const AGENT_CHAT_ENDPOINT = `${BACKEND_API_URL}/agent/chat`; 

    try {
      const response = await fetch(AGENT_CHAT_ENDPOINT, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          idagente: "0",
          msg: userMessageText,
          adjuntos: adjuntosData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Error del servidor: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      const agentResponseText = data.response || "El agente no devolvió una respuesta.";

      setMessages(prevMessages => [...prevMessages, { id: newId + 1, type: 'agent', text: agentResponseText }]);

    } catch (error) {
      console.error("Error al comunicarse con el backend del agente:", error);
      setMessages(prevMessages => [...prevMessages, { id: newId + 1, type: 'agent', text: `Error: No se pudo conectar con el agente. (${error.message})` }]);
    }
  };

  const handleExportData = () => {
    alert('Simulando la descarga del informe en PDF...');
  };

  const handleAddSimulation = () => {
    alert('Simulando la adición de una simulación...');
    const newId = attachedFiles.length > 0 ? Math.max(...attachedFiles.map(m => m.id)) + 1 : 1;
    setAttachedFiles(prevFiles => [...prevFiles, { id: newId, name: `simulacion_generada_${newId}.xlsx` }]);
  };

  const handleUploadClick = () => {
    alert('Simulando la carga de un archivo para Información Adicional...');
    const newId = attachedFiles.length > 0 ? Math.max(...attachedFiles.map(m => m.id)) + 1 : 1;
    setAttachedFiles(prevFiles => [...prevFiles, { id: newId, name: `archivo_subido_${newId}.jpg` }]);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Re-leer el rol y los mensajes iniciales del agente cuando userRole o location cambian
  useEffect(() => {
    setProjectsExpanded(isDesktop);
    if (userRole === 'standard') {
      setMessages(interviewerMessages);
    } else if (userRole === 'professional' || userRole === 'consultant') { // Consolidado el rol aquí
      setMessages(evaluatorMessages);
    } else {
      setMessages([]); // Si es "guest" o no hay rol, no mostrar mensajes de agente
    }
  }, [isDesktop, userRole, interviewerMessages, evaluatorMessages]); // Añadir location.key si quisieras que el chat se reinicie en cada navegación a /

  // Funciones para selección de archivos y Drag & Drop
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

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
                border: isDragOver ? '2px dashed #1976d2' : 'none', // Estilo para drag over
              }}
              onDragOver={handleDragOver} // Evento drag over
              onDragLeave={handleDragLeave} // Evento drag leave
              onDrop={handleDrop} // Evento drop
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
                    {/* Visualización del archivo adjunto en el mensaje del chat */}
                    {message.file && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: '#e0e0e0', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DescriptionIcon fontSize="small" />
                            <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                                {message.file.name}
                            </Typography>
                            {message.file.status === 'pending' && <CircularProgress size={16} />}
                            {message.file.status === 'failed' && (
                                <Typography variant="caption" color="error">
                                    (Fallo)
                                </Typography>
                            )}
                            {message.file.status === 'success' && message.file.url && (
                                <Typography variant="caption" color="primary">
                                    (Subido)
                                </Typography>
                            )}
                        </Box>
                    )}
                  </Paper>
                  {message.type === 'user' && (
                    <Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: '#e0e0e0', flexShrink: 0 }}>
                      👤
                    </Avatar>
                  )}
                </Box>
              ))}
            </Box>

            {/* Previsualización del archivo seleccionado antes de enviar */}
            {selectedFile && (
                <Box sx={{ mt: 1, p: 1, bgcolor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon fontSize="small" />
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {selectedFile.name}
                        </Typography>
                        {isUploadingFile && <CircularProgress size={16} sx={{ ml: 1 }} />}
                        {uploadError && (
                            <Typography variant="body2" color="error" sx={{ ml: 1 }}>
                                {uploadError}
                            </Typography>
                        )}
                    </Box>
                    <IconButton size="small" onClick={handleRemoveSelectedFile} disabled={isUploadingFile}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}
            {/* Input de tipo file oculto */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

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
                // Añadir un adorno de entrada para el botón de adjuntar
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                disabled={isUploadingFile}
                            >
                                <UploadFileIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                sx={{ borderRadius: '8px', px: 3, height: '56px' }}
                disabled={isUploadingFile} // Deshabilitar enviar mientras se sube
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
                        <DescriptionIcon sx={{ color: 'text.secondary' }} />
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

        {/* Tercera columna para el gráfico de matriz de riesgo (solo para professional) */}
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
              Matriz de Riesgo
            </Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                overflow: 'hidden',
                mb: 2,
              }}
            >
              <img
                src={matrizDeRiesgoImage}
                alt="Matriz de Riesgo"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default Home;