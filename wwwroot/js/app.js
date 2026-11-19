
// ======================================================
// 1. DATOS Y VARIABLES GLOBALES
// ======================================================

const tareas = [];

const API_URL = "http://localhost:5098/api/tarea";

let tareaEditando = null;
let fechaCalendario = new Date();


// ======================================================
// 2. ELEMENTOS DEL DOM
// ======================================================

// Formulario
const formulario = document.querySelector(".formulario-tarea");
const tituloFormulario = document.querySelector(".titulo-formulario h1");
const botonCrear = document.querySelector(".btn-crear");

const inputTitulo = document.querySelector("#titulo");
const inputDescripcion = document.querySelector("#descripcion");
const inputEstado = document.querySelector("#estado");
const inputFecha = document.querySelector("#fechaVencimiento");

const erroresValidacion = document.querySelector("#errores-validacion");

// Listas
const listaMisTareas = document.querySelector(".lista-mis-tareas");
const listaProximasTareas = document.querySelector(".lista-tareas");

// Contadores y filtros
const tareasTotales = document.querySelector(".tareas-totales");
const filtroTarjetas = document.querySelector(".filtro-activo");

const tareasPendientes = document.querySelector(".tareas-pendientes");
const tareasEnProgreso = document.querySelector(".tareas-en-progreso");
const tareasCompletadas = document.querySelector(".tareas-completadas");

// Estadísticas del panel
const vistaTareasPendientes = document.querySelector(".vistaPendientes");
const vistaTareasCurso = document.querySelector(".vistaEnCurso");
const vistaTareasCompletadas = document.querySelector(".vistaCompletadas");

const progresoTareas = document.querySelector(".progreso-tareas");
const barraLlenado = document.querySelector(".progreso-completado");
const tareasVencidas = document.querySelector(".tareasVencidas");

// Calendario
const tituloMes = document.querySelector("#mesAnio");
const contenedorDias = document.querySelector(".dias-mes");

const botonMesAnterior = document.querySelector("#mesAnterior");
const botonMesSiguiente = document.querySelector("#mesSiguiente");


// Desactivar la validación automática del navegador.
// Así podremos mostrar nuestros propios mensajes.

formulario.noValidate = true;


// ======================================================
// 3. FUNCIONES DE VALIDACIÓN
// ======================================================

// Mostrar errores de validación

function mostrarErroresValidacion(errores) {

    erroresValidacion.innerHTML = "";

    const listaErrores = document.createElement("ul");

    Object.values(errores).flat().forEach(function (mensaje) {

        const elemento = document.createElement("li");

        elemento.textContent = mensaje;

        listaErrores.appendChild(elemento);

    });

    erroresValidacion.appendChild(listaErrores);

}


// Mostrar un mensaje general

function mostrarErrorGeneral(mensaje) {

    erroresValidacion.innerHTML = "";

    const elemento = document.createElement("p");

    elemento.textContent = mensaje;

    erroresValidacion.appendChild(elemento);

}


// Validar los campos antes de enviar

function validarFormulario() {

    const errores = {};

    const titulo = inputTitulo.value.trim();

    const prioridad = document.querySelector(
        'input[name="prioridad"]:checked'
    );

    if (titulo === "") {

        errores.Titulo = ["El título es obligatorio."];

    }

    if (titulo.length > 100) {

        errores.Titulo = [
            "El título no puede superar los 100 caracteres."
        ];

    }

    if (!prioridad) {

        errores.Prioridad = [
            "Debes seleccionar una prioridad."
        ];

    }

    if (Object.keys(errores).length > 0) {

        mostrarErroresValidacion(errores);

        return false;

    }

    return true;

}


// ======================================================
// 4. FUNCIONES DE ESTADÍSTICAS
// ======================================================

// Actualizar los contadores

