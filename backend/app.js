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

const mqttServer = 'mqtt://192.168.43.205'; // Địa chỉ IP hoặc tên miền của MQTT broker
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

app.get('/api/historyac', (req, res) => {
    const query = 'SELECT * FROM historyac'; // Truy vấn SQL

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.message);
            res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/api/historyac', (req, res) => {
    const { led, fan } = req.body;

    // Kiểm tra xem "led" và "fan" có giá trị "on" hoặc "off"
    if (led !== 'on' && led !== 'off' && fan !== 'on' && fan !== 'off') {
        res.status(400).json({ error: 'Trạng thái không hợp lệ. Sử dụng "on" hoặc "off".' });
    }

    // Truy vấn SQL để cập nhật trạng thái led và fan
    const query = 'INSERT INTO historyac (led, fan) VALUES (?, ?)';

    db.query(query, [led, fan], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.message);
            res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái công tắc' });
        } else {
            res.json({ success: 'Trạng thái công tắc đã được cập nhật' });
        }
    });
});

app.get('/api/dust', (req, res) => {
    const query = 'SELECT * FROM dust'; // Truy vấn SQL

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.message);
            res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/api/dust', (req, res) => {
    const { dust } = req.body; // Lấy dữ liệu từ yêu cầu POST

    // Truy vấn SQL để chèn dữ liệu vào bảng datalog
    const query = 'INSERT INTO dust (dust) VALUES ?';

    db.query(query, [dust], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.message);
            res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
        } else {
            res.status(201).json({ message: 'Dữ liệu đã được thêm vào cơ sở dữ liệu' });
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

    // Chuyển đổi dữ liệu thành chuỗi JSON
    // const message = JSON.stringify(controlData);

    // Xuất dữ liệu qua MQTT topic "control" (hoặc tên chủ đề bạn muốn)
    const topic = 'control'; // Thay 'control' bằng tên chủ đề bạn muốn sử dụng
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