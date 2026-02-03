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
            version: '2.0.0',
        },
        paths: {
            '/api/matches': {
                get: {
                    summary: 'Поиск улиц',
                    parameters: [
                        { name: 'name', in: 'query', schema: { type: 'string' } },
                        { name: 'districtId', in: 'query', schema: { type: 'string' } }
                    ],
                    responses: {
                        '200': { description: 'Успешно' },
                        '404': { description: 'Ничего не найдено' }
                    }
                }
            },
            '/api/districts': {
                get: {
                    summary: 'Список районов',
                    parameters: [
                        { name: 'name', in: 'query', schema: { type: 'string' } }
                    ],
                    responses: {
                        '200': { description: 'Успешно' },
                        '404': { description: 'Ничего не найдено' }
                    }
                }
            },
            '/api/streets/{id}': {
                put: {
                    summary: 'Редактировать улицу',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { name: { type: 'string' } }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Обновлено' },
                        '404': { description: 'ID не найден' }
                    }
                }
            },
            '/api/districts/{id}': {
                put: {
                    summary: 'Редактировать район',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { name: { type: 'string' } }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Обновлено' },
                        '404': { description: 'ID не найден' }
                    }
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
    const { name, districtId } = req.query;
    let sql = `SELECT streets.id, streets.name AS streetName, districts.name AS districtName 
               FROM streets 
               JOIN districts ON streets.district_id = districts.id 
               WHERE 1=1`;
    let params = [];

    if (name) {
        sql += " AND streets.name LIKE ?";
        params.push(`%${name}%`);
    }

    if (districtId) {
        sql += " AND streets.district_id = ?";
        params.push(districtId);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ message: "По вашему запросу ничего не найдено" });

        const formatted = rows.map(r => ({...r, id: r.id.toString() }));
        res.json(formatted);
    });
});

app.get('/api/districts', (req, res) => {
    const { name } = req.query;
    let sql = "SELECT * FROM districts WHERE 1=1";
    let params = [];

    if (name) {
        sql += " AND name LIKE ?";
        params.push(`%${name}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ message: "По вашему запросу ничего не найдено" });

        const formatted = rows.map(r => ({...r, id: r.id.toString() }));
        res.json(formatted);
    });
});

app.put('/api/streets/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Отсутствует название" });

    db.run("UPDATE streets SET name = ? WHERE id = ?", [name, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "Улица с таким ID не найдена" });

        res.json({ id: id.toString(), newName: name, message: "Успешно обновлено" });
    });
});

app.put('/api/districts/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Отсутствует название" });

    db.run("UPDATE districts SET name = ? WHERE id = ?", [name, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "Район с таким ID не найден" });

        res.json({ id: id.toString(), newName: name, message: "Успешно обновлено" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});