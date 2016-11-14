'use strict'
const IO = require('socket.io')
const readline = require('readline')

let ioServer = IO(8000)
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('io server created')

ioServer.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`)
  rl.prompt()
  rl.on('line', line => {
    socket.emit('drink', { drinkName: line }, (err) => {
      if (err) {
        return console.log('error received:', err)
      }
      console.log('ack received')
      rl.prompt()
    })
  })

  socket.on('disconnect', () => {
    console.log(`Socket disconnected`)
  })
})
