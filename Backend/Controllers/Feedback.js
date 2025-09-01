

const { pool } = require('../config/dbconnect');

exports.fetchfeedback = async (req, res) => {

    const id=req.userId;

  if(!id){
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }
    try {
        // Fetch previous feedbacks for the user
        const result = await pool.query(
            `SELECT * FROM feedback WHERE user_id = $1 ORDER BY created_at DESC`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No feedback found' });
        }
            
        return res.status(200).json({ success: true, feedbacks: result.rows });
    } catch (error) {
       
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
};


