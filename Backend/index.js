const express=require("express");

const app=express();
const cors = require('cors');
const { pool } = require('./Helper/dbconnect');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// const userRouter=require("./Routes/userrouter");
// const Feedbackroutes=require("./Routes/Feedbackroutes")


// app.use("/api",userRouter);
// app.use("/api",Feedbackroutes);
app.get('/feedback', async (req, res) => {
    console.log('Fetching feedback from database...');
  try {
    const result = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('❌ Error fetching feedback:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.get("/",(req,res)=>{
    res.send(`<h1>Welcome to the Backend Server</h1>`);
})
app.listen(8000,()=>{
    console.log("Server is running on port 8000");
})


