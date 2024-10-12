// script.js

// Configuración de la conexión
const mqttUrl = 'wss://53297501625b4e66abdbbfcf46395f40.s1.eu.hivemq.cloud:8884/mqtt'; // URL de HiveMQ para WebSockets
const client = mqtt.connect(mqttUrl, {
    clientId: 'clientId-' + Math.random().toString(16).substr(2, 8), // Generar un clientId único
    username: 'elmaxter687', // Reemplaza 'tu_usuario' con tu nombre de usuario
    password: 'Ch#1424500' // Reemplaza 'tu_contraseña' con tu contraseña
});

// Tópico al que deseas suscribirte
const topic = 'test/topic'; // Reemplaza 'test/topic' con el tópico que desees

// Elemento de la página donde se mostrará la temperatura
const temperatureDisplay = document.getElementById('temperature');

// Conectar al broker MQTT
client.on('connect', () => {
    console.log('Conectado a HiveMQ');
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Suscrito al tópico: ${topic}`);
        }
    });
});

// Recibir mensajes
client.on('message', (topic, message) => {
    // El mensaje es un Buffer, convertirlo a string
    const temperature = message.toString();
    console.log(`Mensaje recibido: ${temperature}`);
    
    // Actualizar el contenido del elemento HTML
    temperatureDisplay.textContent = `Temperatura: ${temperature} °C`;
});
