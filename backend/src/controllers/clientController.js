const db = require('../config/database');

const getAllClients = (req, res) => {
    try {
        db.all("SELECT * FROM clients ORDER BY id DESC", [], (err, rows) => {
            if (err) {
                console.log('Error fetching clients:', err);
                return res.status(500).json({ error: 'Failed to retrieve clients.' });
            }
            return res.status(200).json(rows);
        });
    } catch (error) {
        console.log('Exception in getAllClients:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const getClientById = (req, res) => {
    try {
        const clientId = req.params.id;
        db.get("SELECT * FROM clients WHERE id = ?", [clientId], (err, row) => {
            if (err) {
                console.log('Error fetching client by ID:', err);
                return res.status(500).json({ error: 'Failed to retrieve client.' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Client not found.' });
            }
            return res.status(200).json(row);
        });
    } catch (error) {
        console.log('Exception in getClientById:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const createNewClient = (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const company = req.body.company;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Name, email and phone are required fields.' });
        }

        db.run(
            "INSERT INTO clients (name, email, phone, company) VALUES (?, ?, ?, ?)",
            [name, email, phone, company],
            function(err) {
                if (err) {
                    console.log('Error creating client:', err);
                    return res.status(500).json({ error: 'Failed to create client.' });
                }
                const newClientId = this.lastID;
                return res.status(201).json({
                    message: 'Client created successfully.',
                    client: {
                        id: newClientId,
                        name: name,
                        email: email,
                        phone: phone,
                        company: company
                    }
                });
            }
        );
    } catch (error) {
        console.log('Exception in createNewClient:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const updateExistingClient = (req, res) => {
    try {
        const clientId = req.params.id;
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const company = req.body.company;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Name, email and phone are required fields.' });
        }

        db.run(
            "UPDATE clients SET name = ?, email = ?, phone = ?, company = ? WHERE id = ?",
            [name, email, phone, company, clientId],
            function(err) {
                if (err) {
                    console.log('Error updating client:', err);
                    return res.status(500).json({ error: 'Failed to update client.' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Client not found to update.' });
                }
                return res.status(200).json({
                    message: 'Client updated successfully.'
                });
            }
        );
    } catch (error) {
        console.log('Exception in updateExistingClient:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const deleteClientRecord = (req, res) => {
    try {
        const clientId = req.params.id;
        db.run("DELETE FROM clients WHERE id = ?", [clientId], function(err) {
            if (err) {
                console.log('Error deleting client:', err);
                return res.status(500).json({ error: 'Failed to delete client.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Client not found to delete.' });
            }
            return res.status(200).json({ message: 'Client deleted successfully.' });
        });
    } catch (error) {
        console.log('Exception in deleteClientRecord:', error);
        return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
};

const getDashboardMetrics = (req, res) => {
    try {
        let totalClients = 0;
        let totalOrders = 0;
        let pendingOrders = 0;
        let completedOrders = 0;
        let totalRevenue = 0;

        db.get("SELECT COUNT(*) as count FROM clients", [], (err, row) => {
            if (!err && row) totalClients = row.count;
            
            db.get("SELECT COUNT(*) as count FROM service_orders", [], (err, row) => {
                if (!err && row) totalOrders = row.count;
                
                db.get("SELECT COUNT(*) as count FROM service_orders WHERE status = 'Pendente' OR status = 'Em Andamento'", [], (err, row) => {
                    if (!err && row) pendingOrders = row.count;
                    
                    db.get("SELECT COUNT(*) as count, SUM(total_amount) as revenue FROM service_orders WHERE status = 'Concluído'", [], (err, row) => {
                        if (!err && row) {
                            completedOrders = row.count;
                            totalRevenue = row.revenue || 0;
                        }

                        return res.status(200).json({
                            totalClients: totalClients,
                            totalOrders: totalOrders,
                            pendingOrders: pendingOrders,
                            completedOrders: completedOrders,
                            totalRevenue: totalRevenue
                        });
                    });
                });
            });
        });
    } catch (error) {
         console.log('Exception in getDashboardMetrics:', error);
         return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
}

module.exports = {
    getAllClients,
    getClientById,
    createNewClient,
    updateExistingClient,
    deleteClientRecord,
    getDashboardMetrics
};