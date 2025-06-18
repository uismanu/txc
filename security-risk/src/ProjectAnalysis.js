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
  LinearProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';

import securityIcon from './assets/security-icon.png';

// Datos de demostración para las simulaciones
const simulationData = [
  {
    id: 'sim-1',
    name: 'Simulación Inicial',
    date: '2025-06-10',
    charts: [
      { id: 'chart1', title: 'Riesgo de Phishing', risk: 15 }, // Bajo
      { id: 'chart2', title: 'Vulnerabilidad de Servidor', risk: 40 }, // Bajo-Medio
      { id: 'chart3', title: 'Riesgo de Malware', risk: 70 }, // Medio-Alto
      { id: 'chart4', title: 'Fuga de Datos Interna', risk: 85 }, // Alto
    ],
  },
  {
    id: 'sim-2',
    name: 'Simulación Post-Parches',
    date: '2025-06-12',
    charts: [
      { id: 'chart1', title: 'Riesgo de Phishing', risk: 10 }, // Bajo
      { id: 'chart2', title: 'Vulnerabilidad de Servidor', risk: 25 }, // Bajo
      { id: 'chart3', title: 'Riesgo de Malware', risk: 55 }, // Medio-Alto
      { id: 'chart4', title: 'Fuga de Datos Interna', risk: 65 }, // Medio-Alto
    ],
  },
  {
    id: 'sim-3',
    name: 'Simulación Semanal',
    date: '2025-06-15',
    charts: [
      { id: 'chart1', title: 'Riesgo de Phishing', risk: 5 }, // Bajo
      { id: 'chart2', title: 'Vulnerabilidad de Servidor', risk: 18 }, // Bajo
      { id: 'chart3', title: 'Riesgo de Malware', risk: 45 }, // Bajo-Medio
      { id: 'chart4', title: 'Fuga de Datos Interna', risk: 50 }, // Bajo-Medio
      { id: 'chart5', title: 'Acceso No Autorizado', risk: 30 }, // Bajo-Medio
      { id: 'chart6', title: 'Ataque DDos', risk: 78 }, // Alto
    ],
  },
];

function ProjectAnalysis() {
  const navigate = useNavigate();
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // <<-- Eliminada: no se usa

  // const [projectName, setProjectName] = useState('Auditoría de Seguridad de Red'); // <<-- setProjectName no se usa
  const projectName = 'Auditoría de Seguridad de Red'; // Convertido a const, si no va a cambiar

  const [activeSimulation, setActiveSimulation] = useState(simulationData[0]);

  // Nuevo estado para controlar la visibilidad de la barra de seguridad general
  const [showOverallSecurityBar, setShowOverallSecurityBar] = useState(false);

  // const useEffect = () => {}; // <<-- Eliminada: esta línea estaba causando la advertencia de useEffect no usado

  const calculateAverageRisk = () => {
    if (activeSimulation.charts.length === 0) return 0;
    const totalRisk = activeSimulation.charts.reduce((sum, chart) => sum + chart.risk, 0);
    return totalRisk / activeSimulation.charts.length;
  };

  const averageRisk = calculateAverageRisk();

  const getRiskLevel = (riskPercentage) => {
    if (riskPercentage <= 25) return { color: '#4CAF50', text: 'Riesgo Bajo' }; // Verde
    if (riskPercentage <= 50) return { color: '#FFEB3B', text: 'Riesgo Bajo-Medio' }; // Amarillo
    if (riskPercentage <= 75) return { color: '#FF9800', text: 'Riesgo Medio-Alto' }; // Naranja
    return { color: '#F44336', text: 'Riesgo Alto' }; // Rojo
  };

  const { color: securityBarColor, text: securityBarText } = getRiskLevel(averageRisk);

  const handleSaveAnalysis = () => {
    alert('Simulando guardar la versión del análisis...');
  };

  const handleExportPdf = () => {
    alert('Simulando la exportación de un PDF con los gráficos...');
  };

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
            <img src={securityIcon} alt="Security Icon" style={{ width: '32px', height: '32px' }} />
            <Typography
              variant="h5"
              component="div"
              fontWeight="bold"
            >
              {projectName}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              }
            }}
          >
            Volver
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido principal de 3 columnas */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '250px 2fr 1fr',
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

        {/* Columna 2: Gráficos de Datos y Barra de Seguridad General */}
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
            Análisis de Riesgos
          </Typography>

          {/* Contenedor de gráficos */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: showOverallSecurityBar ? 3 : 0 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              {activeSimulation.charts.map((chart) => (
                <Paper key={chart.id} variant="outlined" sx={{ p: 2, borderRadius: '8px' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {chart.title}
                  </Typography>
                  <Box sx={{ mt: 1, height: '100px', bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                    <Typography variant="h4" color="text.secondary">
                      {chart.risk}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, color: getRiskLevel(chart.risk).color }}>
                    Riesgo: {chart.risk}% ({getRiskLevel(chart.risk).text})
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Barra de seguridad general - Renderizado condicional */}
          {showOverallSecurityBar && (
            <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Seguridad General del Proyecto
              </Typography>
              <LinearProgress
                variant="determinate"
                value={100 - averageRisk}
                sx={{
                  height: 20,
                  borderRadius: 5,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: securityBarColor,
                  },
                }}
              />
              <Typography variant="body1" align="center" sx={{ mt: 1, color: securityBarColor }}>
                {securityBarText} ({averageRisk.toFixed(1)}% Riesgo Promedio)
                <br />
                (0% Riesgo Absoluto, 100% Riesgo Cubierto)
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Columna 3: Acciones */}
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
          {/* Botón para mostrar/ocultar la barra de seguridad, si es necesario para demo */}
          <Button
            variant="text"
            onClick={() => setShowOverallSecurityBar(!showOverallSecurityBar)}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            {showOverallSecurityBar ? 'Ocultar' : 'Mostrar'} Barra de Seguridad
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default ProjectAnalysis;