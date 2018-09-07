class Usuarios {
    constructor() {
        this.personas = [];
    }

    // Funcion para agregar persona al chat.
    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        };

        // Agregarmos la persona al arreglo personas.
        this.personas.push(persona);

        // Regresamos todas las personas del chat.
        return this.personas;
    }

    // Funcion para obtener una persona en particular segun el id.
    getPersona(id) {
        // filter para obtener una persona por cada interacion.
        let persona = this.personas.filter(persona => {
            return persona.id === id;

            // Filter tambein regresa un arreglo. buscamos la primera posicion.
            // al poener [0], este siempre sera un unico registro.
        })[0];

        // Si no encuentra una persona por id, sera undefine
        // Si nuentra la persona regresa el objeto.
        return persona;
    }

    // Obtener todas las personas.
    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        // Obtener una persona por cada iteracion.
        let personasEnSala = this.personas.filter(persona => {
            // Que sea identica a la sala que estoy enviando como argumento.
            return persona.sala === sala;
        });
        return personasEnSala;
    }

    // Eliminar una persona del arreglo personas.
    // Por si se desconecta, sale de la sala.
    // Esta funcion regresara un nuevo arreglo.
    borrarPersona(id) {
        // Identificamos a la persona que sale de la sala antes de sacarla del arreglo.
        // Asi guardamos la referencia.
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(persona => {
            // Regresar todas las personas, cuya perona.id sea diferente al id que me estan enviando.
            return persona.id != id;
        });

        // Retornamos la persona borrada.
        return personaBorrada;
    }


}

module.exports = {
    Usuarios,
}