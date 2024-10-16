// Bandera para evitar bucles infinitos de publicación-suscripción
let actualizandoDesdeMQTT = false;

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
    clienteMQTT.subscribe('invernadero/ph');
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
            temperaturaSpan.classList.add('parpadeo', 'valor');
            barraTemperatura.classList.add('parpadeo');
            marcador_temperatura.classList.add('parpadeo');
        } else {
            temperaturaSpan.classList.remove('parpadeo', 'valor');
            barraTemperatura.classList.remove('parpadeo');
            marcador_temperatura.classList.remove('parpadeo');
        }
    }

    if (tema === 'invernadero/humedad') {
        const humedadSpan = document.getElementById('humedad');
        const slider = document.getElementById('sliderHumedad');
        const marcador_humedad = document.getElementById('marcadorHumedad');
        const barraHumedad = document.getElementById('barraHumedad');

        // Evitar bucles infinitos de publicación
        actualizandoDesdeMQTT = true;
        if (slider.value != payload) {
            slider.value = payload;
            humedadSpan.textContent = `${payload} %`;
        }
        actualizandoDesdeMQTT = false;

        // Calcular la posición del marcador de humedad
        const porcentajeHumedad = payload;
        marcador_humedad.style.left = `${porcentajeHumedad}%`;

        // Manejar el parpadeo de la humedad
        if (payload < 65 || payload > 75) {
            humedadSpan.classList.add('parpadeo', 'valor');
            barraHumedad.classList.add('parpadeo');
            marcador_humedad.classList.add('parpadeo');
        } else {
            humedadSpan.classList.remove('parpadeo', 'valor');
            barraHumedad.classList.remove('parpadeo');
            marcador_humedad.classList.remove('parpadeo');
        }
    }

    // Manejo del pH
    if (tema === 'invernadero/ph') {
        document.getElementById('ph').innerText = `${payload} pH`;

        // Calcular la posición del marcador de pH
        let porcentajePh;

        // Ajustar el porcentaje de acuerdo al pH
        if (payload <= 0) {
            porcentajePh = 0; // Colocar al inicio de la barra si el pH es 0 o menor
        } else if (payload >= 14) {
            porcentajePh = 100; // Colocar al final de la barra si el pH es mayor o igual al máximo
        } else {
            porcentajePh = (payload / 14) * 100; // Convertir el pH a porcentaje
        }

        const marcadorPh = document.getElementById('marcadorPh');
        marcadorPh.style.left = `${porcentajePh}%`; // Mover el marcador de pH

        // Manejar el parpadeo de pH
        const ph = document.getElementById('ph');
        const barraPh = document.getElementById('barraPh'); // Elemento de la barra de pH

        if (payload < 6 || payload > 7) {
            ph.classList.add('parpadeo', 'valor'); // Agregar la clase de parpadeo al texto
            barraPh.classList.add('parpadeo'); // Agregar la clase de parpadeo a la barra
            marcadorPh.classList.add('parpadeo'); // Agregar la clase de parpadeo al marcador de pH
        } else {
            ph.classList.remove('parpadeo', 'valor'); // Remover la clase de parpadeo del texto
            barraPh.classList.remove('parpadeo'); // Remover la clase de parpadeo de la barra
            marcadorPh.classList.remove('parpadeo'); // Remover la clase de parpadeo del marcador de pH
        }
    }
});

clienteMQTT.on('error', (err) => {
    console.error('Error de conexión:', err);
});


function alternarBoton() {
    const boton = document.getElementById('botonToggle');
    const iconoGrifo = document.getElementById('iconoGrifo');

    if (boton.innerText === "Abrir Llave") {
        boton.innerText = "Cerrar Llave";
        boton.classList.add('rojo');
        iconoGrifo.src = "grifo_abierto.png";
    } else {
        boton.innerText = "Abrir Llave";
        boton.classList.remove('rojo');
        iconoGrifo.src = "grifo_cerrado.png";
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


// Función para actualizar el valor de la humedad en el slider y el span
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
});
