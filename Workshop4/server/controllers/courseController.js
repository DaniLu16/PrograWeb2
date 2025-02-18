const Course = require("../models/courseModel"); // Asumiendo que tienes un modelo Course
const Teacher = require("../models/teacherModel");

/**
 * Crear un curso
 */
const courseCreate = (req, res) => {
  let course = new Course();
  course.name = req.body.name;
  course.description = req.body.description;
  course.teacher = req.body.teacher_id; // Este es el ID del profesor

  if (course.name && course.teacher) {
    course.save()
      .then(() => {
        res.status(201); // CREATED
        res.header({
          'location': `/courses/?id=${course.id}`
        });
        res.json(course);
      })
      .catch((err) => {
        res.status(422);
        console.log('Error al guardar el curso:', err);
        res.json({
          error: 'Hubo un error al guardar el curso'
        });
      });
  } else {
    res.status(422);
    console.log('Datos inválidos para el curso');
    res.json({
      error: 'No se proporcionaron datos válidos para el curso'
    });
  }
};

/**
 * Obtener todos los cursos
 */
const courseGet = (req, res) => {
  Course.find()
    .then(courses => {
      res.json(courses);
    })
    .catch(err => {
      res.status(422);
      res.json({ "error": err });
    });
};

/**
 * Obtener un curso por ID
 */
const courseGetById = (req, res) => {
  const { id } = req.params;

  Course.findById(id)
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
