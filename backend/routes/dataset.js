// backend/routes/dataset.js

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const fs = require('fs');
const csv = require('csv-parser');

// Ruta para subir archivos CSV
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Por favor, sube un archivo CSV' });
    }

    // Procesa el archivo CSV
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.json({ message: 'Archivo subido y procesado exitosamente', data: results });
        });
});

module.exports = router;
