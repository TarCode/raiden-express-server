require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
var bodyParser = require('body-parser')
const Maker = require('@makerdao/dai');

const app = express()
const port = 3001

app.use(cors())
app.use(bodyParser.json())

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

// GET all tokens
app.get('/tokens', async (req, res) => {
    try {
        const response  = await fetch(process.env.RAIDEN_CLIENT_URL + '/api/v1/tokens')
        const json = await response.json();
        res.send(json)
    } catch(err) {
        res.status(400).send({err});
    }
})

// POST token: Register new token
app.post('/tokens', async (req, res) => {
    const {token_address} = req.body;
    
    try {
        const response  = await fetch(process.env.RAIDEN_CLIENT_URL + '/api/v1/tokens/'+ token_address, {
            method: 'PUT'
        })
        const json = await response.json();
        res.send(json)
    } catch(err) {
        res.status(400).send({err});
    }
})

// GET all channels
app.get('/channels', async (req, res) => {
    try {
        const response  = await fetch(process.env.RAIDEN_CLIENT_URL + '/api/v1/channels')
        const json = await response.json();
        res.send(json)
    } catch(err) {
        res.status(400).send({err});
    }
})

// POST channel: Creates a new channel
app.post('/channels', async (req, res) => {
    const {token_address} = req.body;
    
    try {
        const response  = await fetch(process.env.RAIDEN_CLIENT_URL + '/api/v1/channels', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "partner_address": "0x0763d61743Bcf83Cce1231D2Df9F8642EF114B82",
                "token_address": "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
                "total_deposit": 35000000,
                "settle_timeout": 500
            })
        })
        const json = await response.json();
        res.send(json)
    } catch(err) {
        res.status(400).send({err});
    }
})

// Create new payment
app.post('/payments', async (req, res) => {
    const {identifier, amount, token_address, target_address} = req.body;
    
    try {
        const response  = await fetch(process.env.RAIDEN_CLIENT_URL + '/api/v1/payments/' + token_address + '/' + target_address, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount,
                identifier
            })
        })
        const json = await response.json();
        res.send(json)
    } catch(err) {
        res.status(400).send({err});
    }
})

// GET payment events
app.get('/payments', async (req, res) => {
    const { token_address, target_address } = req.body;
    try {
        const response  = await fetch(process.env.RAIDEN_CLIENT_URL + '/api/v1/payments/' + token_address + '/' + target_address)
        const json = await response.json();
        res.send(json)
    } catch(err) {
        res.status(400).send({err});
    }
})

app.post('/send', async (req, res) => {
   const {amount, recipient_address} = req.body;

   try {
    const maker = await Maker.create('http',{
        privateKey: process.env.PRIVATE_KEY,
        url: process.env.INFURA_URL,
        provider: {
            type: 'HTTP', // or 'TEST'
            network: 'kovan'
        },
        web3: {
        statusTimerDelay: 2000,
        confirmedBlockCount: 8,
        transactionSettings: {
            gasPrice: 12000000000
        }
        },
     })

    await maker.authenticate();

    // const txMgr = maker.service('transactionManager');
    
    const cdp = await maker.openCdp();

    await cdp.lockEth(amount);
    await cdp.drawDai(parseInt(amount)* 100);

    const dai = await maker.service('token').getToken('DAI');

    // TODO: Send to contract via Raiden network

    // TODO: Add txMgr listener to listen for DAI payments

    dai.transfer(recipient_address, Maker.DAI(amount * 100));
    return res.send({ result: "DAI Transferred"})
   } catch (err) {
       return res.send({err})
   }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))