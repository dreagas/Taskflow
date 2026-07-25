const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.use(authMiddleware.verifyTokenMiddleware);

router.get('/dashboard-metrics', clientController.getDashboardMetrics);
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.post('/', clientController.createNewClient);
router.put('/:id', clientController.updateExistingClient);
router.delete('/:id', clientController.deleteClientRecord);

module.exports = router;