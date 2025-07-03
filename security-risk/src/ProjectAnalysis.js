// src/ProjectAnalysis.js
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
  // LinearProgress, // Eliminado: ya no se usa
  TextField,
  Avatar,
  // useMediaQuery, // Eliminado: ya no se usa
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import SecurityIcon from '@mui/icons-material/Security'; // Eliminado: ya no se usa
import { Send as SendIcon } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

import securityIcon from './assets/security-icon.png';
import grafDemo2 from './assets/graf-demo2.jpg';
import grafDemo3 from './assets/graf-demo3.jpg';
import grafDemo4 from './assets/graf-demo4.jpg'; // <<-- CORREGIDO: graf-demo4.jpg
import grafDemo5 from './assets/graf-demo5.jpg';

// Datos de demostración para las simulaciones
const simulationData = [
  {
    id: 'sim-1',
    name: 'Simulación Inicial',
    date: '2025-06-10',
    charts: [
      { id: 'chart1', title: 'Riesgo de Phishing', risk: 15, image: grafDemo2 },
      { id: 'chart2', title: 'Vulnerabilidad de Servidor', risk: 40, image: grafDemo3 },
      { id: 'chart3', title: 'Riesgo de Malware', risk: 70, image: grafDemo4 },
      { id: 'chart4', title: 'Fuga de Datos Interna', risk: 85, image: grafDemo5 },
    ],
  },
  {
    id: 'sim-2',
    name: 'Simulación Post-Parches',
    date: '2025-06-12',
    charts: [
      { id: 'chart1', title: 'Riesgo de Firewall', risk: 10, image: grafDemo3 },
      { id: 'chart2', title: 'Configuración Insegura', risk: 25, image: grafDemo2 },
      { id: 'chart3', title: 'Acceso No Autorizado', risk: 55, image: grafDemo5 },
      { id: 'chart4', title: 'Análisis de Red', risk: 65, image: grafDemo4 },
    ],
  },
  {
    id: 'sim-3',
    name: 'Simulación Semanal',
    date: '2025-06-15',
    charts: [
      { id: 'chart1', title: 'Ataques Web', risk: 5, image: grafDemo4 },
      { id: 'chart2', title: 'Conexiones Maliciosas', risk: 18, image: grafDemo5 },
      { id: 'chart3', title: 'Ingeniería Social', risk: 45, image: grafDemo2 },
    ],
  },
];

const getRiskLevel = (riskPercentage) => {
  if (riskPercentage <= 25) return { color: '#4CAF50', text: 'Riesgo Bajo' };
  if (riskPercentage <= 50) return { color: '#FFEB3B', text: 'Riesgo Bajo-Medio' };
  if (riskPercentage <= 75) return { color: '#FF9800', text: 'Riesgo Medio-Alto' };
  return { color: '#F44336', text: 'Riesgo Alto' };
};

