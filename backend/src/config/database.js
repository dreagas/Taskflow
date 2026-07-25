const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

console.log('Connected to the SQLite database.');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        company TEXT
    );
    
    CREATE TABLE IF NOT EXISTS service_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pendente',
        priority TEXT NOT NULL DEFAULT 'Baixa',
        start_date TEXT,
        end_date TEXT,
        hours REAL DEFAULT 0,
        rate REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id)
    );
`);

// Seed Admin User
const adminUser = db.prepare("SELECT * FROM users WHERE email = ?").get('admin@taskflow.com');
if (!adminUser) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run('Administrador', 'admin@taskflow.com', hash);
    console.log('Seed: Admin user created.');
}

// Seed Client
const defaultClient = db.prepare("SELECT * FROM clients").get();
if (!defaultClient) {
    db.prepare("INSERT INTO clients (name, email, phone, company) VALUES (?, ?, ?, ?)").run('João Silva', 'joao@example.com', '(11) 99999-9999', 'Tech Solutions');
    console.log('Seed: Default client created.');
}

// Criando wrappers para manter a compatibilidade com o código dos controllers (que usavam a API do pacote 'sqlite3')
const dbWrapper = {
    get: (sql, params = [], callback) => {
        try {
            const result = db.prepare(sql).get(params);
            if (callback) callback(null, result);
            return result;
        } catch (err) {
            if (callback) callback(err, null);
        }
    },
    all: (sql, params = [], callback) => {
        try {
            const results = db.prepare(sql).all(params);
            if (callback) callback(null, results);
            return results;
        } catch (err) {
            if (callback) callback(err, null);
        }
    },
    run: function(sql, params = [], callback) {
        try {
            const info = db.prepare(sql).run(params);
            const context = { lastID: info.lastInsertRowid, changes: info.changes };
            if (callback) callback.call(context, null);
            return info;
        } catch (err) {
            if (callback) callback.call({}, err);
        }
    }
};

module.exports = dbWrapper;