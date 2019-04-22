const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
const app = express()
const port = 3001

app.use(cors())
app.get('/', (req, res) => res.send('Hello World!'))

app.get('/address', function (req, res) {

    fetch(process.env.RAIDEN_API_URL + '/api/v1/address', {
        mode: 'cors'
      })
      .then(res => res.json())
      .then(json => {
        res.send(json)
      })

    
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))