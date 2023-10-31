import mqtt from 'mqtt';
import WebSocket from 'ws';

// MQTT broker settings
const brokerUrl = 'mqtt://localhost:1883';
const topic = 'sensors/data';

// Create an MQTT client
const mqttClient = mqtt.connect(brokerUrl);

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// WebSocket connections
const clients = new Set();

// Handle new WebSocket connections
wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('WebSocket client connected');

    // Remove WebSocket clients when they disconnect
    ws.on('close', () => {
        clients.delete(ws);
        console.log('WebSocket client disconnected');
    });
});

// Subscribe to MQTT topic
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(topic);
});

mqttClient.on('error', (error) => {
    console.error('MQTT error:', error);
    mqttClient.end();
});

// Handle MQTT messages and send them to WebSocket clients
mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    const payload = JSON.stringify({
        temperature: data.temperature,
        humidity: data.humidity,
        brightness: data.luminosity,
    });

    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });

});

// Publish data to the MQTT topic
const publishData = () => {
    const newData = {
        temperature: Math.floor(Math.random() * 40 + 1),    // Simulated temperature data
        humidity: Math.floor(Math.random() * 100 + 1),      // Simulated humidity data
        luminosity: Math.floor(Math.random() * 10000 + 1)   // Simulated luminosity data
    };

    // Log the data to the console
    console.log('Published data:', JSON.stringify(newData));

    // Publish the data to MQTT
    mqttClient.publish(topic, JSON.stringify(newData), () => {
        // You can leave this callback empty
    });
};

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    setInterval(publishData, 5000); // Publish data every 5 seconds
});