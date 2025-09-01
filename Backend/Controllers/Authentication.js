const { pool } = require('../config/dbconnect');
const {createSecretToken}=require("../config/SecretToken");
const bcrypt=require("bcrypt")
exports.registeruser = async (req, res) => {
   
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
        const token=await createSecretToken(user.rows[0].id);
  
         res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true if using HTTPS
            sameSite: "lax",
            maxAge: 1000*60*60*24
        });
        res.status(201).json({ success: true, data: user.rows[0] });
    } catch (error) {
       
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
   
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
       
        return res.status(500).json({ error: 'Internal server error',message:"Server error 500" });
    }
};
exports .logout=async(req,res)=>{

    res.clearCookie("token",{
        httpOnly:true,
        sameSite:"None",
        secure:true,
    })
      return res.status(200).json({ success: true, message: "Logged out" });
}
exports.isLoggedIn=async (req,res)=>{
   
      return res.status(200).json({
    success: true,
    data: {
      authenticated: true,
      user: req.user, 
    }
  })
}