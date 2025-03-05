const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');  // Supongamos que tienes un modelo de usuario

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar usuario en la base de datos
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generar JWT token
        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { login };
