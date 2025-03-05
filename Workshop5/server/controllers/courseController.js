const Course = require("../models/courseModel");
const Teacher = require("../models/teacherModel");

/**
 * Crear un curso
 */
const courseCreate = (req, res) => {
  const { name, code, description, teacher_id } = req.body;
  if (!name || !code || !description || !teacher_id) {
    return res.status(422).json({ error: "Faltan campos obligatorios" });
  }

  const course = new Course({
    name,
    code,
    description,
    teacher: teacher_id
  });

  // Verifica si el profesor existe
  Teacher.findById(teacher_id)
    .then(teacher => {
      if (!teacher) {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }

      course.save()
        .then(() => {
          res.status(201).json(course);
        })
        .catch((err) => {
          console.error('Error al guardar el curso:', err);
          res.status(422).json({ error: 'Hubo un error al guardar el curso', details: err });
        });
    })
    .catch(err => {
      console.error("Error al encontrar el profesor:", err);
      res.status(422).json({ error: "Error al verificar el profesor", details: err });
    });
};

/**
 * Obtener todos los cursos
 */
const courseGet = (req, res) => {
  Course.find()
    .populate('teacher', 'first_name last_name') // Asegúrate de obtener solo los campos necesarios
    .then(courses => {
      res.json(courses);
    })
    .catch(err => {
      res.status(422).json({ error: err });
    });
};

/**
 * Obtener un curso por ID
 */
const courseGetById = (req, res) => {
  const { id } = req.params;

  Course.findById(id).populate('teacher', 'name')
    .then(course => {
      if (!course) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }
      res.json(course);
    })
    .catch(err => {
      console.error("Error al obtener el curso:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    });
};

/**
 * Actualizar un curso por ID
 */
const courseUpdate = (req, res) => {
  const { id } = req.params;

  Course.findByIdAndUpdate(id, req.body, { new: true })
    .then(updatedCourse => {
      if (!updatedCourse) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }
      res.json(updatedCourse);
    })
    .catch(err => {
      res.status(500).json({ error: "Error al actualizar el curso", details: err });
    });
};

/**
 * Eliminar un curso por ID
 */
const courseDelete = (req, res) => {
  const { id } = req.params;

  Course.findByIdAndDelete(id)
    .then(deletedCourse => {
      if (!deletedCourse) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }
      res.json({ message: "Curso eliminado exitosamente" });
    })
    .catch(err => {
      res.status(500).json({ error: "Error al eliminar el curso", details: err });
    });
};

module.exports = {
  courseCreate,
  courseGet,
  courseGetById,
  courseUpdate,
  courseDelete
};
