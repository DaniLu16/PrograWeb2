function createTeacher() {
  const firstName = document.getElementById('first_name').value.trim();
  const lastName = document.getElementById('last_name').value.trim();
  const cedula = document.getElementById('cedula').value.trim();
  const age = document.getElementById('age').value.trim();

  if (!firstName || !lastName || !cedula || !age) {
      Swal.fire({
          icon: 'warning',
          title: 'Campos Vacíos',
          text: 'Todos los campos son obligatorios',
      });
      return;
  }

  fetch('http://localhost:3001/api/teachers', {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          cedula: cedula,
          age: parseInt(age, 10) // Asegurar que se envía un número
      })
  })
  .then(response => {
      if (!response.ok) throw new Error('Error en la red');
      return response.json();
  })
  .then(() => {
      Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Profesor creado exitosamente',
      });

      document.getElementById('first_name').value = '';
      document.getElementById('last_name').value = '';
      document.getElementById('cedula').value = '';
      document.getElementById('age').value = '';

      getTeachers();
  })
  .catch(error => {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se pudo crear al profesor: ${error.message}`,
      });
  });
}

function getTeachers() {
    fetch('http://localhost:3001/api/teachers')
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .then(data => {
            const table = document.getElementById('resultTable');
            if (!table) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró la tabla en el DOM',
                });
                return;
            }

            const tbody = table.getElementsByTagName('tbody')[0];
            tbody.innerHTML = "";  // Limpiar la tabla antes de cargar los datos

            data.forEach(teacher => {
                const row = tbody.insertRow();
                row.insertCell(0).textContent = teacher.first_name;
                row.insertCell(1).textContent = teacher.last_name;
                row.insertCell(2).textContent = teacher.cedula;
                row.insertCell(3).textContent = teacher.age;

                // Celda de acciones
                const actionsCell = row.insertCell(4);
                actionsCell.innerHTML = ` 
                    <button class="btn btn-warning btn-sm me-2" onclick="editTeacher('${teacher._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTeacher('${teacher._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
            });

            // Ahora llena el select de profesores
            const teacherSelect = document.getElementById("teacher_select");
            teacherSelect.innerHTML = ''; // Limpiar el select
            data.forEach(teacher => {
                const option = document.createElement("option");
                option.value = teacher._id;
                option.textContent = `${teacher.first_name} ${teacher.last_name}`;
                teacherSelect.appendChild(option);
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudo obtener la lista de profesores: ${error.message}`,
            });
        });
}


function editTeacher(id) {
    const firstName = document.getElementById('first_name').value.trim();
    const lastName = document.getElementById('last_name').value.trim();
    const cedula = document.getElementById('cedula').value.trim();
    const age = document.getElementById('age').value.trim();

    if (!firstName || !lastName || !cedula || !age) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Vacíos',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }

    fetch(`http://localhost:3001/api/teachers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            cedula: cedula,
            age: parseInt(age, 10) // Asegura que el valor de la edad sea un número
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en la red');
        return response.json();
    })
    .then(updatedTeacher => {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Profesor actualizado exitosamente',
        });

        // Recargar la lista de profesores o actualizar la tabla
        getTeachers();
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No se pudo actualizar al profesor: ${error.message}`,
        });
    });
}


/**
 * Actualizar un profesor por ID
 */
const teacherUpdate = (req, res) => {
    const { id } = req.params;
  
    // Asegúrate de que el ID está presente
    if (!id) {
      return res.status(400).json({ error: "El ID es necesario para actualizar" });
    }
  
    // Actualizar los datos del profesor
    Teacher.findByIdAndUpdate(id, req.body, { new: true })
      .then(updatedTeacher => {
        if (!updatedTeacher) {
          return res.status(404).json({ error: "Profesor no encontrado" });
        }
        res.json(updatedTeacher);
      })
      .catch(err => {
        console.error("Error al actualizar el profesor:", err);
        res.status(500).json({ error: "Error al actualizar el profesor", details: err });
      });
  };
  
function deleteTeacher(id) {
    if (!id) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ID del profesor no encontrado',
        });
        return;
    }

    console.log(`Intentando eliminar el profesor con ID: ${id}`);

    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:3001/api/teachers/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) throw new Error('Error al eliminar');
                return response.json();
            })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'Profesor eliminado exitosamente',
                });
                getTeachers(); // Refrescar la tabla
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `No se pudo eliminar: ${error.message}`,
                });
            });
        }
    });
}

// Función para crear un curso
function createCourse() {
    const courseName = document.getElementById('course_name').value.trim();
    const courseCode = document.getElementById('course_code').value.trim();
    const courseDescription = document.getElementById('course_description').value.trim();
    const teacherId = document.getElementById('teacher_select').value; // ID del profesor seleccionado
  
    if (!courseName || !courseCode || !courseDescription || !teacherId) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Vacíos',
        text: 'Todos los campos son obligatorios',
      });
      return;
    }
  
    fetch('http://localhost:3001/api/courses', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: courseName,
        code: courseCode,
        description: courseDescription,
        teacher: teacherId // Aquí se pasa el ID del profesor
      })
    })
    .then(response => {
      if (!response.ok) throw new Error('Error al crear el curso');
      return response.json();
    })
    .then(course => {
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Curso creado exitosamente',
      });
  
      // Limpiar los campos del formulario
      document.getElementById('course_name').value = '';
      document.getElementById('course_code').value = '';
      document.getElementById('course_description').value = '';
      document.getElementById('teacher_select').value = '';
  
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo crear el curso: ${error.message}`,
      });
    });
  }


function getCourses() {
    fetch('http://localhost:3001/api/courses')
        .then(response => response.json())
        .then(courses => {
            console.log(courses); // Muestra los cursos en la consola
           
        })
        .catch(error => console.error('Error al obtener los cursos:', error));
}
