'use strict'

class Barbot {

  constructor(dispenser, recipes) {
    this.dispenser = dispenser
    this.recipes = recipes
  }

  makeDrink(drinkName) {
    let steps = this.recipes[drinkName]
    if (!steps) {
      return Promise.reject(`No recipe for ${drinkName}`)
    }
    console.log(`Making ${drinkName}`)
    return steps.reduce((chain, step) => chain.then(() => {
      return this.dispenser.goToPosition(step.position)
        .then(() => this.dispenser.serve(step.amount))
    }), Promise.resolve())
      .then(() => console.log('Done'))
  }

}

module.exports = Barbot
