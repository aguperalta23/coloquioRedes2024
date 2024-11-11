// backend/routes/dataset.js

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const fs = require('fs');
const csv = require('csv-parser');
const OpenAI = require("openai");
require('dotenv').config();

// Configura OpenAI con la API Key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Usa la clave de tu archivo .env
});

// Función para analizar los datos del CSV con OpenAI
async function analyzeDataWithAI(results) {
    try {
        // Llamada a OpenAI para crear un mensaje de ejemplo
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Asegúrate de que el modelo esté disponible
            messages: [
                { "role": "user", "content": "Sugiere un gráfico para los siguientes datos:" },
                { "role": "user", "content": JSON.stringify(results) }
            ]
        });

        // Obtén la respuesta de OpenAI
        const aiResponse = completion.choices[0].message.content;
        console.log("Sugerencias de gráficos:", aiResponse);

        return aiResponse; // Retorna las sugerencias de gráficos o el análisis
    } catch (error) {
        console.error("Error al consultar la API de OpenAI:", error);
        throw error;
    }
}

// Ruta para subir archivos CSV y procesarlos
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Por favor, sube un archivo CSV' });
    }

    console.log("Ruta del archivo:", req.file.path);
    const results = [];

    // Lee y procesa el archivo CSV
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Llama a la función de análisis de OpenAI con los datos procesados del CSV
                const analysis = await analyzeDataWithAI(results);

                // Enviar la respuesta de OpenAI junto con los datos procesados del CSV
                res.json({
                    message: 'Archivo subido y procesado exitosamente',
                    data: results,
                    analysis
                });
            } catch (error) {
                res.status(500).json({ error: 'Error al procesar la solicitud de IA' });
            }
        })
        .on('error', (error) => {
            console.error("Error al leer el archivo CSV:", error);
            res.status(500).json({ error: 'Error al procesar el archivo CSV' });
        });
});

module.exports = router;
