// Bandera para evitar bucles infinitos de publicación-suscripción
let actualizandoDesdeMQTT = false;
let estadoRiego = false;  // Variable para controlar el estado del riego (on/off)


// Conexión a HiveMQ Cloud
const clienteMQTT = mqtt.connect('wss://53297501625b4e66abdbbfcf46395f40.s1.eu.hivemq.cloud:8884/mqtt', {
    clientId: 'clienteId_' + Math.random().toString(16).substr(2, 8),
    username: 'elmaxter687', // Reemplazar con tu usuario
    password: 'Ch#1424500',  // Reemplazar con tu contraseña
});


clienteMQTT.on('connect', () => {
    console.log('Conectado a HiveMQ Cloud');
    clienteMQTT.subscribe('invernadero/temperatura');
    clienteMQTT.subscribe('invernadero/humedad');
    clienteMQTT.subscribe('invernadero/humedad_suelo');
});

// Actualizar los datos de temperatura, humedad y pH (opcional)
clienteMQTT.on('message', (tema, mensaje) => {
    const payload = parseFloat(mensaje.toString());
    console.log(`Mensaje recibido en ${tema}: ${payload}`);

    if (tema === 'invernadero/temperatura') {
        const temperaturaSpan = document.getElementById('temperatura');
        const slider = document.getElementById('sliderTemperatura');
        const marcador_temperatura = document.getElementById('marcadorTemperatura');
        const barraTemperatura = document.getElementById('barraTemperatura');

        // Evitar bucles infinitos de publicación
        actualizandoDesdeMQTT = true;
        if (slider.value != payload) {
            slider.value = payload; // Actualizar el slider con el valor recibido
            temperaturaSpan.textContent = `${payload} °C`; // Actualizar el valor mostrado
        }
        actualizandoDesdeMQTT = false;
    
        // Calcular la posición del marcador en función de la temperatura
        const maxTemperatura = 50; // Máximo valor del slider
        let porcentajeTemperatura = (payload / maxTemperatura) * 100;

        if (porcentajeTemperatura < 0) {
            porcentajeTemperatura = 0;
        } else if (porcentajeTemperatura > 100) {
            porcentajeTemperatura = 100;
        }

        marcador_temperatura.style.left = `${porcentajeTemperatura}%`;
    

        // Manejar el parpadeo en función de los valores
        if (payload < 15 || payload > 20) {
            temperaturaSpan.classList.remove('temperatura');
            temperaturaSpan.classList.add('parpadeo', 'valor');
            barraTemperatura.classList.add('parpadeo');
            marcador_temperatura.classList.add('parpadeo');
        } else {
            temperaturaSpan.classList.remove('parpadeo', 'valor');
            temperaturaSpan.classList.add('temperatura');
            barraTemperatura.classList.remove('parpadeo');
            marcador_temperatura.classList.remove('parpadeo');
        }
    }

    if (tema === 'invernadero/humedad') {
        const humedadSpan = document.getElementById('humedad');
        //const slider = document.getElementById('sliderHumedad');
        const marcador_humedad = document.getElementById('marcadorHumedad');
        const barraHumedad = document.getElementById('barraHumedad');

        // Actualizar el valor de humedad
        document.getElementById('humedad').textContent = `${payload}%`;

        // Evitar bucles infinitos de publicación
        /*ActiveXObjectctualizandoDesdeMQTT = true;
        if (slider.value != payload) {
            slider.value = payload;
            humedadSpan.textContent = `${payload} %`;
        }
        actualizandoDesdeMQTT = false;
        */
        
        //Calcular la posición del marcador de humedad
        const porcentajeHumedad = payload;
        marcador_humedad.style.left = `${porcentajeHumedad}%`;

        // Manejar el parpadeo de la humedad
        if (payload < 65 || payload > 75) {
            humedadSpan.classList.remove('humedad');
            humedadSpan.classList.add('parpadeo', 'valor');
            barraHumedad.classList.add('parpadeo');
            marcador_humedad.classList.add('parpadeo');
        } else {
            humedadSpan.classList.remove('parpadeo', 'valor');
            humedadSpan.classList.add('humedad');
            barraHumedad.classList.remove('parpadeo');
            marcador_humedad.classList.remove('parpadeo');
        }
    }

    if (tema === 'invernadero/humedad_suelo') {
        const humedadSpan = document.getElementById('humedad_suelo');
        //const slider = document.getElementById('sliderHumedad');
        const marcador_humedad = document.getElementById('marcadorHumedad_suelo');
        const barraHumedad = document.getElementById('barraHumedad_suelo');

        // Actualizar el valor de humedad
        document.getElementById('humedad_suelo').textContent = `${payload}%`;

        //Calcular la posición del marcador de humedad
        const porcentajeHumedad = payload;
        marcador_humedad.style.left = `${porcentajeHumedad}%`;

        // Manejar el parpadeo de la humedad
        if (payload < 60 || payload > 70) {
            humedadSpan.classList.remove('humedad_suelo');
            humedadSpan.classList.add('parpadeo', 'valor');
            barraHumedad.classList.add('parpadeo');
            marcador_humedad.classList.add('parpadeo');
        } else {
            humedadSpan.classList.remove('parpadeo', 'valor');
            humedadSpan.classList.add('humedad_suelo');
            barraHumedad.classList.remove('parpadeo');
            marcador_humedad.classList.remove('parpadeo');
        }
    }
});
    


