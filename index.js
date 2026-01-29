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
                    summary: 'Поиск улиц и их районов',
                    parameters: [{
                        name: 'name',
                        in: 'query',
                        description: 'Название улицы для поиска',
                        required: false,
                        schema: { type: 'string' }
                    }],
                    responses: { '200': { description: 'Успешно' } }
                }
            },
            '/api/districts': {
                get: {
                    summary: 'Поиск районов по названию',
                    parameters: [{
                        name: 'name',
                        in: 'query',
                        description: 'Название района для поиска',
                        required: false,
                        schema: { type: 'string' }
                    }],
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
    const searchName = req.query.name;
    let sql = `
        SELECT streets.id, streets.name AS streetName, districts.name AS districtName 
        FROM streets 
        JOIN districts ON streets.district_id = districts.id
    `;
    let params = [];

    if (searchName) {
        sql += " WHERE streets.name LIKE ?";
        params.push(`%${searchName}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const formattedRows = rows.map(row => ({
            ...row,
            id: row.id.toString()
        }));

        res.json(formattedRows);
    });
});

app.get('/api/districts', (req, res) => {
    const searchName = req.query.name;
    let sql = "SELECT * FROM districts";
    let params = [];

    if (searchName) {
        sql += " WHERE name LIKE ?";
        params.push(`%${searchName}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const formattedRows = rows.map(row => ({
            ...row,
            id: row.id.toString()
        }));

        res.json(formattedRows);
    });
});

app.listen(PORT, () => {
    console.log(`Сервер: http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});