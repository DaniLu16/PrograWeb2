const express = require('express');
const router = express.Router();

// Ejemplo de modelo (asegúrate de importar o definir tu modelo real)
// const Model = require('./model'); // Cambia esto según tu estructura de proyecto

// Ruta para crear un nuevo documento (POST)
router.post('/post', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        age: req.body.age
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ruta para obtener todos los documentos (GET)
router.get('/getAll', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para obtener un documento por ID (GET)
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para actualizar un documento por ID (PATCH)
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(id, updatedData, options);
        if (!result) {
            return res.status(404).json({ message: 'Documento no encontrado para actualizar' });
        }

        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ruta para eliminar un documento por ID (DELETE)
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({ message: 'Documento no encontrado para eliminar' });
        }

        res.json({ message: `El documento con el nombre "${data.name}" ha sido eliminado.` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