function actualizarContadores() {

    const pendientes = tareas.filter(
        tarea => tarea.estado === "Pendiente"
    );

    const enProgreso = tareas.filter(
        tarea => tarea.estado === "En progreso"
    );

    const completadas = tareas.filter(
        tarea => tarea.estado === "Completada"
    );

    tareasTotales.textContent =
        `${tareas.length} tareas en total`;

    filtroTarjetas.textContent =
        `Todas · ${tareas.length}`;

    tareasPendientes.textContent =
        `Pendientes · ${pendientes.length}`;

    tareasEnProgreso.textContent =
        `En progreso · ${enProgreso.length}`;

    tareasCompletadas.textContent =
        `Completadas · ${completadas.length}`;

}


// Actualizar estadísticas del panel

function actualizarPanel() {

    const pendientes = tareas.filter(
        tarea => tarea.estado === "Pendiente"
    ).length;

    const enProgreso = tareas.filter(
        tarea => tarea.estado === "En progreso"
    ).length;

    const completadas = tareas.filter(
        tarea => tarea.estado === "Completada"
    ).length;

    vistaTareasPendientes.textContent = pendientes;
    vistaTareasCurso.textContent = enProgreso;
    vistaTareasCompletadas.textContent = completadas;


    // Calcular porcentaje de progreso

    const porcentaje = tareas.length > 0 ? Math.round((completadas / tareas.length) * 100): 0;

    progresoTareas.textContent =
        `${completadas} de ${tareas.length} tareas completadas · ${porcentaje}%`;

    barraLlenado.style.width = `${porcentaje}%`;


    // Calcular tareas vencidas

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    const vencidas = tareas.filter(tarea => {

        if (!tarea.fechaVencimiento) {
            return false;
        }

        const fecha = new Date(
            `${tarea.fechaVencimiento}T00:00:00`
        );

        return tarea.estado !== "Completada" &&
            fecha < hoy;

    }).length;

    tareasVencidas.textContent = vencidas;

}


// ======================================================
// 5. PRÓXIMAS TAREAS
// ======================================================

function mostrarProximasTareas() {

    listaProximasTareas.innerHTML = "";

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);


    // Filtrar tareas pendientes o en progreso

    const proximas = tareas
        .filter(tarea => {

            if (!tarea.fechaVencimiento) {
                return false;
            }

            const fecha = new Date(
                `${tarea.fechaVencimiento}T00:00:00`
            );

            return tarea.estado !== "Completada" &&
                fecha >= hoy;
        })

        // Ordenar por fecha de vencimiento

        .sort((a, b) => {

            return a.fechaVencimiento.localeCompare(
                b.fechaVencimiento
            );
        })

        // Mostrar máximo cinco tareas

        .slice(0, 5);

    // Mensaje si no existen tareas

    if (proximas.length === 0) {

        const mensaje = document.createElement("li");
        mensaje.textContent = "No tienes próximas tareas.";

        listaProximasTareas.appendChild(mensaje);

        return;

    }

    // Mostrar las tareas

    proximas.forEach(function (tarea) {

        const elemento = document.createElement("li");
        elemento.textContent = tarea.titulo;

        listaProximasTareas.appendChild(elemento);

    });

}

// ======================================================
// 6. MOSTRAR LAS TAREAS
// ======================================================

