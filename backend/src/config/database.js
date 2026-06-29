const Database = require('better-sqlite3');
const path = require('path');
const { logSystemEvent } = require('../utils/loggerUtil');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath, { verbose: (message) => logSystemEvent('Database', message) });

function initializeDatabaseStructure() {
    try {
        logSystemEvent('Database', 'Initializing database structure...');

        // Create Users table
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create Clients table
        db.exec(`
            CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                address TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create Service Orders table
        db.exec(`
            CREATE TABLE IF NOT EXISTS service_orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'pending',
                amount REAL DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(client_id) REFERENCES clients(id)
            )
        `);

        logSystemEvent('Database', 'Database structure initialized successfully.');
    } catch (error) {
        logSystemEvent('Database', `Failed to initialize database structure: ${error.message}`, 'ERROR');
        throw error;
    }
}

initializeDatabaseStructure();

module.exports = db;
