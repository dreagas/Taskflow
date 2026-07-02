const db = require('../config/database');
const { logSystemEvent } = require('../utils/loggerUtil');

function createClient(req, res) {
    try {
        const { name, email, phone, address } = req.body;

        if (!name || !email) {
            logSystemEvent('clientController -> createClient', 'Missing required fields: name and email', 'ERROR');
            return res.status(400).json({ success: false, errorMessage: 'Missing required fields: Name and email are required.' });
        }

        const insertClientStatement = db.prepare('INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)');
        const result = insertClientStatement.run(name, email, phone || null, address || null);

        logSystemEvent('clientController -> createClient', `Client created successfully: ID ${result.lastInsertRowid}`);

        const newClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid);

        return res.status(201).json({ success: true, client: newClient });
    } catch (error) {
        logSystemEvent('clientController -> createClient', `Error creating client: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while creating client.' });
    }
}

function getAllClients(req, res) {
    try {
        const getAllClientsStatement = db.prepare('SELECT * FROM clients ORDER BY created_at DESC');
        const clients = getAllClientsStatement.all();

        return res.status(200).json({ success: true, clients });
    } catch (error) {
        logSystemEvent('clientController -> getAllClients', `Error fetching clients: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while fetching clients.' });
    }
}

function getClientById(req, res) {
    try {
        const clientId = req.params.id;
        const getClientStatement = db.prepare('SELECT * FROM clients WHERE id = ?');
        const client = getClientStatement.get(clientId);

        if (!client) {
            logSystemEvent('clientController -> getClientById', `Client not found: ID ${clientId}`, 'WARN');
            return res.status(404).json({ success: false, errorMessage: 'Client not found.' });
        }

        return res.status(200).json({ success: true, client });
    } catch (error) {
        logSystemEvent('clientController -> getClientById', `Error fetching client: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while fetching client.' });
    }
}

function updateClient(req, res) {
    try {
        const clientId = req.params.id;
        const { name, email, phone, address } = req.body;

        if (!name || !email) {
            logSystemEvent('clientController -> updateClient', 'Missing required fields: name and email', 'ERROR');
            return res.status(400).json({ success: false, errorMessage: 'Missing required fields: Name and email are required.' });
        }

        const updateClientStatement = db.prepare('UPDATE clients SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?');
        const result = updateClientStatement.run(name, email, phone || null, address || null, clientId);

        if (result.changes === 0) {
             logSystemEvent('clientController -> updateClient', `Client not found for update: ID ${clientId}`, 'WARN');
             return res.status(404).json({ success: false, errorMessage: 'Client not found.' });
        }

        logSystemEvent('clientController -> updateClient', `Client updated successfully: ID ${clientId}`);

        const updatedClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(clientId);
        return res.status(200).json({ success: true, client: updatedClient });

    } catch (error) {
        logSystemEvent('clientController -> updateClient', `Error updating client: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while updating client.' });
    }
}

function deleteClient(req, res) {
     try {
        const clientId = req.params.id;

        // We removed the foreign key relationship. But to maintain the behavior for the client management view:
        const clientNameCheck = db.prepare('SELECT name FROM clients WHERE id = ?').get(clientId);

        if (clientNameCheck) {
            const checkOrdersStatement = db.prepare('SELECT count(*) as count FROM service_orders WHERE client_name = ?');
            const orderCount = checkOrdersStatement.get(clientNameCheck.name).count;

            if (orderCount > 0) {
                 logSystemEvent('clientController -> deleteClient', `Cannot delete client ${clientId} because they have associated service orders matching their name.`, 'WARN');
                 return res.status(400).json({ success: false, errorMessage: 'Cannot delete client. They have associated service orders.' });
            }
        }

        const deleteClientStatement = db.prepare('DELETE FROM clients WHERE id = ?');
        const result = deleteClientStatement.run(clientId);

        if (result.changes === 0) {
             logSystemEvent('clientController -> deleteClient', `Client not found for deletion: ID ${clientId}`, 'WARN');
             return res.status(404).json({ success: false, errorMessage: 'Client not found.' });
        }

        logSystemEvent('clientController -> deleteClient', `Client deleted successfully: ID ${clientId}`);
        return res.status(200).json({ success: true, message: 'Client deleted successfully.' });

    } catch (error) {
        logSystemEvent('clientController -> deleteClient', `Error deleting client: ${error.message}`, 'ERROR');
        return res.status(500).json({ success: false, errorMessage: 'Internal server error while deleting client.' });
    }
}

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
};