function mostrarTareas(lista = tareas) {

    listaMisTareas.innerHTML = "";

    lista.forEach(function (tarea) {

        // Tarjeta principal

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarea");

        // Información de la tarea

        const informacion = document.createElement("div");

        informacion.classList.add("tarea-info");

        const tituloTarjeta = document.createElement("h3");
        tituloTarjeta.textContent = tarea.titulo;

        const descripcionTarjeta = document.createElement("p");
        descripcionTarjeta.textContent = tarea.descripcion || "";


        const fechaTarjeta = document.createElement("span");
        fechaTarjeta.textContent = tarea.fechaVencimiento || "Sin fecha";


        // Prioridad

        const prioridadTarjeta = document.createElement("span");

        prioridadTarjeta.classList.add(
            "prioridad",
            tarea.prioridad.toLowerCase()
        );

        prioridadTarjeta.textContent = tarea.prioridad;


        // Agregar información

        informacion.appendChild(tituloTarjeta);
        informacion.appendChild(descripcionTarjeta);
        informacion.appendChild(fechaTarjeta);


        // Contenedor de estados

        const contenedorEstados = document.createElement("div");
        contenedorEstados.classList.add("estado-tarea");


        const estados = [
            "Pendiente",
            "En progreso",
            "Completada"
        ];


        // Crear botones de estado

        estados.forEach(function (estado) {

            const botonEstado = document.createElement("button");

            botonEstado.type = "button";
            botonEstado.textContent = estado;


            if (tarea.estado === estado) {

                botonEstado.classList.add("seleccionado");

            }


            botonEstado.addEventListener("click", function () {

                cambiarEstado(tarea, estado);

            });

            contenedorEstados.appendChild(botonEstado);

        });


        // Contenedor de acciones

        const contenedorAcciones = document.createElement("div");
        contenedorAcciones.classList.add("acciones-tarea");


        // Botón editar

        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.classList.add("btn-editar");
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", function () {

            editarTarea(tarea);

        });


        // Botón eliminar

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.classList.add("btn-eliminar");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", function () {

            eliminarTarea(tarea);

        });


        // Agregar botones de acciones

        contenedorAcciones.appendChild(botonEditar);
        contenedorAcciones.appendChild(botonEliminar);


        // Construir tarjeta

        tarjeta.appendChild(informacion);
        tarjeta.appendChild(prioridadTarjeta);
        tarjeta.appendChild(contenedorEstados);
        tarjeta.appendChild(contenedorAcciones);

        // Agregar tarjeta a la lista

        listaMisTareas.appendChild(tarjeta);

    });

}


// ======================================================
// 7. CAMBIAR ESTADO DE UNA TAREA
// ======================================================

