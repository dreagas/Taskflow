const db = require('../config/database');

const getAllServiceOrders = (req, res) => {
    try {
        const query = `
            SELECT so.*, c.name as client_name 
            FROM service_orders so
            LEFT JOIN clients c ON so.client_id = c.id
            ORDER BY so.id DESC
        `;
        db.all(query, [], (err, rows) => {
            if (err) {
                console.log('Error fetching service orders:', err);
                return res.status(500).json({ error: 'Failed to retrieve service orders.' });
            }
            return res.status(200).json(rows);
        });
    } catch (error) {
        console.log('Exception in getAllServiceOrders:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const getServiceOrderById = (req, res) => {
    try {
        const orderId = req.params.id;
        const query = `
            SELECT so.*, c.name as client_name 
            FROM service_orders so
            LEFT JOIN clients c ON so.client_id = c.id
            WHERE so.id = ?
        `;
        db.get(query, [orderId], (err, row) => {
            if (err) {
                console.log('Error fetching service order by ID:', err);
                return res.status(500).json({ error: 'Failed to retrieve service order.' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Service order not found.' });
            }
            return res.status(200).json(row);
        });
    } catch (error) {
        console.log('Exception in getServiceOrderById:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const createNewServiceOrder = (req, res) => {
    try {
        const clientId = req.body.client_id;
        const description = req.body.description;
        const status = req.body.status || 'Pendente';
        const priority = req.body.priority || 'Baixa';
        const startDate = req.body.start_date || null;
        const endDate = req.body.end_date || null;
        const hours = req.body.hours || 0;
        const rate = req.body.rate || 0;
        const totalAmount = req.body.total_amount || 0;

        if (!clientId || !description) {
            return res.status(400).json({ error: 'Client ID and description are required fields.' });
        }

        // Verify if client exists before creating service order
        db.get("SELECT id FROM clients WHERE id = ?", [clientId], (err, row) => {
            if (err) {
                console.log('Error checking client existence:', err);
                return res.status(500).json({ error: 'Database error while checking client.' });
            }
            if (!row) {
                return res.status(400).json({ error: 'Provided Client ID does not exist.' });
            }

            db.run(
                "INSERT INTO service_orders (client_id, description, status, priority, start_date, end_date, hours, rate, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [clientId, description, status, priority, startDate, endDate, hours, rate, totalAmount],
                function(err) {
                    if (err) {
                        console.log('Error creating service order:', err);
                        return res.status(500).json({ error: 'Failed to create service order.' });
                    }
                    const newOrderId = this.lastID;
                    return res.status(201).json({
                        message: 'Service order created successfully.',
                        serviceOrder: {
                            id: newOrderId,
                            client_id: clientId,
                            description: description,
                            status: status,
                            priority: priority,
                            start_date: startDate,
                            end_date: endDate,
                            hours: hours,
                            rate: rate,
                            total_amount: totalAmount
                        }
                    });
                }
            );
        });
    } catch (error) {
        console.log('Exception in createNewServiceOrder:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const updateExistingServiceOrder = (req, res) => {
    try {
        const orderId = req.params.id;
        const clientId = req.body.client_id;
        const description = req.body.description;
        const status = req.body.status;
        const priority = req.body.priority;
        const startDate = req.body.start_date || null;
        const endDate = req.body.end_date || null;
        const hours = req.body.hours || 0;
        const rate = req.body.rate || 0;
        const totalAmount = req.body.total_amount || 0;

        if (!clientId || !description || !status || !priority) {
            return res.status(400).json({ error: 'Client ID, description, status and priority are required fields.' });
        }

        db.run(
            "UPDATE service_orders SET client_id = ?, description = ?, status = ?, priority = ?, start_date = ?, end_date = ?, hours = ?, rate = ?, total_amount = ? WHERE id = ?",
            [clientId, description, status, priority, startDate, endDate, hours, rate, totalAmount, orderId],
            function(err) {
                if (err) {
                    console.log('Error updating service order:', err);
                    return res.status(500).json({ error: 'Failed to update service order.' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Service order not found to update.' });
                }
                return res.status(200).json({
                    message: 'Service order updated successfully.'
                });
            }
        );
    } catch (error) {
        console.log('Exception in updateExistingServiceOrder:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const deleteServiceOrderRecord = (req, res) => {
    try {
        const orderId = req.params.id;
        db.run("DELETE FROM service_orders WHERE id = ?", [orderId], function(err) {
            if (err) {
                console.log('Error deleting service order:', err);
                return res.status(500).json({ error: 'Failed to delete service order.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Service order not found to delete.' });
            }
            return res.status(200).json({ message: 'Service order deleted successfully.' });
        });
    } catch (error) {
        console.log('Exception in deleteServiceOrderRecord:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

module.exports = {
    getAllServiceOrders,
    getServiceOrderById,
    createNewServiceOrder,
    updateExistingServiceOrder,
    deleteServiceOrderRecord
};