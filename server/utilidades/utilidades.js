const crearMensaje = (nombre, mensaje) => {
    // Regresamos
    return {
        nombre,
        mensaje,
        fecha: new Date().getTime(),
    }
}

module.exports = {
    crearMensaje,
}