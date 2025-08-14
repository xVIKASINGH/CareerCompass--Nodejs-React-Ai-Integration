const { pool } = require('../config/dbconnect');
const {createSecretToken}=require("../config/SecretToken");
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
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
       const user=await pool.query(
        'SELECT * FROM users WHERE email = $1 AND password = $2',
        [email, password]
       )
       if(!user){
        return res.status(404).json({ error: 'User not found' });

       }
       res.cookie("token", createSecretToken(user.rows[0].id), {
        withCredentials: true,
        httpOnly: false
    });
    return res.status(200).json({ success: true, data: user.rows[0] });
    } catch (error) {
        console.log("an error has occurred",error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    
};
