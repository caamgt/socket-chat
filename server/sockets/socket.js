const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();
io.on('connection', (client) => {

    // Escuhamos quien entra al chat.
    client.on('entrarChat', (data, callback) => {

        // Validamos para asegurarnos que venga el nombre.
        // Si no viene el nombre
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        // Funcion primordial para conectar un usuario a una sala.
        client.join(data.sala);

        // Agregamos el nombre a la clase.
        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        // Vamos a emitir a todos los usuarios cuando una persona sale o entra al chat.
        // 'to()' para notificar solo a las personas que estan dentro de la misma sala de chat.
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));
        // Retornamos las personas conectadas en la misma sala.
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    // En la data viene toda la informacion
    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        // Emitir a todos los usuarios el nuemensaje, siempre que esten en la misma sala
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);


        // Despues de notificar a todos, regresa el mensaje.
        callback(mensaje);
    });

    // Desconexion del chat.
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        // Notificamos que el usuario salio del chat.
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    // Mensajes prievados.
    client.on('mensajePrivado', data => {
        // Para saver que persona lo esta enviando.
        let persona = usuarios.getPersona(client.id);
        // data.mensaje, es el mensaje que vamos a enviar. siempre validemos que el mensaje venga en la data.

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});