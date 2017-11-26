'use strict'
const DispenserDriver = require('./dispenser')
const Barbot = require('./barbot')
const io = require('./io')

const RECIPES = {
  fernet: [{ position: 1, amount: 1 }, { position: 2, amount: 2 }],
  campari: [{ position: 3, amount: 1 }, { position: 4, amount: 2 }]
}

let dispenser = new DispenserDriver({ debug: true })
dispenser
  .initialize()
  .then(() => {
    let barbot = new Barbot(dispenser, RECIPES)
    io(barbot)
  })
  .catch(console.error)
