const db = require('../config/database');
const { logSystemEvent } = require('../utils/loggerUtil');

function createServiceOrder(req, res) {
    try {
        const { client_id, title, description, status, amount } = req.body;

        if (!client_id || !title) {
            logSystemEvent('serviceOrderController -> createServiceOrder', 'Missing required fields: client_id and title', 'ERROR');
            return res.status(400).json({ success: false, errorMessage: 'Missing required fields: Client ID and Title are required.' });
        }

        // Verify if client exists
        const checkClientStatement = db.prepare('SELECT id FROM clients WHERE id = ?');
        const client = checkClientStatement.get(client_id);

        if (!client) {
             logSystemEvent('serviceOrderController -> createServiceOrder', `Client not found: ID ${client_id}`, 'WARN');
             return res.status(404).json({ success: false, errorMessage: 'Associated client not found.' });
        }

        const orderStatus = status || 'pending';
        const orderAmount = amount || 0;

        const insertOrderStatement = db.prepare('INSERT INTO service_orders (client_id, title, description, status, amount) VALUES (?, ?, ?, ?, ?)');
        const result = insertOrderStatement.run(client_id, title, description || null, orderStatus, orderAmount);

        logSystemEvent('serviceOrderController -> createServiceOrder', `Service order created successfully: ID ${result.lastInsertRowid}`);

        const newOrder = db.prepare('SELECT * FROM service_orders WHERE id = ?').get(result.lastInsertRowid);

        return res.status(201).json({ success: true, serviceOrder: newOrder });
    } catch (error) {
        logSystemEvent('serviceOrderController -> createServiceOrder', `Error creating service order: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while creating service order.' });
    }
}

function getAllServiceOrders(req, res) {
    try {
        const getAllOrdersStatement = db.prepare(`
            SELECT
                so.*,
                c.name as client_name
            FROM service_orders so
            JOIN clients c ON so.client_id = c.id
            ORDER BY so.created_at DESC
        `);
        const orders = getAllOrdersStatement.all();

        return res.status(200).json({ success: true, serviceOrders: orders });
    } catch (error) {
        logSystemEvent('serviceOrderController -> getAllServiceOrders', `Error fetching service orders: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while fetching service orders.' });
    }
}

function getServiceOrderById(req, res) {
    try {
        const orderId = req.params.id;
        const getOrderStatement = db.prepare(`
            SELECT
                so.*,
                c.name as client_name,
                c.email as client_email,
                c.phone as client_phone
            FROM service_orders so
            JOIN clients c ON so.client_id = c.id
            WHERE so.id = ?
        `);
        const order = getOrderStatement.get(orderId);

        if (!order) {
            logSystemEvent('serviceOrderController -> getServiceOrderById', `Service order not found: ID ${orderId}`, 'WARN');
            return res.status(404).json({ success: false, errorMessage: 'Service order not found.' });
        }

        return res.status(200).json({ success: true, serviceOrder: order });
    } catch (error) {
        logSystemEvent('serviceOrderController -> getServiceOrderById', `Error fetching service order: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while fetching service order.' });
    }
}

function updateServiceOrder(req, res) {
    try {
        const orderId = req.params.id;
        const { title, description, status, amount } = req.body;

        if (!title || !status) {
            logSystemEvent('serviceOrderController -> updateServiceOrder', 'Missing required fields: title and status', 'ERROR');
            return res.status(400).json({ success: false, errorMessage: 'Missing required fields: Title and Status are required.' });
        }

        const updateOrderStatement = db.prepare('UPDATE service_orders SET title = ?, description = ?, status = ?, amount = ? WHERE id = ?');
        const result = updateOrderStatement.run(title, description || null, status, amount || 0, orderId);

        if (result.changes === 0) {
             logSystemEvent('serviceOrderController -> updateServiceOrder', `Service order not found for update: ID ${orderId}`, 'WARN');
             return res.status(404).json({ success: false, errorMessage: 'Service order not found.' });
        }

        logSystemEvent('serviceOrderController -> updateServiceOrder', `Service order updated successfully: ID ${orderId}`);

        const updatedOrder = db.prepare('SELECT * FROM service_orders WHERE id = ?').get(orderId);
        return res.status(200).json({ success: true, serviceOrder: updatedOrder });

    } catch (error) {
        logSystemEvent('serviceOrderController -> updateServiceOrder', `Error updating service order: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while updating service order.' });
    }
}

function deleteServiceOrder(req, res) {
     try {
        const orderId = req.params.id;

        const deleteOrderStatement = db.prepare('DELETE FROM service_orders WHERE id = ?');
        const result = deleteOrderStatement.run(orderId);

        if (result.changes === 0) {
             logSystemEvent('serviceOrderController -> deleteServiceOrder', `Service order not found for deletion: ID ${orderId}`, 'WARN');
             return res.status(404).json({ success: false, errorMessage: 'Service order not found.' });
        }

        logSystemEvent('serviceOrderController -> deleteServiceOrder', `Service order deleted successfully: ID ${orderId}`);
        return res.status(200).json({ success: true, message: 'Service order deleted successfully.' });

    } catch (error) {
        logSystemEvent('serviceOrderController -> deleteServiceOrder', `Error deleting service order: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while deleting service order.' });
    }
}

function getDashboardMetrics(req, res) {
    try {
        const totalClients = db.prepare('SELECT count(*) as count FROM clients').get().count;
        const totalOrders = db.prepare('SELECT count(*) as count FROM service_orders').get().count;
        const pendingOrders = db.prepare("SELECT count(*) as count FROM service_orders WHERE status = 'pending'").get().count;
        const totalRevenueResult = db.prepare("SELECT sum(amount) as total FROM service_orders WHERE status = 'completed'").get().total;

        const totalRevenue = totalRevenueResult || 0;

        return res.status(200).json({
            success: true,
            metrics: {
                totalClients,
                totalOrders,
                pendingOrders,
                totalRevenue
            }
        });
    } catch (error) {
        logSystemEvent('serviceOrderController -> getDashboardMetrics', `Error fetching metrics: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while fetching metrics.' });
    }
}

module.exports = {
    createServiceOrder,
    getAllServiceOrders,
    getServiceOrderById,
    updateServiceOrder,
    deleteServiceOrder,
    getDashboardMetrics
};