async function cambiarEstado(tarea, nuevoEstado) {

    try {

        const tareaActualizar = {

            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            prioridad: tarea.prioridad,
            estado: nuevoEstado,
            fechaVencimiento: tarea.fechaVencimiento || null

        };


        const respuesta = await fetch(
            `${API_URL}/${tarea.id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(tareaActualizar)

            }
        );

        if (!respuesta.ok) {

            throw new Error("No se pudo cambiar el estado.");

        }

        await cargarTareas();

        console.log("Estado actualizado correctamente.");

    } catch (error) {

        mostrarErrorGeneral(error.message);

        console.error("Error al cambiar estado:", error);

    }

}

// ======================================================
// 8. EDITAR UNA TAREA
// ======================================================

function editarTarea(tarea) {

    tareaEditando = tarea;
    tituloFormulario.textContent = "Editar tarea";
    botonCrear.textContent = "Guardar cambios";

    inputTitulo.value = tarea.titulo;
    inputDescripcion.value = tarea.descripcion || "";
    inputEstado.value = tarea.estado;
    inputFecha.value = tarea.fechaVencimiento || "";


    // Seleccionar prioridad

    const prioridadSeleccionada = document.querySelector(
        `input[name="prioridad"][value="${tarea.prioridad}"]`
    );


    if (prioridadSeleccionada) {

        prioridadSeleccionada.checked = true;

    }


    // Limpiar errores anteriores

    erroresValidacion.innerHTML = "";
    location.hash = "vista-nueva-tarea";

}


// ======================================================
// 9. LIMPIAR FORMULARIO
// ======================================================

function limpiarFormulario() {

    formulario.reset();
    erroresValidacion.innerHTML = "";
    tareaEditando = null;
    tituloFormulario.textContent = "Nueva tarea";
    botonCrear.textContent = "Crear tarea";

}

// ======================================================
// 10. EVENTO DEL FORMULARIO
// ======================================================

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Validar los campos

    if (!validarFormulario()) {

        return;

    }

    // Determinar si se crea o actualiza

    if (tareaEditando !== null) {

        await actualizarTarea();

    } else {

        await crearTarea();

    }

});

// ======================================================
// 11. FUNCIONES DEL CALENDARIO
// ======================================================

// Actualizar título del calendario

function actualizarTituloMes() {

    tituloMes.textContent = fechaCalendario.toLocaleDateString(
        "es-SV",
        {
            month: "long",
            year: "numeric"
        }
    );

}

// Generar los días del calendario

function generarDias() {

    const mesActual = fechaCalendario.getMonth();
    const anioActual = fechaCalendario.getFullYear();


    // Obtener cantidad de días del mes

    const diasDelMes = new Date(
        anioActual,
        mesActual + 1,
        0
    ).getDate();

    // Obtener el primer día del mes

    const primerDiaMes = new Date(
        anioActual,
        mesActual,
        1
    ).getDay();


    // Ajustar para que la semana comience en lunes

    const espaciosVacios = (primerDiaMes + 6) % 7;

    // Limpiar calendario

    contenedorDias.innerHTML = "";

    // Generar espacios vacíos

    for (let i = 0; i < espaciosVacios; i++) {

        const espacio = document.createElement("div");
        espacio.classList.add("dia", "vacio");
        contenedorDias.appendChild(espacio);
    }

    // Generar días del mes

    for (let i = 1; i <= diasDelMes; i++) {

        const nuevoDia = document.createElement("div");
        nuevoDia.classList.add("dia");
        nuevoDia.textContent = i;

        // Crear fecha con formato YYYY-MM-DD

        const fecha = `${anioActual}-${String(mesActual + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        nuevoDia.dataset.fecha = fecha;

        // Buscar tareas que vencen ese día

        const tareasDelDia = tareas.filter(
            tarea => tarea.fechaVencimiento === fecha);

        // Mostrar tareas dentro del día

        tareasDelDia.forEach(function (tarea) {

            const evento = document.createElement("span");
            evento.classList.add(
                "evento",
                tarea.prioridad.toLowerCase());

            evento.textContent = tarea.titulo;
            nuevoDia.appendChild(evento);

        });

        // Agregar día al calendario

        contenedorDias.appendChild(nuevoDia);
    }

}

// ======================================================
// 12. EVENTOS DEL CALENDARIO
// ======================================================

// Mes anterior

botonMesAnterior.addEventListener("click", function () {

    fechaCalendario.setMonth(
        fechaCalendario.getMonth() - 1);

    actualizarTituloMes();
    generarDias();

});

// Mes siguiente

botonMesSiguiente.addEventListener("click", function () {

    fechaCalendario.setMonth(
        fechaCalendario.getMonth() + 1
    );

    actualizarTituloMes();
    generarDias();

});

// ======================================================
// 13. EVENTOS DE LOS FILTROS
// ======================================================

// Mostrar todas las tareas

filtroTarjetas.addEventListener("click", function () {

    mostrarTareas(tareas);

});

// Mostrar tareas pendientes

tareasPendientes.addEventListener("click", function () {

    const filtro = tareas.filter(
        tarea => tarea.estado === "Pendiente"
    );

    mostrarTareas(filtro);

});

// Mostrar tareas en progreso

tareasEnProgreso.addEventListener("click", function () {

    const filtro = tareas.filter(
        tarea => tarea.estado === "En progreso"
    );

    mostrarTareas(filtro);

});

// Mostrar tareas completadas

tareasCompletadas.addEventListener("click", function () {

    const filtro = tareas.filter(
        tarea => tarea.estado === "Completada"
    );

    mostrarTareas(filtro);

});

// Abrir formulario de nueva tarea

const botonesNuevaTarea = document.querySelectorAll(".btn-nueva-tarea");

botonesNuevaTarea.forEach(function (boton) {

    boton.addEventListener("click", function () {

        limpiarFormulario();
        location.hash = "vista-nueva-tarea";

    });

});


// ======================================================
// 14. ACTUALIZAR TODA LA INTERFAZ
// ======================================================

function actualizarInterfaz() {

    actualizarContadores();
    actualizarPanel();
    mostrarProximasTareas();
    mostrarTareas(tareas);
    actualizarTituloMes();
    generarDias();

}


// ======================================================
// 15. COMUNICACIÓN CON LA API
// ======================================================


// Obtener todas las tareas

async function cargarTareas() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {

            throw new Error("Error al obtener las tareas.");

        }

        const datos = await respuesta.json();

        // Actualizar el array principal

        tareas.splice(0, tareas.length, ...datos);


        // Actualizar interfaz

        actualizarInterfaz();
        console.log("Tareas cargadas correctamente.", datos);

    } catch (error) {

        console.error("Error al conectar con la API:", error);

    }
}

// Crear una tarea

async function crearTarea() {

    try {

        const nuevaTarea = {

            titulo: inputTitulo.value.trim(),

            descripcion: inputDescripcion.value.trim(),

            prioridad: document.querySelector(
                'input[name="prioridad"]:checked'
            ).value,

            estado: inputEstado.value,
            fechaVencimiento: inputFecha.value || null
        };

        const respuesta = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(nuevaTarea)

        });

        // Comprobar errores del backend

        if (!respuesta.ok) {

            const datosError = await respuesta.json();

            if (datosError.errors) {

                mostrarErroresValidacion(datosError.errors);

                return;
            }

            mostrarErrorGeneral("No se pudo crear la tarea. Verifica los datos.");
            return;
        }

        // Finalizar creación

        limpiarFormulario();
        await cargarTareas();
        location.hash = "vista-tareas";
        console.log("Tarea creada correctamente.");

    } catch (error) {

        mostrarErrorGeneral(
            "No se pudo conectar con el servidor."
        );

        console.error("Error al crear tarea:", error);

    }

}

