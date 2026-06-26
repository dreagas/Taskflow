const express = require('express');
const { 
    createClient, 
    getAllClients, 
    getClientById, 
    updateClient, 
    deleteClient 
} = require('../controllers/clientController');
const { requireAuthentication } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(requireAuthentication); // Protect all client routes

router.post('/', createClient);
router.get('/', getAllClients);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;
