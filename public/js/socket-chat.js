var socket = io();

// Para poder obtener el nombre.
var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    // nombre es igual a lo que voy a recibir por los params.
    nombre: params.get('nombre'),
    sala: params.get('sala')
};



socket.on('connect', function() {
    console.log('Conectado al servidor');

    // Comunicarme con el backEnd.
    // Notificamos quein entra al chat.
    socket.emit('entrarChat', usuario, function(resp) {
        //console.log('Usuarios conectados', resp);
        renderizarUsuarios(resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    //console.log('Servidor:', mensaje);
    // false, es para que le aplique el estilo segun la condicion en el archivo socket-chat-jquery.js
    renderizarMensajes(mensaje, false);

    scrollBottom();
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {
    console.log(personas);
    renderizarUsuarios(personas);
});

// Mensajes privados.   hay que ir a la parte del servidor (socket.js) para que emita.
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje Privado:', mensaje);

});