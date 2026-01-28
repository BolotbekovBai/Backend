const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./city.db');

app.get('/api/districts', function(req, res) {
    var sql = "SELECT * FROM districts";
    db.all(sql, [], function(err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/matches', function(req, res) {
    var sql = "SELECT streets.name as street, districts.name as district FROM streets JOIN districts ON streets.district_id = districts.id";
    db.all(sql, [], function(err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/search', function(req, res) {
    var name = req.query.name;
    var sql = "SELECT streets.name as street, districts.name as district FROM streets JOIN districts ON streets.district_id = districts.id WHERE streets.name LIKE ? OR districts.name LIKE ?";
    var params = ["%" + name + "%", "%" + name + "%"];

    db.all(sql, params, function(err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/streets', function(req, res) {
    var name = req.body.name;
    var district_id = req.body.district_id;
    var sql = "INSERT INTO streets (name, district_id) VALUES (?, ?)";
    db.run(sql, [name, district_id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, name: name, district_id: district_id });
    });
});

app.listen(3000, function() {
    console.log("Server: http://localhost:3000");
});