// server.js
const express = require('express');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite peticiones desde tu frontend
app.use(express.json());

// Configura el cliente de Cloud Storage
// Asegúrate que la variable de entorno GOOGLE_APPLICATION_CREDENTIALS
// apunte a tu archivo de clave JSON.
const storage = new Storage({
  projectId: 'gcp-tecem-dev', // Tu ID de proyecto
});

// El bucket al que quieres subir los archivos
const bucketName = 'tecemx_attached-dev-temp';

// Endpoint para generar la URL firmada
app.post('/generate-upload-url', async (req, res) => {
  const { fileName, fileType } = req.body;
  if (!fileName || !fileType) {
    return res.status(400).send('fileName y fileType son requeridos.');
  }

  const options = {
    version: 'v4',
    action: 'write', // 'write' es para subir (PUT)
    expires: Date.now() + 15 * 60 * 1000, // 15 minutos de validez
    contentType: fileType,
  };

  try {
    // Obtenemos la URL firmada
    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    res.status(200).json({ signedUrl: url });
  } catch (error) {
    console.error('Error generando la URL firmada:', error);
    res.status(500).send('No se pudo generar la URL de subida.');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});