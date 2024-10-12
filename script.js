// script.js

// Configuración de la conexión
const mqttUrl = 'wss://hivemq.com:8000/mqtt'; // URL de HiveMQ para WebSockets
const client = mqtt.connect(mqttUrl);

// Tópico al que deseas suscribirte
const topic = 'test/topic';

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
