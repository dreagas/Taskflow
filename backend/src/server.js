require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { logSystemEvent } = require('./utils/loggerUtil');

// Routes
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const serviceOrderRoutes = require('./routes/serviceOrderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
    logSystemEvent('Server', `Incoming request: ${req.method} ${req.url}`);
    next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/service-orders', serviceOrderRoutes);

// Serve static frontend files in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));

    // Serve index.html for all other routes to support Vue Router history mode
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    logSystemEvent('Server Error Handler', `Unhandled error: ${err.stack}`, 'ERROR');
    res.status(500).json({ success: false, errorMessage: 'An unexpected internal server error occurred.' });
});

// Start Server
app.listen(PORT, () => {
    logSystemEvent('Server', `TaskFlow Backend running on port ${PORT}`);
});