// Actualizar una tarea

async function actualizarTarea() {

    try {

        const tareaActualizar = {

            titulo: inputTitulo.value.trim(),

            descripcion: inputDescripcion.value.trim(),

            prioridad: document.querySelector(
                'input[name="prioridad"]:checked'
            ).value,

            estado: inputEstado.value,
            fechaVencimiento: inputFecha.value || null

        };

        const respuesta = await fetch(
            `${API_URL}/${tareaEditando.id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(tareaActualizar)
            }
        );

        // Comprobar errores del backend

        if (!respuesta.ok) {

            const datosError = await respuesta.json();

            if (datosError.errors) {

                mostrarErroresValidacion(datosError.errors);
                return;

            }

            mostrarErrorGeneral(
                "No se pudo actualizar la tarea."
            );

            return;

        }


        // Finalizar actualización

        limpiarFormulario();
        await cargarTareas();
        location.hash = "vista-tareas";
        console.log("Tarea actualizada correctamente.");

    } catch (error) {

        mostrarErrorGeneral(
            "No se pudo conectar con el servidor."
        );

        console.error("Error al actualizar tarea:", error);
    }

}

// Eliminar una tarea

async function eliminarTarea(tarea) {

    try {

        const respuesta = await fetch(
            `${API_URL}/${tarea.id}`,
            {
                method: "DELETE"
            }
        );

        if (!respuesta.ok) {

            throw new Error("Error al eliminar la tarea.");

        }

        await cargarTareas();

        location.hash = "vista-tareas";

        console.log("Tarea eliminada correctamente.");

    } catch (error) {

        console.error("Error al eliminar tarea:", error);

    }
}


// ======================================================
// 16. INICIALIZACIÓN
// ======================================================

// Ejecutar cuando se carga la aplicación

cargarTareas();
