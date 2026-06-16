require('dotenv').config()

const express = require('express')
const app = express()
const pool = require('./db')

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Job Application Tracker API is running.")
})

app.post('/insert', authenticateToken, async (req, res) => {
    const { position, company } = req.body
    const { userID } = req.user

    if (!position || !company) {
        return res.status(400).json({ error: "Invalid position or company" })
    }

    try{
        await pool.query(
            'INSERT INTO jobtracker (user_id, company, position) VALUES ($1, $2, $3)',
            [userID, company, position]
        )

        res.json({ 
            user: `${userid}`,
            position: `${position}`,
            company: `${company}`
        })
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error'})
    }
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})