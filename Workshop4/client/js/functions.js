function createTeacher() {
  const firstName = document.getElementById('first_name').value;
  const lastName = document.getElementById('last_name').value;
  const cedula = document.getElementById('cedula').value;
  const age = document.getElementById('age').value;

  fetch('http://localhost:3001/api/teachers', {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          cedula: cedula,
          age: age
      })
  })
  .then(response => {
      if (!response.ok) throw new Error('Network response was not ok.');
      return response.json();
  })
  .then(data => {
      Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Profesor creado exitosamente',
      });
      document.getElementById('first_name').value = '';
      document.getElementById('last_name').value = '';
      document.getElementById('cedula').value = '';
      document.getElementById('age').value = '';
  })
  .catch(error => {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear al profesor: ' + error.message,
      });
  });
}

function getTeachers() {
  fetch('http://localhost:3001/api/teachers')
  .then(response => {
      if (!response.ok) throw new Error('Network response was not ok.');
      return response.json();
  })
  .then(data => {
      const table = document.getElementById('resultTable');
      // Limpia el cuerpo de la tabla antes de agregar nuevos datos
      while (table.rows.length > 1) {  // Asegúra de no eliminar el encabezado
          table.deleteRow(1);
      }
      data.forEach(teacher => {
          const row = table.insertRow(-1); // Inserta una fila al final de la tabla
          row.insertCell(0).textContent = teacher.first_name;
          row.insertCell(1).textContent = teacher.last_name;
          row.insertCell(2).textContent = teacher.cedula;
          row.insertCell(3).textContent = teacher.age;
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