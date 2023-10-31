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

const mqttServer = 'mqtt://192.168.43.205'; // Địa chỉ IP hoặc tên miền của MQTT broker
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


// mqttClient.on('message', (topic, message) => {
//     const query = 'SELECT led, fan FROM historyac ORDER BY id DESC LIMIT 1';

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Lỗi truy vấn MySQL: ' + err.message);
//         } else {
//             if (results.length > 0) {
//                 const latestData = results[0];
//                 console.log('Dữ liệu mới nhất - LED:', latestData.led, 'Fan:', latestData.fan);

//                 // Chuyển đổi trạng thái "on" và "off" thành 1 và 0
//                 const ledState = latestData.led === 'on' ? 1 : 0;
//                 const fanState = latestData.fan === 'on' ? 1 : 0;

//                 // Tạo JSON object chứa thông tin LED và Fan ở dạng số 1 và 0
//                 // Xuất dữ liệu qua MQTT topic "control"
//                 const controlData = ledState + ' ' + fanState; // Ghép thành một chuỗi số
//                 mqttClient.publish('control', controlData);
//             } else {
//                 console.log('Không có dữ liệu trong bảng "history".');
//             }
//         }
//     });
// });


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

    // Tạo bảng datalog nếu nó chưa tồn tại
    // const createTableQuery = `
    //     CREATE TABLE IF NOT EXISTS datalog (
    //         id INT AUTO_INCREMENT PRIMARY KEY,
    //         temperature FLOAT,m
    //         humidity FLOAT,
    //         brightled INT,
    //         time TIMESTAMP
    //     );

    //     CREATE TABLE IF NOT EXISTS historyAC (
    //         id INT AUTO_INCREMENT PRIMARY KEY,
    //         led VARCHAR(255),
    //         fan VARCHAR(255), 
    //         time TIMESTAMP
    //     );

    //     CREATE TABLE IF NOT EXISTS dust (
    //         id INT AUTO_INCREMENT PRIMARY KEY,
    //         dust FLOAT,
    //         time TIMESTAMP
    //     );
    // `;


    // db.query(createTableQuery, (err, results) => {
    //     if (err) {
    //         console.error('Lỗi tạo bảng : ' + err.message);
    //     } else {
    //         console.log('Bảng đã được tạo hoặc tồn tại.');
    //     }

    //     // Đóng kết nối MySQL sau khi thực hiện
    //     db.end();
    // });
});


app.listen(port, () => {
    console.log(`Đã kết nối tới cổng  ${port}  `)
})