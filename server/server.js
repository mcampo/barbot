'use strict'
const IO = require('socket.io')
const tweets = require('./tweets')

const ioServer = IO(8000)
let socket = null

console.log('io server created')
ioServer.on('connection', newSocket => {
  console.log(`Socket ${newSocket.id} connected`)
  if (socket) {
    console.log(`Socket already connected, disconnecting ${newSocket.id}`)
    newSocket.disconnect()
    return
  }
  socket = newSocket

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)
    socket = null
  })
})

tweets.on('tweet', tweet => {
  console.log(`${tweet.name} (${tweet.screen_name}) pide un ${tweet.drinkName}`)
  socket.emit('drink', { drinkName: tweet.drinkName }, err => {
    if (err) {
      return console.log(`error received for ${tweet.screen_name}:`, err)
    }
    console.log('ack received')
  })
})
