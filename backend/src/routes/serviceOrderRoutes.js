const express = require('express');
const { 
    createServiceOrder, 
    getAllServiceOrders, 
    getServiceOrderById, 
    updateServiceOrder, 
    deleteServiceOrder,
    getDashboardMetrics
} = require('../controllers/serviceOrderController');
const { requireAuthentication } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(requireAuthentication); // Protect all service order routes

router.get('/metrics', getDashboardMetrics);
router.post('/', createServiceOrder);
router.get('/', getAllServiceOrders);
router.get('/:id', getServiceOrderById);
router.put('/:id', updateServiceOrder);
router.delete('/:id', deleteServiceOrder);


module.exports = router;
