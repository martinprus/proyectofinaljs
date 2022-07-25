// El nombre de usuario toma el valor desde el usuario logueado en el localStorage
// Cargamos la fecha del dia para que aparezca en la web usando luxon

const DateTime = luxon.DateTime;

let nombre = localStorage.getItem("usuarioLogueado");
let hoy = DateTime.now();

let titulo = document.getElementById("titulo");
titulo.innerHTML = `Bienvenido a criptolandia ${nombre}`;
let fecha = document.getElementById("fecha");
fecha.innerHTML = `Hoy es ${hoy.day}/${hoy.month}/${hoy.year}`;

//Clase activoCartera para cada criptomoneda con su cantidad y precio

class activoCartera {
  constructor(id, precio, cantidad) {
    this.id = id.toUpperCase();
    this.precio = parseFloat(precio);
    this.cantidad = parseFloat(cantidad);
  }
}

//Si el usuario ya opero, se carga su cartera desde el localStarage sino se utiliza la cartera
// por defecto solo con el saldo en usd

let cartera = [];
if (localStorage.getItem(nombre) != null) {
  cartera = JSON.parse(localStorage.getItem(nombre));
} else {
  cartera.push(new activoCartera("USD", 1, 0));
  cartera.push(new activoCartera("BTC", 0, 0));
  cartera.push(new activoCartera("ETH", 0, 0));
}

//Precios de ETH y BTC en la web, desde el fetch le asignamos los valores

let priceBTC = document.getElementById("precioBTC");
let priceETH = document.getElementById("precioETH");

//Desde la api de binance mediante un fetch traemos los precios de BTC y ETH y los asignamos a los valores de la cartera

let endpointprecios =
  "https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22%5D";

fetch(endpointprecios)
  .then((response) => response.json())
  .then((datos) => {
    precioBTC = datos[0].price;
    precioETH = datos[1].price;
    cartera[1].precio = Math.round(precioBTC * 100) / 100;
    cartera[2].precio = Math.round(precioETH * 100) / 100;
    console.log(cartera[2].precio, cartera[1].precio);
    priceBTC.innerHTML = cartera[1].precio;
    priceETH.innerHTML = cartera[2].precio;
  });


// //Funcion para encontrar el indice de un activo segun su ID para la funcion compra/venta

function buscarIndex(activo) {
  return cartera.findIndex((element) => element.id === activo);
}

//Funcion compro o vendo para comprar y vender criptomonedas agregadas previamente
//Cuando compro baja el saldo en dolares y viceversa
//Tambien se almacenan las operaciones realizadas en una lista

const listadoOperaciones = [];

function comprarCripto() {
  activo = ticker.value.toUpperCase();
  cantidad = parseFloat(cantidadCripto.value);
  indice = buscarIndex(activo);
  if (indice != -1 && cantidad * cartera[indice].precio < cartera[0].cantidad) {
    let ahora = DateTime.now();
    let registro = `Horario operacion: ${ahora.hour}:${ahora.minute}:${
      ahora.second
    } - Compra: ${cantidad} ${activo} a ${cartera[indice].precio}. Total $${
      cartera[indice].precio * cantidad
    }`;
    listadoOperaciones.push(registro);
    cartera[indice].cantidad += cantidad;
    cartera[0].cantidad -= cantidad * cartera[indice].precio;
    ticker.value = "";
    cantidadCripto.value = "";
    Toastify({
      avatar:
        "https://img.freepik.com/premium-vector/money-pixel-art-style_505135-34.jpg",
      text: "Compra realizada con exito",
      style: {
        background: "linear-gradient(to right, #27C61E, #0D6C08)",
      },
      offset: {
        x: 70,
      },
    }).showToast();
  } else {
    Toastify({
      avatar:
        "https://img.freepik.com/premium-vector/money-pixel-art-style_505135-34.jpg",
      text: "Error en la compra, controle su saldo y cantidades ingresadas",
      style: {
        background: "linear-gradient(to right, #D32D4E, #FF0033)",
      },
      offset: {
        x: 70,
      },
    }).showToast();
    ticker.value = "";
    cantidadCripto.value = "";
  }
}

function venderCripto() {
  activo = ticker.value.toUpperCase();
  cantidad = parseFloat(cantidadCripto.value) * -1;
  indice = buscarIndex(activo);
  if (indice != -1 && cartera[indice].cantidad + cantidad >= 0) {
    let ahora = DateTime.now();
    let registro = `Horario operacion: ${ahora.hour}:${ahora.minute}:${
      ahora.second
    } - Venta: ${cantidad * -1} ${activo} a ${cartera[indice].precio}. Total $${
      cartera[indice].precio * cantidad * -1
    }`;
    listadoOperaciones.push(registro);
    cartera[indice].cantidad += cantidad;
    cartera[0].cantidad -= cantidad * cartera[indice].precio;
    ticker.value = "";
    cantidadCripto.value = "";
    Toastify({
      avatar:
        "https://img.freepik.com/premium-vector/money-pixel-art-style_505135-34.jpg",
      text: "Venta realizada con exito",
      style: {
        background: "linear-gradient(to right, #EF400C, #E67506)",
      },
      offset: {
        x: 70,
      },
    }).showToast();
  } else {
    Toastify({
      avatar:
        "https://img.freepik.com/premium-vector/money-pixel-art-style_505135-34.jpg",
      text: "Error en la compra, controle su saldo y cantidades ingresadas",
      style: {
        background: "linear-gradient(to right, #D32D4E, #FF0033)",
      },
      offset: {
        x: 70,
      },
    }).showToast();
    ticker.value = "";
    cantidadCripto.value = "";
  }
}

