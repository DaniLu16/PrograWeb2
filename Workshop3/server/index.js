const express = require('express');
const app = express();

// Conexión a la base de datos
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://danielalucia2716:Dani123@cluster1.6uc6n.mongodb.net/teachers");

// Para procesar el cuerpo de la solicitud
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Verificación de CORS
const cors = require("cors");
const { teacherCreate, teacherGet, teacherGetById, teacherUpdate, teacherDelete } = require('./controllers/teacherController');
app.use(cors({
  domains: '*',
  methods: "*"
}));

// Rutas
app.post('/api/teachers', teacherCreate); // Crear profesor
app.get("/api/teachers", teacherGet); // Obtener todos los profesores
app.get("/api/teachers/:id", teacherGetById); // Obtener profesor por ID
app.put("/api/teachers/:id", teacherUpdate); // Actualizar profesor
app.delete("/api/teachers/:id", teacherDelete); // Eliminar profesor

// Iniciar el servidor
app.listen(3001, () => console.log(`Servidor corriendo en el puerto 3001!`));
