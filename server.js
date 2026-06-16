require('dotenv').config()

const express = require('express')
const app = express()
const pool = require('./db')
const authRoutes = require('./auth')

app.use(express.json())
app.use('/api', authRoutes)

app.get('/', (req, res) => {
    res.send("Job Application Tracker API is running.")
})

app.post('/insert', async (req, res) => {
    try{
        const { position, company } = req.body

        if (!position || !company) {
            return res.status(400).json({ error: "Invalid position or company" })
        }

        await pool.query(
            'INSERT INTO jobtracker (user_id, company, position) VALUES ($1, $2, $3)',
            [1, company, position]
        )

        res.json({ 
            position: `${position}`,
            company: `${company}`
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error'})
    }
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})