const { pool } = require('../config/dbconnect');
const {createSecretToken}=require("../config/SecretToken");
const bcrypt=require("bcrypt")
exports.registeruser = async (req, res) => {
    console.log("Register endpoint hit");
    try {
        const { username, email, password } = req.body;
        if (!username || !password || !email || username.length < 3 || password.length < 6) {
            return res.status(400).json({ error: 'Invalid input',message:"INvalid input" });
        }
        const hashedpassword=await bcrypt.hash(password,10);
        const user = await pool.query(
            'INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email,hashedpassword]
        );
        const token=await createSecretToken(user.id);
        console.log("User registered successfully:", user.rows[0]);
        res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
        res.status(201).json({ success: true, data: user.rows[0] });
    } catch (error) {
        console.error("Error in register endpoint:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    console.log("Login endpoint hit");
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.rows[0].password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Password is incorrect" });
        }

        const token = await createSecretToken(user.rows[0].id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true if using HTTPS
            sameSite: "lax",
            maxAge: 1000*60*60*24
        });

        return res.status(200).json({ success: true, data: user.rows[0] });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};