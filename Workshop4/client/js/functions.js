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
function editTeacher(teacherId) {
    // Obtener los datos del profesor que queremos editar
    fetch(`http://localhost:3001/api/teachers/${teacherId}`)
      .then(response => response.json())
      .then(teacher => {
        // Mostrar el formulario de edición para el profesor
        Swal.fire({
          title: 'Editar Profesor',
          html: `
            <input id="edit_first_name" class="swal2-input" placeholder="Primer Nombre" value="${teacher.first_name}">
            <input id="edit_last_name" class="swal2-input" placeholder="Apellido" value="${teacher.last_name}">
            <input id="edit_age" class="swal2-input" placeholder="Edad" value="${teacher.age}">
            <input id="edit_cedula" class="swal2-input" placeholder="Cédula" value="${teacher.cedula}">
          `,
          focusConfirm: false,
          preConfirm: () => {
            const updatedTeacher = {
              first_name: document.getElementById('edit_first_name').value,
              last_name: document.getElementById('edit_last_name').value,
              age: document.getElementById('edit_age').value,
              cedula: document.getElementById('edit_cedula').value
            };
  
            // Actualizar el profesor en el backend
            fetch(`http://localhost:3001/api/teachers/${teacherId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedTeacher)
            })
            .then(response => response.json())
            .then(updatedTeacher => {
              Swal.fire('Profesor actualizado', '', 'success');
              getTeachers(); // Refrescar la lista de profesores (si tienes una función para esto)
            })
            .catch(err => {
              Swal.fire('Error', 'No se pudo actualizar el profesor', 'error');
            });
          }
        });
      })
      .catch(err => {
        Swal.fire('Error', 'No se pudo obtener los detalles del profesor', 'error');
      });
  }
  
  
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
  
    // Depuración
    console.log({
        name: courseName,
        code: courseCode,
        description: courseDescription,
        teacher_id: teacherId
    });

    fetch('http://localhost:3001/api/courses', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: courseName,
        code: courseCode,
        description: courseDescription,
        teacher_id: teacherId // Aquí se pasa el ID del profesor
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
        const table = document.getElementById('courseTable');
        
        // Limpiar la tabla antes de agregar los nuevos datos
        table.innerHTML = `
          <tr>
            <th>Nombre del Curso</th>
            <th>Código</th>
            <th>Descripción</th>
            <th>Profesor</th>
            <th>Acciones</th>
          </tr>
        `;
  
        // Llenar la tabla con los cursos y los datos del profesor
        courses.forEach(course => {
          const row = table.insertRow();
  
          // Crear las celdas para el curso
          row.insertCell(0).innerText = course.name;
          row.insertCell(1).innerText = course.code;
          row.insertCell(2).innerText = course.description;
  
          // Verificar si el curso tiene un profesor
          if (course.teacher) {
            row.insertCell(3).innerText = `${course.teacher.first_name} ${course.teacher.last_name}`;
          } else {
            row.insertCell(3).innerText = 'No asignado';
          }
  
          // Crear las celdas para las acciones
          const actionsCell = row.insertCell(4);
          
          // Crear los botones de acción
          const editButton = document.createElement('button');
          editButton.classList.add('btn', 'btn-warning', 'btn-sm');
          editButton.innerText = 'Editar';
          editButton.onclick = () => editCourse(course._id);
          
          const deleteButton = document.createElement('button');
          deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
          deleteButton.innerText = 'Eliminar';
          deleteButton.onclick = () => deleteCourse(course._id);
          
          // Añadir los botones de acción a la celda
          actionsCell.appendChild(editButton);
          actionsCell.appendChild(deleteButton);
        });
      })
      .catch(error => {
        console.error('Error al obtener los cursos:', error);
      });
  }
  
  

  function editCourse(courseId) {
    // Obtener los datos del curso que queremos editar (puedes cargar los detalles en un formulario)
    fetch(`http://localhost:3001/api/courses/${courseId}`)
      .then(response => response.json())
      .then(course => {
        // Obtener la lista de profesores
        fetch('http://localhost:3001/api/teachers') // Cambia la URL a la de tu API de profesores
          .then(response => response.json())
          .then(teachers => {
            // Crear las opciones de los profesores para el selector
            const teacherOptions = teachers.map(teacher => 
              `<option value="${teacher._id}" ${teacher._id === course.teacher ? 'selected' : ''}>
                ${teacher.first_name} ${teacher.last_name}
              </option>`
            ).join('');
  
            // Mostrar el formulario con los datos del curso y el selector de profesores
            Swal.fire({
              title: 'Editar Curso',
              html: `
                <input id="edit_name" class="swal2-input" placeholder="Nombre" value="${course.name}">
                <input id="edit_code" class="swal2-input" placeholder="Código" value="${course.code}">
                <textarea id="edit_description" class="swal2-input" placeholder="Descripción">${course.description}</textarea>
                <select id="edit_teacher" class="swal2-input">
                  ${teacherOptions}
                </select>
              `,
              focusConfirm: false,
              preConfirm: () => {
                const updatedCourse = {
                  name: document.getElementById('edit_name').value,
                  code: document.getElementById('edit_code').value,
                  description: document.getElementById('edit_description').value,
                  teacher: document.getElementById('edit_teacher').value // ID del profesor seleccionado
                };
                
                // Actualizar el curso en el backend
                fetch(`http://localhost:3001/api/courses/${courseId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedCourse)
                })
                .then(response => response.json())
                .then(updatedCourse => {
                  Swal.fire('Curso actualizado', '', 'success');
                  getCourses(); // Refrescar la lista de cursos
                })
                .catch(err => {
                  Swal.fire('Error', 'No se pudo actualizar el curso', 'error');
                });
              }
            });
          })
          .catch(err => {
            Swal.fire('Error', 'No se pudo obtener la lista de profesores', 'error');
          });
      })
      .catch(err => {
        Swal.fire('Error', 'No se pudo obtener los detalles del curso', 'error');
      });
  }
  
  
  function deleteCourse(courseId) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás recuperar este curso",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar el curso desde el backend
        fetch(`http://localhost:3001/api/courses/${courseId}`, {
          method: 'DELETE',
        })
        .then(response => response.json())
        .then(() => {
          Swal.fire('Curso eliminado', '', 'success');
          getCourses(); // Refrescar la lista de cursos
        })
        .catch(err => {
          Swal.fire('Error', 'No se pudo eliminar el curso', 'error');
        });
      }
    });
  }
  

