// Cargamos los elementos del dom

const correo = document.getElementById("correo");
const contraseña = document.getElementById("contraseña");
const login = document.getElementById("login");

// Cargamos la lista de usuarios desde el local storage

let usuarios = [];

//Usamos un if para evitar el error cuando no esta creada la base de datos
if (localStorage.getItem("database") == null) {
} else {
  usuarios = JSON.parse(localStorage.getItem("database"));
}
function buscarIndex(correo) {
  return usuarios.find((element) => element.correo === correo);
}

//La funcion loguear usuario controla que el usuario se encuentre en la database almacenada en el local storage
//Si el usuario no esta registrado crea una alerta que lo envia a la pagina crear cuenta
//Si esta registrado, compara la contraseña ingresada con la almacenada anteriormente y mediante una alerta se lo envía a la web principal

function loguearUsuario() {
  let usuario = usuarios.find((element) => element.correo === correo.value);
  if (correo.value == "" || contraseña.value == "") {
    Swal.fire({
      icon: "error",
      title: "Error de formulario",
      text: "Complete todos los campos",
    });
  } else if (
    usuario === undefined ||
    localStorage.getItem("database") == null
  ) {
    Swal.fire({
      icon: "error",
      title: "Usuario no encontrado",
      text: "Usted no posee un usuario creado en nuestro sitio",
      footer: '<a href="../pages/crearCuenta.html"><b>CREAR UN USUARIO</b></a>',
    });
  } else if (usuario.contraseña === contraseña.value) {
    localStorage.setItem("usuarioLogueado", usuario.nombre);
    Swal.fire({
      icon: "success",
      title: "Login exitoso!",
      footer: '<a href="main.html"><b>Continuar al sitio</b></a>',
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Contraseña incorrecta",
      text: "Verifique que la contraseña ingresada es correcta",
    });
  }
}

//Se agrega el la funcion loguearUsuario al evento click en el boton del formulario

login.addEventListener("click", loguearUsuario);
login.addEventListener("click", function (event) {
  event.preventDefault();
});
