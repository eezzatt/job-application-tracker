require('dotenv').config()

const express = require('express')
const app = express()
const pool = require('./db')
const authRoutes = require('./auth')
const authenticateToken = require('./middleware')

app.use(express.json())
app.use('/api', authRoutes)

app.get('/', (req, res) => {
    res.send("Job Application Tracker API is running.")
})

app.post('/insert', authenticateToken, async (req, res) => {
    try{
        const user  = req.user

        const { position, company } = req.body

        if (!position || !company) {
            return res.status(400).json({ error: "Invalid position or company" })
        }

        await pool.query(
            'INSERT INTO jobtracker (user_id, company, position) VALUES ($1, $2, $3)',
            [user.userId, company, position]
        )

        res.json({ 
            userId: `${user.userId}`,
            position: `${position}`,
            company: `${company}`
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error'})
    }
})


app.get('/retrieve', authenticateToken, async (req, res) => {
    try {
        const user = req.user

        const result = await pool.query(
            'SELECT * FROM jobtracker WHERE user_id = ($1)',
            [user.userId]
        )

        if (!result.rows.length === 0) {
            return res.status(404).json({ error: "No jobs applied"})
        }

        return res.json({ jobs: result.rows })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal server error"})
    }
})


app.put('/:jobId', authenticateToken, async (req, res) => {
    try {
        const user = req.user
        const jobId = req.params.jobId

        const { status } = req.body

        if (!status) {
            return res.status(400).json({ error: "Status required"})
        }

        const result = await pool.query(
            'UPDATE jobtracker SET status = ($1) WHERE id= ($2) AND user_id = ($3) RETURNING *',
            [status, jobId, user.userId]
        )

        if (!result.rows[0]) {
            return res.status(404).json({ error: "Job not found"})
        }

        return res.json({ updatedJob: result.rows[0]})
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal server error"})
    }
})


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})