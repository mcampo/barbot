'use strict'
const io = require('socket.io-client')

let socket = io.connect('http://localhost:8000')
socket.on('connect', () => {
  console.log('socket connected')
  socket.emit('drink', { drinkName: 'fernet' }, () => {
    console.log('ack received')
    setTimeout(() => process.exit(0), 100)
  })
})
