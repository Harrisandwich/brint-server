import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import initializeSocket from './socket'
import config from './config.json'


const app = express()
app.server = http.createServer(app)

// logger
app.use(morgan('dev'))

// 3rd party middleware
app.use(cors({ exposedHeaders: config.corsHeaders }))

app.use(bodyParser.json({ limit: config.bodyLimit }))

initializeSocket(app.server)

app.server.listen(process.env.PORT || config.port, () => {
  // eslint-disable-next-line
  console.log(`Started on port ${app.server.address().port}`)
})

export default app