function ProjectAnalysis() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [projectName] = useState('Auditoría de Seguridad de Red');
  const [activeSimulation, setActiveSimulation] = useState(simulationData[0]);

  const [messages, setMessages] = useState([
    { id: 1, type: 'agent', text: '¡Hola de nuevo! ¿En qué puedo ayudarte con el análisis de esta auditoría?' },
    { id: 2, type: 'user', text: 'Quisiera explorar los riesgos identificados con diferentes perfiles.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSaveAnalysis = () => {
    alert('Simulando guardar la versión del análisis...');
  };

  const handleExportPdf = () => {
    alert('Simulando la exportación de un PDF con los gráficos...');
  };

  // <<-- CAMBIO CLAVE AQUÍ: handleSendMessage ahora hace la llamada al backend -->>
  const handleSendMessage = async () => {
    if (chatInput.trim() === '') return;

    const userMessageText = chatInput.trim();
    const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;

    // Añadir el mensaje del usuario inmediatamente a la UI
    setMessages(prevMessages => [...prevMessages, { id: newId, type: 'user', text: userMessageText }]);
    setChatInput(''); // Limpiar el input

    // URL del backend desde las variables de entorno
    // Asumiendo que REACT_APP_BACKEND_API_URL está definida en .env.development y .env.production
    const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
    const AGENT_CHAT_ENDPOINT = `${BACKEND_API_URL}/agent/chat`; // Endpoint específico para el chat

    try {
      const response = await fetch(AGENT_CHAT_ENDPOINT, {
        method: 'PUT', // Método HTTP PUT según la especificación del backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idagente: "0", // Usamos ID de agente fijo "0" como en Home.js
          msg: userMessageText,
        }),
      });

      if (!response.ok) {
        // Si la respuesta no es 2xx, lanzar un error
        // Intentar parsear el error del servidor si lo hay
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Error del servidor: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      // Asumiendo que la respuesta del agente viene en un campo 'response'
      const agentResponseText = data.response || "El agente no devolvió una respuesta.";

      // Añadir la respuesta del agente a la UI
      setMessages(prevMessages => [...prevMessages, { id: newId + 1, type: 'agent', text: agentResponseText }]);

    } catch (error) {
      console.error("Error al comunicarse con el backend del agente:", error);
      // Mostrar un mensaje de error en el chat para el usuario
      setMessages(prevMessages => [...prevMessages, { id: newId + 1, type: 'agent', text: `Error: No se pudo conectar con el agente. (${error.message})` }]);
    }
  };

  useEffect(() => {
    // La dependencia activeSimulation es suficiente si solo el chat cambia con la simulación
    // Si quisieras que el chat se resetee o cambie de mensajes iniciales al cambiar de simulación,
    // aquí podrías añadir lógica similar a Home.js
    // Por ejemplo: setMessages([{ id: 1, type: 'agent', text: `Iniciando chat para ${activeSimulation.name}` }]);
  }, [activeSimulation]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#F0F2F5',
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
                onClick={() => navigate('/')}
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
            >
              Volver
            </Button>
            <img src={securityIcon} alt="Security Icon" style={{ width: '32px', height: '32px', marginLeft: theme.spacing(1) }} />
            <Typography
              variant="h5"
              component="div"
              fontWeight="bold"
            >
              {projectName}
            </Typography>
          </Box>
          {/* Botones de acción del AppBar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveAnalysis}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
                py: 1,
              }}
            >
              Guardar Versión
            </Button>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPdf}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: '#e0e0e0',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#bdbdbd',
                  bgcolor: '#f5f5f5',
                },
                py: 1,
              }}
            >
              Exportar PDF
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenido principal de 3 columnas */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '250px 1fr 250px',
          },
          gap: '20px',
        }}
      >
        {/* Columna 1: Versiones de Simulaciones */}
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
            Versiones de Simulaciones
          </Typography>
          <List disablePadding>
            {simulationData.map((sim) => (
              <ListItemButton
                key={sim.id}
                selected={sim.id === activeSimulation.id}
                onClick={() => setActiveSimulation(sim)}
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
                <ListItemText
                  primary={sim.name}
                  secondary={sim.date}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* Columna 2: Interacción con el Agente (Chat) y Análisis de Riesgos (Gráficos JPG) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Sección de Interacción con el Agente (Chat) */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: '8px',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Interacción con el Agente
            </Typography>
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
                maxHeight: '300px',
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

          {/* Sección de Análisis de Riesgos (Gráficos JPG) */}
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
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Análisis de Riesgos
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                {activeSimulation.charts.map((chart) => (
                  <Paper key={chart.id} variant="outlined" sx={{ p: 1, borderRadius: '8px' }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      {chart.title}
                    </Typography>
                    <Box sx={{
                        width: '100%',
                        height: 'auto',
                        minHeight: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}>
                      <img
                        src={chart.image}
                        alt={`Gráfico de ${chart.title}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, color: getRiskLevel(chart.risk).color }}>
                      Riesgo: {chart.risk}% ({getRiskLevel(chart.risk).text})
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Columna 3: Acciones del Análisis */}
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
            Acciones del Análisis
          </Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveAnalysis}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              },
              mb: 2,
              py: 1.5,
            }}
          >
            Guardar Versión
          </Button>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPdf}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: '#e0e0e0',
              color: 'text.primary',
              '&:hover': {
                borderColor: '#bdbdbd',
                bgcolor: '#f5f5f5',
              },
              py: 1.5,
            }}
          >
            Exportar PDF
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default ProjectAnalysis;