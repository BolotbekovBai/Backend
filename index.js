const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
const PORT = 3000;
const db = new sqlite3.Database('./city.db');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bishkek City API',
            version: '1.0.0',
        },
        paths: {
            '/api/matches': {
                get: {
                    summary: 'Список улиц и районов',
                    responses: { '200': { description: 'Успешно' } }
                }
            },
            '/api/districts': {
                get: {
                    summary: 'Список районов',
                    responses: { '200': { description: 'Успешно' } }
                }
            }
        }
    },
    apis: [],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/api/matches', (req, res) => {
    const sql = `
        SELECT streets.id, streets.name AS streetName, districts.name AS districtName 
        FROM streets 
        JOIN districts ON streets.district_id = districts.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/districts', (req, res) => {
    db.all("SELECT * FROM districts", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/api-docs`);
});