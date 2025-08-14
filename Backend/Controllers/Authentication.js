const { pool } = require('../config/dbconnect');

exports.registeruser = async (req, res) => {
    console.log("Register endpoint hit");
    try {
        const { username, email, password } = req.body;
        if (!username || !password || !email || username.length < 3 || password.length < 6) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        const user = await pool.query(
            'INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password]
        );
        console.log("User registered successfully:", user.rows[0]);
        res.status(201).json({ success: true, data: user.rows[0] });
    } catch (error) {
        console.error("Error in register endpoint:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    res.send("Login logic here");
};
