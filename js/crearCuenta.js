//Primero creamos la clase usuarios y la lista vacia

usuarios = [];

class Usuario {
  constructor(nombre, correo, contraseña) {
    this.nombre = nombre;
    this.correo = correo;
    this.contraseña = contraseña;
  }
}

//Si no se encuentra la lista de usuarios en local storage se crea vacia

if (localStorage.getItem("database") == null) {
  localStorage.setItem("database", []);
}

//Para evitar error en el parseo si la database esta vacia no tomo su valor, solo si ya tenia usuarios cargados

if (localStorage.getItem("database") == "") {
  usuarios = [];
} else {
  usuarios = JSON.parse(localStorage.getItem("database"));
}

// Cargamos los elementos del formulario y los asignamos variables

const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const contraseña = document.getElementById("contraseña");
const reContraseña = document.getElementById("repetirContraseña");
const submit = document.getElementById("submit");

//Funcion crear el usuario y almacenarlo en "usuarios"
//Una vez creada la cuenta nos podemos dirigir al login

function crearUsuario() {
  if (
    nombre.value == "" ||
    correo.value == "" ||
    contraseña.value == "" ||
    reContraseña.value == ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Error de formulario",
      text: "Complete todos los campos",
    });
  } else if (contraseña.value == reContraseña.value) {
    usuarios.push(new Usuario(nombre.value, correo.value, contraseña.value));
    localStorage.setItem("database", JSON.stringify(usuarios));
    nombre.value = "";
    correo.value = "";
    contraseña.value = "";
    reContraseña.value = "";
    Swal.fire({
      icon: "success",
      title: "Cuenta creada con exito!",
      text: "Ahora puede ingresar a nuestra plataforma",
      footer: '<a href="login.html"><b>Continuar hacia Login</b></a>',
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Controle que las contraseñas sean iguales",
    });
  }
}

//Se agrega la funcion al evento click en el formulario

submit.addEventListener("click", crearUsuario);

submit.addEventListener("click", function (event) {
  event.preventDefault();
});
