var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: '172.18.0.2',  // ✅ ใช้ IP ของ MySQL แทน 'mysql'
    user: 'root',
    password: '123456',
    database: 'info',
    waitForConnections: true,
    connectionLimit: 10, // ✅ กำหนดจำนวน Connection
    queueLimit: 0
});

// ใช้ pool.query แทน connection.query
app.get('/admin', function (req, res, next) {
    pool.query(
        'SELECT id, username FROM admin',
        function(err, results, fields) {
            if (err) {
                res.json({ error: "Error fetching admin data" });
            } else {
                res.json(results);
            }
        }
    );
});

// เพิ่มข้อมูลแอดมินใหม่ (เข้ารหัสรหัสผ่าน)
app.post("/create", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // เข้ารหัสรหัสผ่าน
        connection.query(
            "INSERT INTO `admin`(`username`, `password`) VALUES (?, ?)",
            [req.body.username, hashedPassword],
            (err, result) => {
                if (err) {
                    res.json({ error: "Error inserting data into database" });
                } else {
                    res.json({ message: "Admin added successfully" });
                }
            }
        );
    } catch (error) {
        res.json({ error: "Error hashing password" });
    }
});

// ตรวจสอบการเข้าสู่ระบบแอดมิน
app.post("/admin", (req, res) => {
    connection.query(
        "SELECT * FROM admin WHERE username = ?",
        [req.body.username],
        async (err, results) => {
            if (err) {
                res.json({ error: "Error fetching data from database" });
            } else if (results.length > 0) {
                const validPassword = await bcrypt.compare(req.body.password, results[0].password);
                if (validPassword) {
                    res.json({ message: "Login successful" });
                } else {
                    res.json({ error: "Invalid password" });
                }
            } else {
                res.json({ error: "Admin not found" });
            }
        }
    );
});

app.listen(3334, function () {
    console.log('CORS-enabled web server listening on port 3334');
});
