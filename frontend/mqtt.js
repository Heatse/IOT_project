import mqtt from 'mqtt';

// MQTT broker settings
const brokerUrl = 'mqtt://localhost:1883';
const topic = 'sensors/data';

// Create an MQTT client
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    publishData();
});

client.on('error', (error) => {
    console.error('MQTT error:', error);
    client.end();
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
    client.publish(topic, JSON.stringify(newData), () => {
        // You can leave this callback empty
    });
};

// Connect to the MQTT broker
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    setInterval(publishData, 3000); // Publish data every 5 seconds
});





