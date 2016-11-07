'use strict'
const IO = require('socket.io')

function io(barbot) {
  let ioServer = IO(8000)
  console.log('io server created')

  ioServer.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`)
    socket.on('drink', (data, ack) => {
      console.log('Received "drink" event', data)
      barbot.makeDrink(data.drinkName)
      ack()
    })
    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`)
    })
  })
}

module.exports = io
