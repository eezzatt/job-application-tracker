const express = require('express')
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Job Application Tracker API is running.")
})

app.post('/insert', (req, res) => {
    const { position, company } = req.body

    if (!position || !company) {
        return res.status(400).json({ error: "Invalid position or company" })
    }

    const jobList = {}

    jobList.job = { position, company }

    res.json({ 
        position: `${position}`,
        company: `${company}`
    })
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})