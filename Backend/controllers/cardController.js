// controllers/cardController.js
const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Create Card
exports.createCard = async (req, res) => {
    const { Card_Id, kcc_Id, Max_Amount, Card_Status, Acces_Status } = req.body;

    try {
        const pool = await sql.connect(dbConfig);

        const existingCard = await pool.request()
            .input('Card_Id', sql.Int, Card_Id)
            .query('SELECT * FROM Cards WHERE Card_Id = @Card_Id');

        if (existingCard.recordset.length > 0) {
            return res.status(400).json({ message: 'Card ID already exists' });
        }

        const existingKcc = await pool.request()
            .input('kcc_Id', sql.Int, kcc_Id)
            .query('SELECT * FROM Cards WHERE kcc_Id = @kcc_Id');

        if (existingKcc.recordset.length > 0) {
            return res.status(400).json({ message: 'kcc_Id already exists' });
        }

        await pool.request()
            .input('Card_Id', sql.Int, Card_Id)
            .input('kcc_Id', sql.Int, kcc_Id)
            .input('Max_Amount', sql.Int, Max_Amount)
            .input('Card_Status', sql.VarChar, Card_Status)
            .input('Acces_Status', sql.VarChar, Acces_Status)
            .query('INSERT INTO Cards (Card_Id, kcc_Id, Max_Amount, Card_Status, Acces_Status) VALUES (@Card_Id, @kcc_Id, @Max_Amount, @Card_Status, @Acces_Status)');

        res.status(201).json({ message: 'Card created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating card', error: err.message });
    }
};

// Get Cards
exports.getCards = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Cards');
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cards', error: err.message });
    }
};

// Update Card
exports.updateCard = async (req, res) => {
    const { Card_Id, kcc_Id, Max_Amount, Card_Status, Acces_Status } = req.body;

    try {
        const pool = await sql.connect(dbConfig);

        const existingKcc = await pool.request()
            .input('kcc_Id', sql.Int, kcc_Id)
            .query('SELECT * FROM Cards WHERE kcc_Id = @kcc_Id');

        if (existingKcc.recordset.length > 0) {
            return res.status(400).json({ message: 'kcc_Id already exists' });
        }

        await pool.request()
            .input('Card_Id', sql.Int, Card_Id)
            .input('kcc_Id', sql.Int, kcc_Id)
            .input('Max_Amount', sql.Int, Max_Amount)
            .input('Card_Status', sql.VarChar, Card_Status)
            .input('Acces_Status', sql.VarChar, Acces_Status)
            .query('UPDATE Cards SET kcc_Id = @kcc_Id, Max_Amount = @Max_Amount, Card_Status = @Card_Status, Acces_Status = @Acces_Status WHERE Card_Id = @Card_Id');

        res.status(200).json({ message: 'Card updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating card', error: err.message });
    }
};

// Delete Card
exports.deleteCard = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Card_Id', sql.Int, id)
            .query('DELETE FROM Cards WHERE Card_Id = @Card_Id');

        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting card', error: err.message });
    }
};
