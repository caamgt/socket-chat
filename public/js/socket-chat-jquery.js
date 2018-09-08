// Para poder usar el nombre de la sala.
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias de jQuery.
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

// Funciones para renderizar usuarios.
// Esta funcion recive a los usuario o personas que estan en el chat, este e sun arreglo como: [{},{},{}]
function renderizarUsuarios(personas) {
    // Para ver que estamos recibiendo.
    console.log(personas);

    // Para poner el nombre de la sala.
    var html = '';
    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    // Estamos esperando un arreglo.
    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        // data-id para capturar el id del usuario.
        html += '   <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    // El html del divUsuarios es igual al html que creamos arriba.
    divUsuarios.html(html);
}

// Recibimos el mensaje.
function renderizarMensajes(mensaje, yo) {
    let html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    // Para poner distinto estilo a mis mensaje y al de los demas.

    if (yo) {
        html += '<li class="reverse animated fadeIn">';
        html += '   <div class="chat-content">';
        html += '       <h5>' + mensaje.nombre + '</h5>';
        html += '       <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '   </div>';
        html += '   <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '   <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html += '   <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '   <div class="chat-content">';
        html += '       <h5>' + mensaje.nombre + '</h5>';
        html += '       <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '   </div>';
        html += '   <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Listeners
// Cuando se haga click en un 'a' dentro de divUsuarios.
divUsuarios.on('click', 'a', function() {
    // 'this' hace referencia a la etiqueta 'a'.
    // El 'id' es el de 'data-id'.
    var id = $(this).data('id');

    // Si existe el id
    if (id) {
        console.log(id);
    }
});

formEnviar.on('submit', function(e) {
    e.preventDefault();

    // trim() elima espacios atras y a delante.
    if (txtMensaje.val().trim().length === 0) {
        // Si es igual a cero, que no haga nada.
        return;
    }


    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        // .focus, para que el curso se quede en el input.
        txtMensaje.val('').focus();

        // true, ya que soy yo el que envia, asi aplica el estilo.
        renderizarMensajes(mensaje, true);

        scrollBottom();
    });


});