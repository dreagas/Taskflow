const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const serviceOrderRoutes = require('./routes/serviceOrderRoutes');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/service-orders', serviceOrderRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running successfully' });
});

app.listen(port, () => {
    console.log(`TaskFlow Backend running on http://localhost:${port}`);
});