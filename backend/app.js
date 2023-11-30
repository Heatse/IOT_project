import express from "express";
import morgan from "morgan";
import cors from "cors";
import mysql from "mysql2";
import mqtt from 'mqtt';

const app = express();

app.use(morgan("dev"))
app.use(express.json())
app.use(cors())



app.get("/", (req, res) => {
    res.status(200).json("Hello this is backend!")
})

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



app.get('/api/datalog', (req, res) => {
    const query = 'SELECT * FROM datalog'; // Truy vấn SQL

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.message);
            res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/api/datalog/lastest', (req, res) => {
    const query = 'SELECT * FROM datalog ORDER BY id DESC LIMIT 1';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu: ', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ error: 'Không tìm thấy dữ liệu' });
            }
        }
    });
});

app.post('/api/datalog', (req, res) => {
    const { temperature, humidity, brightness } = req.body; // Lấy dữ liệu từ yêu cầu POST

    // Truy vấn SQL để chèn dữ liệu vào bảng datalog
    const query = 'INSERT INTO datalog (temperature, humidity, brightness) VALUES (?, ?, ?)';

    db.query(query, [temperature, humidity, brightness], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.message);
            res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
        } else {
            res.status(201).json({ message: 'Dữ liệu đã được thêm vào cơ sở dữ liệu' });
        }
    });
});

app.get('/api/device_actions', (req, res) => {
    const selectQuery = 'SELECT * FROM device_actions';

    db.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

app.post('/api/device_actions', (req, res) => {
    const { device_name, action } = req.body;

    // Kiểm tra xem "device_name" và "action" có giá trị hợp lệ
    if (!device_name || (action !== 'on' && action !== 'off')) {
        res.status(400).json({ error: 'Dữ liệu không hợp lệ.' });
        return;
    }

    // Chèn dữ liệu vào bảng device_actions chỉ cho đèn được chỉ định
    const insertQuery = 'INSERT INTO device_actions (device_name, action) VALUES (?, ?)';

    db.query(insertQuery, [device_name, action], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.message);
            res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
        } else {
            res.status(201).json({ message: 'Dữ liệu đã được thêm vào bảng device_actions' });
        }
    });
});

app.get('/api/device_actions/toggleCount', (req, res) => {
    const query = 'SELECT device_name, action, COUNT(*) as toggleCount FROM device_actions GROUP BY device_name, action';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.message);
            res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
        } else {
            const toggleCountData = {
                fan: { on: 0, off: 0 },
                led: { on: 0, off: 0 },
            };

            // Xử lý kết quả trả về từ MySQL và cập nhật toggleCountData
            results.forEach((row) => {
                const deviceName = row.device_name;
                const action = row.action;
                toggleCountData[deviceName][action] = row.toggleCount;
            });

            res.status(200).json(toggleCountData);
        }
    });
});

app.post('/api/publish', (req, res) => {
    // Lấy dữ liệu từ request body
    const data = req.body;

    // Chuyển đổi trạng thái đèn thành 1 và 0
    const ledState = data.led === 'on' ? 1 : 0;
    const fanState = data.fan === 'on' ? 1 : 0;

    // Tạo JSON object chứa thông tin LED và Fan ở dạng số 1 và 0
    const controlData = ledState + ' ' + fanState;

    const topic = 'control';
    mqttClient.publish(topic, controlData, (error) => {
        if (error) {
            console.error('Lỗi khi xuất dữ liệu qua MQTT:', error);
            res.status(500).json({ message: 'Lỗi khi xuất dữ liệu qua MQTT' });
        } else {
            console.log('Đã xuất dữ liệu qua MQTT:', message);
            res.json({ message: 'Dữ liệu đã được xuất thành công' });
        }
    });
});




export default app;