const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./city.db');

const districts = [
    [1, "Октябрьский район"],
    [2, "Первомайский район"],
    [3, "Свердловский район"],
    [4, "Ленинский район"]
];

const streets = [
    [101, "улица Байтик Баатыра", 1],
    [102, "улица Исы Ахунбаева", 1],
    [103, "проспект Чуй", 3],
    [104, "улица Абдрахманова", 2],
    [105, "проспект Манаса", 2],
    [106, "улица Дэн Сяопина", 4],
    [107, "улица Гагарина", 4],
    [108, "улица 7 Апреля", 1],
    [109, "улица Московская", 2],
    [110, "улица Киевская", 2]
];

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS streets");
    db.run("DROP TABLE IF EXISTS districts");

    db.run(`CREATE TABLE districts (
        id INTEGER PRIMARY KEY,
        name TEXT
    )`);

    db.run(`CREATE TABLE streets (
        id INTEGER PRIMARY KEY,
        name TEXT,
        district_id INTEGER,
        FOREIGN KEY (district_id) REFERENCES districts (id)
    )`);

    const insertDistrict = db.prepare("INSERT INTO districts (id, name) VALUES (?, ?)");
    districts.forEach(d => insertDistrict.run(d));
    insertDistrict.finalize();

    const insertStreet = db.prepare("INSERT INTO streets (id, name, district_id) VALUES (?, ?, ?)");
    streets.forEach(s => insertStreet.run(s));
    insertStreet.finalize();
});

db.close(() => {
    console.log("Database initialized with unique IDs.");
});