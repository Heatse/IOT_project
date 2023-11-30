import app from "./app.js";
import mysql from "mysql2";
import mqtt from 'mqtt';

const port = 3000;

// Thiết lập kết nối đến cơ sở dữ liệu MySQL
const db = mysql.createConnection({
    host: 'localhost', // Thay đổi thông tin kết nối theo máy chủ MySQL của bạn
    user: 'root', // Thay đổi tên người dùng
    password: '', // Thay đổi mật khẩu
    database: 'iotproject', // Thay đổi tên cơ sở dữ liệu
});




const mqttServer = 'mqtt://172.20.10.7'; // Địa chỉ IP hoặc tên miền của MQTT broker
const username = 'admin';
const password = '12345678';

const mqttClient = mqtt.connect(mqttServer, {
    username: username,
    password: password
});

mqttClient.on('connect', () => {
    console.log('Kết nối MQTT thành công');

    const topic = 'data'; // Thay 'data' bằng tên chủ đề bạn muốn lắng nghe
    mqttClient.subscribe(topic, (error) => {
        if (error) {
            console.error('Lỗi khi đăng ký lắng nghe chủ đề MQTT:', error);
        } else {
            console.log(`Đã lắng nghe chủ đề: ${topic}`);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    // Xử lý dữ liệu khi nhận được từ chủ đề MQTT
    console.log(`Nhận dữ liệu từ chủ đề ${topic}: ${message.toString()}`);

    const data = JSON.parse(message.toString());

    const query = 'INSERT INTO datalog (temperature, humidity, brightness) VALUES (?, ?, ?)';

    db.query(query, [data.temperature, data.humidity, data.brightness], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.message);
        } else {
            if (results.length > 0) {
                const latestData = results[0];
                console.log('Dữ liệu mới nhất:', latestData);
            } else {
                console.log('Không có dữ liệu.');
            }
        }
    });
});

mqttClient.on('error', (error) => {
    console.error('Lỗi kết nối MQTT:', error);
});



// Kết nối đến MySQL
db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối MySQL: ' + err.message);
        return;
    }
    console.log('Kết nối MySQL thành công!');

});


app.listen(port, () => {
    console.log(`Đã kết nối tới cổng  ${port}  `)
})