window.addEventListener('load', function () {

    /* ---------------------- obtenemos variables globales ---------------------- */
   const form = document.forms[0];
   const nombre = document.querySelector("#inputNombre");
   const apellido = document.querySelector("#inputApellido");
   const email = document.querySelector("#inputEmail");
   const password = document.querySelector("#inputPassword");

   const url = "https://todo-api.ctd.academy/v1";
    

/* -------------------------------------------------------------------------- */
/*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
/* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
      event.preventDefault();

    // Mostrar el spinner para indicar al usuario que se ha iniciado el proceso de registro
    mostrarSpinner();
    // Datos de la request que necesita la API  para crear el usuario nuevo
      const datos = {
        firstName: nombre.value,
        lastName: apellido.value,
        email: email.value,
        password: password.value
      }

      console.log(datos);

        // configurar la request del FETCH
        const settings = {
            method: "POST",
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // lanzar la consulta a la API
        realizarRegister(settings);

        // limpiar los campos del formulario
        form.reset();
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        
        fetch(`${url}/users`, settings)
        .then( response => {
            console.log(response);
            if (response.ok) return response.json();

            return Promise.reject(response);
        })   
        .then( data => {
            console.log("Promesa cumplida 💍");
            console.log(data);
            console.log(data.jwt);

            if (data.jwt) {
                // guardar en el localStorage el objeto con el token de identidad
                localStorage.setItem("jwt", JSON.stringify(data.jwt));

                ocultarSpinner();
                
                // redireccionar al dashboad (tablero de tareas)
                location.replace('./mis-tareas.html');
            }
        } )
        .catch( err => {
            console.log("Promesa rechazada 🙅🏻‍♀️");
            console.warn(err);
            // Ocultamos el spinner en caso de error
            ocultarSpinner();
            if (err.status >= 400  && err.status < 500) {
                console.warn("El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto");
                alert("El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto");
            } else if (err.status >= 500  && err.status < 600) {
                console.warn("Error del servidor");
                alert("Error del servidor");
            }
        })
    };
});
