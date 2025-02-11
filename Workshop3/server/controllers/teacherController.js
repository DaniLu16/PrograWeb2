const Teacher = require("../models/teacherModel");

/**
 * Creates a teacher
 *
 * @param {*} req
 * @param {*} res
 */
const teacherCreate = (req, res) => {
  let teacher = new Teacher();

  teacher.first_name = req.body.first_name;
  teacher.last_name = req.body.last_name;
  teacher.age = req.body.age;
  teacher.cedula = req.body.cedula;

  if (teacher.first_name && teacher.last_name) {
    teacher.save()
      .then(() => {
        res.status(201); // CREATED
        res.header({
          'location': `/teachers/?id=${teacher.id}`
        });
        res.json(teacher);
      })
      .catch((err) => {
        res.status(422);
        console.log('error while saving the teacher', err);
        res.json({
          error: 'There was an error saving the teacher'
        });
    });
  } else {
    res.status(422);
    console.log('error while saving the teacher')
    res.json({
      error: 'No valid data provided for teacher'
    });
  }
};

/**
 * Get all teachers
 *
 * @param {*} req
 * @param {*} res
 */
const teacherGet = (req, res) => {
  // if an specific teacher is required
  if (req.query && req.query.id) {
    Teacher.findById(req.query.id)
      .then(teacher => {
        if(teacher) {
          res.json(teacher);
        }
        res.status(404);
        res.json({ error: "Teacher doesnt exist" })
      })
      .catch( (err) => {
        res.status(500);
        console.log('error while queryting the teacher', err)
        res.json({ error: "There was an error" })
      });
  } else {
    // get all teachers
    Teacher.find()
      .then(teachers => {
        res.json(teachers);
      })
      .catch(err => {
        res.status(422);
        res.json({ "error": err });
      });
  }
};

module.exports = {
  teacherCreate,
  teacherGet
}