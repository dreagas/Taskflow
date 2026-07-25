const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'super_secret_key_taskflow';

const verifyTokenMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(403).json({ error: 'No authorization token provided.' });
        }

        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Invalid token format.' });
        }

        const token = tokenParts[1];

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.log('Error verifying JWT token:', err.message);
                return res.status(401).json({ error: 'Failed to authenticate token.' });
            }
            
            // Save user ID to request object for use in other routes
            req.userId = decoded.id;
            next();
        });
    } catch (error) {
        console.log('Exception in auth middleware:', error);
        return res.status(500).json({ error: 'Server error during authentication.' });
    }
};

module.exports = {
    verifyTokenMiddleware
};