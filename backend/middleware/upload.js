// backend/middleware/upload.js

const multer = require('multer');
const path = require('path');
//const upload = multer({ dest: 'uploads/' })
// Configuración de almacenamiento en carpeta temporal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
    }
});

// Configuración del filtro de archivos para aceptar solo CSV
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no soportado'), false);
    }
};

// Middleware de configuración de Multer
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
