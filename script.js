// Conexión a HiveMQ Cloud
const client = mqtt.connect('wss://53297501625b4e66abdbbfcf46395f40.s1.eu.hivemq.cloud:8884/mqtt', {  // Cambiado a puerto 8884
    clientId: 'clientId_' + Math.random().toString(16).substr(2, 8),
    username: 'elmaxter687',  // Reemplazar con tu usuario
    password: 'Ch#1424500',   // Reemplazar con tu contraseña
});

client.on('connect', () => {
    console.log('Conectado a HiveMQ Cloud');
    // Suscribirse a los tópicos de temperatura y humedad
    client.subscribe('invernadero/temperature', (err) => {
        if (err) console.error('Error al suscribirse a invernadero/temperature:', err);
        else console.log('Suscrito a invernadero/temperature');
    });
    client.subscribe('invernadero/humidity', (err) => {
        if (err) console.error('Error al suscribirse a invernadero/humidity:', err);
        else console.log('Suscrito a invernadero/humidity');
    });
});

// Actualizar los datos de temperatura y humedad
client.on('message', (topic, message) => {
    const payload = message.toString();
    console.log(`Mensaje recibido en ${topic}: ${payload}`);
    if (topic === 'invernadero/temperature') {
        document.getElementById('temperature').innerText = `${payload} °C`;
    } else if (topic === 'invernadero/humidity') {
        document.getElementById('humidity').innerText = `${payload} %`;
    }
});

client.on('error', (err) => {
    console.error('Error de conexión:', err);
});

// Función para alternar el estado del botón y el ícono del grifo
function toggleButton() {
    const button = document.getElementById('toggleButton');
    const grifoIcon = document.getElementById('grifoIcon');
    
    if (button.innerText === "Abrir Llave") {
        button.innerText = "Cerrar Llave";
        button.classList.add('red'); // Cambiar a rojo
        grifoIcon.src = "grifo_abierto.png"; // Cambiar a grifo abierto
        grifoIcon.alt = "Grifo abierto";
    } else {
        button.innerText = "Abrir Llave";
        button.classList.remove('red'); // Volver a verde
        grifoIcon.src = "grifo_cerrado.png"; // Cambiar a grifo cerrado
        grifoIcon.alt = "Grifo cerrado";
    }
}
