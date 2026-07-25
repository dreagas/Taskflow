const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const secretKey = process.env.JWT_SECRET || 'super_secret_key_taskflow';

const registerUser = (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) {
                console.log('Error verifying existing user:', err);
                return res.status(500).json({ error: 'Internal server error.' });
            }

            if (row) {
                return res.status(400).json({ error: 'Email already registered.' });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword], function(err) {
                if (err) {
                    console.log('Error inserting new user:', err);
                    return res.status(500).json({ error: 'Error creating user.' });
                }

                const newUserId = this.lastID;
                const token = jwt.sign({ id: newUserId, name: name }, secretKey, { expiresIn: '8h' });

                return res.status(201).json({
                    message: 'User registered successfully.',
                    user: { id: newUserId, name: name, email: email },
                    token: token
                });
            });
        });
    } catch (error) {
        console.log('Exception in registerUser:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const loginUser = (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) {
                console.log('Error searching for user:', err);
                return res.status(500).json({ error: 'Internal server error.' });
            }

            if (!row) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const isPasswordValid = bcrypt.compareSync(password, row.password);

            if (isPasswordValid === false) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const token = jwt.sign({ id: row.id, name: row.name }, secretKey, { expiresIn: '8h' });

            return res.status(200).json({
                message: 'Login successful.',
                user: { id: row.id, name: row.name, email: row.email },
                token: token
            });
        });
    } catch (error) {
        console.log('Exception in loginUser:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const getAuthenticatedUser = (req, res) => {
    try {
        const userId = req.userId;
        
        db.get("SELECT id, name, email FROM users WHERE id = ?", [userId], (err, row) => {
            if (err) {
                console.log('Error fetching user info:', err);
                return res.status(500).json({ error: 'Internal server error.' });
            }
            if (!row) {
                 return res.status(404).json({ error: 'User not found.' });
            }
            return res.status(200).json({ user: row });
        });
    } catch(error) {
        console.log('Exception in getAuthenticatedUser:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getAuthenticatedUser
};