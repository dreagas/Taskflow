const express = require('express');
const router = express.Router();
const serviceOrderController = require('../controllers/serviceOrderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.use(authMiddleware.verifyTokenMiddleware);

router.get('/', serviceOrderController.getAllServiceOrders);
router.get('/:id', serviceOrderController.getServiceOrderById);
router.post('/', serviceOrderController.createNewServiceOrder);
router.put('/:id', serviceOrderController.updateExistingServiceOrder);
router.delete('/:id', serviceOrderController.deleteServiceOrderRecord);

module.exports = router;