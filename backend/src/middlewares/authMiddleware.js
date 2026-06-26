const jwt = require('jsonwebtoken');
const { logSystemEvent } = require('../utils/loggerUtil');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_taskflow';

function requireAuthentication(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logSystemEvent('authMiddleware', 'Missing or invalid authorization header', 'WARN');
            return res.status(401).json({ success: false, errorMessage: 'Authentication required. Missing token.' });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
                logSystemEvent('authMiddleware', \`Failed to verify token: \${err.message}\`, 'WARN');
                return res.status(401).json({ success: false, errorMessage: 'Invalid or expired token.' });
            }

            req.userId = decodedToken.userId;
            req.userEmail = decodedToken.email;
            
            next();
        });
    } catch (error) {
        logSystemEvent('authMiddleware', \`Error in authentication middleware: \${error.message}\`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error during authentication.' });
    }
}

module.exports = {
    requireAuthentication
};
