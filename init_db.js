const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./city.db');

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS streets");
    db.run("DROP TABLE IF EXISTS districts");

    db.run("CREATE TABLE districts (id INTEGER PRIMARY KEY, name TEXT)");
    db.run("CREATE TABLE streets (id INTEGER PRIMARY KEY, name TEXT, district_id INTEGER, FOREIGN KEY(district_id) REFERENCES districts(id))");

    const districts = [
        [1, "Октябрьский район"],
        [2, "Первомайский район"],
        [3, "Ленинский район"],
        [4, "Свердловский район"]
    ];

    const insertDist = db.prepare("INSERT INTO districts (id, name) VALUES (?, ?)");
    districts.forEach(d => insertDist.run(d));
    insertDist.finalize();

    const streets = [
        [1, "улица Байтик Баатыра", 1],
        [2, "улица Кулатова", 1],
        [3, "улица Горького", 1],
        [4, "улица Медерова", 1],
        [5, "улица Жукеева-Пудовкина", 1],
        [6, "улица Матросова", 1],
        [7, "улица Бектенова", 1],
        [8, "улица Карасаева", 1],
        [9, "улица Юнусалиева", 1],
        [10, "улица Суеркулова", 1],
        [11, "улица Ахунбаева", 1],
        [12, "улица Малдыбаева", 1],
        [13, "переулок Гвардейский", 1],
        [14, "улица Элебаева", 1],
        [15, "проспект Манаса", 2],
        [16, "улица Киевская", 2],
        [17, "бульвар Эркиндик", 2],
        [18, "улица Панфилова", 2],
        [19, "улица Логвиненко", 2],
        [20, "улица Раззакова", 2],
        [21, "улица Тоголок Молдо", 2],
        [22, "улица Исанова", 2],
        [23, "проспект Чуй", 3],
        [24, "улица Московская", 3],
        [25, "улица Фучика", 3],
        [26, "улица Интергельпо", 3],
        [27, "улица Льва Толстого", 3],
        [28, "улица Гагарина", 3],
        [29, "проспект Дэн Сяопина", 3],
        [30, "улица Курманжан Датка", 4],
        [31, "улица Жибек-Жолу", 4],
        [32, "улица Суюмбаева", 4],
        [33, "улица Лермонтова", 4],
        [34, "улица Ауэзова", 4],
        [35, "улица Ибраимова", 4],
        [36, "улица Шопокова", 4]
    ];

    const insertStreet = db.prepare("INSERT INTO streets (id, name, district_id) VALUES (?, ?, ?)");
    streets.forEach(s => insertStreet.run(s));
    insertStreet.finalize();

    console.log("Database updated: all records have IDs.");
});

db.close();