clienteMQTT.on('error', (err) => {
    console.error('Error de conexión:', err);
});


let riegoActivo = false;  // Variable para almacenar el estado del riego

// Función para alternar el estado del riego y publicar el cambio
function alternarBoton() {
    const boton = document.getElementById('boton-agua');
    
    riegoActivo = !riegoActivo; // Alterna el estado del riego

    // Actualiza el texto y el estilo del botón
    if (riegoActivo) {
        boton.innerText = "Detener riego";
        boton.classList.remove('control-button-abierto');
        boton.classList.add('control-button-cerrado');
        // Publicar el estado del riego en el tópico MQTT correspondiente
        clienteMQTT.publish('invernadero/riego', 1, { retain: true });

    } else {
        boton.innerText = "Regar plantas";
        boton.classList.remove('control-button-cerrado');
        boton.classList.add('control-button-abierto');
        clienteMQTT.publish('invernadero/riego', 0, { retain: true });
    }
}



// Función para actualizar el valor de la temperatura en el slider y el span
function actualizarTemperatura() {
    const slider = document.getElementById('sliderTemperatura');
    const temperaturaSpan = document.getElementById('temperatura');

    // Actualizar el valor del span con el valor del slider
    temperaturaSpan.textContent = slider.value + ' °C';
}

// Función para publicar el valor del slider
function publicarTemperatura() {
    const slider = document.getElementById('sliderTemperatura');
    const valor = parseFloat(slider.value);

    // Publicar el valor del slider en el tópico 'invernadero/temperatura'
    if (!actualizandoDesdeMQTT) {
        clienteMQTT.publish('invernadero/temperatura', valor.toString(), { retain: true });
    }
}

// Inicializar el valor de la temperatura al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('sliderTemperatura');
    slider.value = 0; // Valor inicial del slider
    actualizarTemperatura();

    // Publicar cada vez que el slider cambie
    slider.addEventListener('input', function() {
        actualizarTemperatura();
        publicarTemperatura();
    });


});


/*
//Función para actualizar el valor de la humedad en el slider y el span
function actualizarHumedad() {
    const slider = document.getElementById('sliderHumedad');
    const humedadSpan = document.getElementById('humedad');

    // Actualizar el valor del span con el valor del slider
    humedadSpan.textContent = slider.value + ' %';
}

// Función para publicar el valor del slider
function publicarHumedad() {
    const slider = document.getElementById('sliderHumedad');
    const valor = parseFloat(slider.value);

    // Publicar el valor del slider en el tópico 'invernadero/humedad'
    if (!actualizandoDesdeMQTT) {
        clienteMQTT.publish('invernadero/humedad', valor.toString(), { retain: true });
    }
}

// Inicializar el valor de la humedad al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('sliderHumedad');
    slider.value = 0; // Valor inicial del slider
    actualizarHumedad();

    // Publicar cada vez que el slider cambie
    slider.addEventListener('input', function() {
        actualizarHumedad();
        publicarHumedad();
    });
    */
