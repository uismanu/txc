// src/crear_project.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import securityIcon from './assets/security-icon.png';

function CrearProject() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [projectName, setProjectName] = useState('Nombre del Proyecto');
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [projectDescription, setProjectDescription] = useState('');

  const [attachedFiles, setAttachedFiles] = useState([
    { id: 1, name: 'documento_adjunto_1.pdf' },
    { id: 2, name: 'imagen_de_red.png' },
    { id: 3, name: 'evaluacion_inicial.docx' },
  ]);

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleEditProjectNameClick = () => {
    setIsEditingProjectName(true);
  };

  const handleProjectNameBlur = () => {
    setIsEditingProjectName(false);
    if (projectName.trim() === '') {
      setProjectName('Nombre del Proyecto');
    }
  };

  const handleUploadClick = () => {
    alert('Simulando la carga de un documento...');
    const newFileId = attachedFiles.length > 0 ? Math.max(...attachedFiles.map(f => f.id)) + 1 : 1;
    setAttachedFiles([...attachedFiles, { id: newFileId, name: `nuevo_documento_${newFileId}.pdf` }]);
  };

  const handleCancelProject = () => {
    navigate('/');
  };

  const handleAnalyzeProject = () => {
    alert('Simulando el análisis del proyecto...');
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F0F2F5' }}>
      {/* AppBar ESPECÍFICO PARA CREAR PROYECTO */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderRadius: '8px', // <<-- AÑADIDO: Bordes redondeados
          mb: '20px', // <<-- AÑADIDO: Margen inferior
          flexShrink: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <img src={securityIcon} alt="Security Icon" style={{ width: '32px', height: '32px' }} />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              fontWeight="bold"
            >
              {isMobile ? "Nuevo Proyecto" : "Crear Nuevo Proyecto"}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenido principal de Crear Proyecto */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '65% 1fr',
          },
          gap: '20px',
          p: '20px', // Este padding es para el contenido debajo del AppBar
        }}
      >
        {/* Columna Izquierda: Detalles del Proyecto */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {isEditingProjectName ? (
              <TextField
                variant="standard"
                value={projectName}
                onChange={handleProjectNameChange}
                onBlur={handleProjectNameBlur}
                autoFocus
                fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    p: 0,
                  },
                  '& .MuiInput-underline:before': { borderBottom: 'none' },
                  '& .MuiInput-underline:after': { borderBottomColor: 'primary.main' },
                }}
              />
            ) : (
              <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
                {projectName}
              </Typography>
            )}
            <IconButton onClick={handleEditProjectNameClick} size="small">
              <EditIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" gutterBottom>
            Descripción del Proyecto
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            placeholder="Describe tu proyecto aquí..."
            variant="outlined"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            sx={{ mb: 3, '& fieldset': { borderRadius: '8px' } }}
          />

          {/* CONTENEDOR DE BOTONES */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancelProject}
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
              Cancelar Proyecto
            </Button>
            <Button
              variant="contained"
              onClick={handleAnalyzeProject}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
                flexGrow: 1,
              }}
            >
              Analizar Proyecto
            </Button>
          </Box>
        </Paper>

        {/* Columna Derecha: Fuentes Adicionales y Archivos Adjuntos */}
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
          <Typography variant="h5" gutterBottom>
            Fuentes Adicionales
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
              mb: 3,
              width: 'fit-content',
            }}
          >
            Adjuntar documento
          </Button>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Archivos Adjuntos
          </Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {attachedFiles.length > 0 ? (
              <List disablePadding>
                {attachedFiles.map((file) => (
                  <ListItemButton
                    key={file.id}
                    sx={{
                      borderRadius: '4px',
                      mb: 0.5,
                      bgcolor: '#f5f5f5',
                      '&:hover': { bgcolor: '#ebebeb' },
                      py: 1,
                    }}
                  >
                    <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <ListItemText primary={file.name} />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No se han adjuntado archivos.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default CrearProject;