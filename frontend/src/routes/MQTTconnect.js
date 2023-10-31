const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://mqtt.eclipse.org'); // Thay thế bằng địa chỉ MQTT broker server của bạn

client.on('connect', () => {
    console.log('Đã kết nối MQTT broker thành công');

    // Publish một tin nhắn
    client.publish('topic/test', 'Xin chào từ server Node.js');

    // Subscribe đến một chủ đề
    client.subscribe('topic/test');
});

client.on('message', (topic, message) => {
    console.log(`Nhận được tin nhắn từ chủ đề "${topic}": ${message.toString()}`);
});