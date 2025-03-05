const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Modelo de usuario

// Conexión a la base de datos
mongoose.connect("mongodb+srv://danielalucia2716:Dani123@cluster1.6uc6n.mongodb.net/teachers", { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.log('❌ Error al conectar a MongoDB:', err));

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Importar controladores
const { teacherCreate, teacherGet, teacherGetById, teacherUpdate, teacherDelete } = require('./controllers/teacherController');
const { courseCreate, courseGet, courseGetById, courseUpdate, courseDelete } = require('./controllers/courseController');

// 🟢 **Rutas de autenticación**
// Registro
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.json({ success: true, message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Middleware para verificar el token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ success: false, message: 'Token no proporcionado' });
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Token inválido' });
        }
        req.userId = decoded.userId;
        next();
    });
}

// 🟢 **Rutas protegidas de profesores y cursos**
app.post('/api/teachers', verifyToken, teacherCreate);
app.get("/api/teachers", verifyToken, teacherGet);
app.get("/api/teachers/:id", verifyToken, teacherGetById);
app.put("/api/teachers/:id", verifyToken, teacherUpdate);
app.delete("/api/teachers/:id", verifyToken, teacherDelete);

app.post('/api/courses', verifyToken, courseCreate);
app.get("/api/courses", verifyToken, courseGet);
app.get("/api/courses/:id", verifyToken, courseGetById);
app.put("/api/courses/:id", verifyToken, courseUpdate);
app.delete("/api/courses/:id", verifyToken, courseDelete);

// Iniciar el servidor
app.listen(3001, () => console.log('🚀 Servidor corriendo en el puerto 3001!'));
