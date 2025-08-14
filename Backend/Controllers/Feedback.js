

const { pool } = require('../config/dbconnect');

exports.submitfeedback = async (req, res) => {
    console.log('Fetching feedback from database...');
    const {user_id,comment,score}=req.body;
  try {
    const result = await pool.query('INSERT INTO feedback (user_id, comment, score) VALUES ($1, $2, $3) RETURNING *', [user_id, comment, score]);
   
       res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('❌ Error fetching feedback:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};