// Creamos la cartera en el DOM y aparecen los valores pre cargados

for (activo of cartera) {
  let totalUSD = Math.round(activo.precio * activo.cantidad * 100) / 100;
  let cantidadRedondeada = Math.round(activo.cantidad * 100) / 100;
  let padre = document.getElementById("cartera");
  let li = document.createElement("li");
  li.innerHTML = `Su saldo de ${activo.id} es de ${cantidadRedondeada} -- Total: u$s ${totalUSD}`;
  padre.append(li);
}

// Funcion para actualizar la cartera automáticamente al realizar una operacion (Compra venta o carga de dolares)

function actualizarCartera() {
  let padre = document.getElementById("cartera");
  padre.innerHTML = "";
  for (activo of cartera) {
    let totalUSD = Math.round(activo.precio * activo.cantidad * 100) / 100;
    let cantidadRedondeada = Math.round(activo.cantidad * 100) / 100;
    let li = document.createElement("li");
    li.innerHTML = `Su saldo de ${activo.id} es de ${cantidadRedondeada} -- Total: u$s ${totalUSD}`;
    padre.append(li);
  }
}

// Cargamos los objetos del dom de la seccion carga saldo

let cantidadDolares = document.getElementById("cantidadDolares");
let cargaDolares = document.getElementById("cargaDolares");
let nuevoSaldo = document.getElementById("nuevoSaldo");

// Agregamos los eventos al boton cargar

cargaDolares.addEventListener("click", cargarDolares);
cargaDolares.addEventListener("click", actualizarCartera);

// Funcion carga de dólares, el usuario elije la cantidad y se actualiza su saldo

function cargarDolares() {
  if (cantidadDolares.value >= 0 && cantidadDolares.value) {
    cartera[0].cantidad = cartera[0].cantidad + parseInt(cantidadDolares.value);
    nuevoSaldo.innerText = "Su nuevo saldo es: " + cartera[0].cantidad;
    cantidadDolares.value = "";
  } else {
    Toastify({
      avatar:
        "https://img.freepik.com/premium-vector/money-pixel-art-style_505135-34.jpg",
      text: "Ingrese una cantidad de u$s válida",
      style: {
        background: "linear-gradient(to right, #D32D4E, #FF0033)",
      },
      offset: {
        x: 70,
      },
    }).showToast();
  }
}

//Al realizar operaciones el listado se va almacenando en local storage

function guardarRegistro() {
  localStorage.setItem("operaciones", JSON.stringify(listadoOperaciones));
}

// Creamos las variables de la seccion compra/venta

let ticker = document.getElementById("ticker");
let cantidadCripto = document.getElementById("cantidadCripto");
let comprar = document.getElementById("comprar");
let vender = document.getElementById("vender");

// Agregamos eventos para actualizar los saldos a los botones

comprar.addEventListener("click", comprarCripto);
vender.addEventListener("click", venderCripto);
comprar.addEventListener("click", actualizarCartera);
vender.addEventListener("click", actualizarCartera);
comprar.addEventListener("click", mostrarOperaciones);
vender.addEventListener("click", mostrarOperaciones);

// Sección final donde figura el saldo total en USD de la cuenta

saldoTotal = document.getElementById("saldoTotal");
botonSaldo = document.getElementById("botonSaldo");
botonSaldo.addEventListener("click", totalCartera);

// Primero tomamos los valores totales, los agregamos a un array y luego lo sumamos
// Ese valor lo agregamos al "p" saldoTotal

function totalCartera() {
  let totales = [];
  cartera.forEach((activo) => {
    totales.push(activo.cantidad * activo.precio);
  });
  totalDolares = totales.reduce(
    (acumulador, elemento) => acumulador + elemento,
    0
  );
  saldoTotal.innerText = "Su saldo total es de: u$s " + totalDolares;
}

//Guardamos la cartera en localStorage con la key del usuario para mostrarla luego del login
//Asignamos la funcion al boton guardar cartera
guardarCartera = document.getElementById("guardarCartera");
function almacenarCartera() {
  localStorage.setItem(nombre, JSON.stringify(cartera));
}

guardarCartera.addEventListener("click", almacenarCartera);

//Funcion para mostrar la lista de operaciones realizadas
//Toma los valores almacenados en la lista de operaciones y los va agregando

function mostrarOperaciones() {
  let divContenedor = document.getElementById("registroOperaciones");
  divContenedor.innerHTML = "";
  for (operacion of listadoOperaciones) {
    let p = document.createElement("p");
    p.innerText = operacion;
    divContenedor.append(p);
  }
}

//Boton LogOut
//Cuando se "cierra la sesion, el usuario logueado en el local storage se deja vacío"

let logOut = document.getElementById("logOut");

function clickLogOut() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success m-1",
      cancelButton: "btn btn-danger m-1",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "¿Está seguro que desea salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, cerrar sesión",
      cancelButtonText: "No, permanecer en la página",
      reverseButtons: false,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Hasta luego!",
          text: "Su sesión ha sido cerrada.",
          icon: "success",
          footer: '<a href="..index.html">Volver al inicio</a>',
        });
        localStorage.setItem("usuarioLogueado", "");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
}

logOut.addEventListener("click", clickLogOut);
