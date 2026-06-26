const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { logSystemEvent } = require('../utils/loggerUtil');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_taskflow';

function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            logSystemEvent('authController -> registerUser', 'Missing required fields for registration', 'ERROR');
            return res.status(400).json({ success: false, errorMessage: 'Missing required fields: name, email, and password are required.' });
        }

        const checkEmailStatement = db.prepare('SELECT id FROM users WHERE email = ?');
        const existingUser = checkEmailStatement.get(email);

        if (existingUser) {
            logSystemEvent('authController -> registerUser', \`Email already in use: \${email}\`, 'WARN');
            return res.status(400).json({ success: false, errorMessage: 'This email is already registered.' });
        }

        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        const insertUserStatement = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const result = insertUserStatement.run(name, email, hashedPassword);

        logSystemEvent('authController -> registerUser', \`User registered successfully: \${email} (ID: \${result.lastInsertRowid})\`);

        const token = jwt.sign({ userId: result.lastInsertRowid, email: email }, JWT_SECRET, { expiresIn: '24h' });

        return res.status(201).json({
            success: true,
            user: { id: result.lastInsertRowid, name, email },
            token
        });
    } catch (error) {
        logSystemEvent('authController -> registerUser', \`Error registering user: \${error.message}\`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error during registration.' });
    }
}

function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logSystemEvent('authController -> loginUser', 'Missing required fields for login', 'ERROR');
            return res.status(400).json({ success: false, errorMessage: 'Missing required fields: email and password are required.' });
        }

        const getUserStatement = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = getUserStatement.get(email);

        if (!user) {
            logSystemEvent('authController -> loginUser', \`User not found for email: \${email}\`, 'WARN');
            return res.status(401).json({ success: false, errorMessage: 'Invalid email or password.' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (isPasswordValid === false) {
             logSystemEvent('authController -> loginUser', \`Invalid password for email: \${email}\`, 'WARN');
             return res.status(401).json({ success: false, errorMessage: 'Invalid email or password.' });
        }

        logSystemEvent('authController -> loginUser', \`User logged in successfully: \${email}\`);

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    } catch (error) {
        logSystemEvent('authController -> loginUser', \`Error during login: \${error.message}\`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error during login.' });
    }
}

function getAuthenticatedUserProfile(req, res) {
     try {
        const userId = req.userId;
        const getUserStatement = db.prepare('SELECT id, name, email FROM users WHERE id = ?');
        const user = getUserStatement.get(userId);

        if (!user) {
             logSystemEvent('authController -> getAuthenticatedUserProfile', \`User profile not found for ID: \${userId}\`, 'WARN');
             return res.status(404).json({ success: false, errorMessage: 'User profile not found.' });
        }

        return res.status(200).json({ success: true, user });

     } catch (error) {
        logSystemEvent('authController -> getAuthenticatedUserProfile', \`Error fetching user profile: \${error.message}\`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while fetching profile.' });
     }
}

module.exports = {
    registerUser,
    loginUser,
    getAuthenticatedUserProfile
};
