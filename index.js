require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
const app = express()
const port = 3001

app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/address', async (req, res) => {
    try {
        const response  = await fetch(process.env.RAIDEN_CLIENT_URL + '/api/v1/address')
        const json = await response.json();
        res.send(json)
    } catch(err) {
        res.status(400).send({err});
    }
})

app.get('/channels', async (req, res) => {
    try {
        const response  = await fetch(process.env.RAIDEN_CLIENT_URL + '/api/v1/channels')
        const json = await response.json();
        res.send(json)
    } catch(err) {
        res.status(400).send({err});
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))