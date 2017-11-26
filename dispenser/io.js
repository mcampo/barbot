'use strict'
const ioClient = require('socket.io-client')
const IO_URL = process.env.IO_URL || 'http://localhost:8000'

function io(barbot) {
  let socket = ioClient.connect(IO_URL)

  socket.on('connect', () => {
    console.log('socket connected')
  })

  socket.on('drink', (data, ack) => {
    console.log('Received "drink" event', data)
    barbot.makeDrink(data.drinkName).then(ack).catch(ack)
  })

  socket.on('disconnect', () => {
    console.log(`Socket disconnected`)
  })
}

module.exports = io
