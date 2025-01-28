require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Conexión a MongoDB usando mongoose
const mongoString = process.env.DATABASE_URL; // URL obtenida de las variables de entorno

mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;

// Manejo de errores en la conexión
database.on('error', (error) => {
    console.error('Error connecting to the database:', error);
});

// Confirmación de conexión exitosa
database.once('connected', () => {
    console.log('Database Connected');
});

// Rutas
const routes = require('./routes/routes');
app.use('/api', routes); // Usar las rutas desde el archivo de rutas

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Inicializa el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`);
});
