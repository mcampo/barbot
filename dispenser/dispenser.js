'use strict'
const five = require('johnny-five')

const PIN_ENABLE = 8
const PIN_SERVO = 9
const PIN_STEP = 11
const PIN_DIR = 12
const STEPS_PER_REV = 200 * 16
const STEPS_PER_POSITION = 166 * 16
const POSITIONS_COUNT = 4


class DispenserDriver {

  constructor(options) {
    this.options = Object.assign({ debug: false }, options)
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.board = new five.Board({
        repl: this.options.debug,
        debug: this.options.debug
      })
      this.board.on('ready', () => {
        this.onBoardReady()
        if (this.options.debug) {
          this.board.repl.inject({ dispenser: this })
        }
        resolve()
      })
    })
  }

  /**
   * @private
   */
  onBoardReady() {
    this.currentPosition = 1
    this.enablePin = new five.Pin(PIN_ENABLE)
    this.enablePin.high()

    this.servo = new five.Servo({
      pin: PIN_SERVO,
      startAt: 0
    })

    this.stepper = new five.Stepper({
      type: five.Stepper.TYPE.DRIVER,
      stepsPerRev: STEPS_PER_REV,
      pins: {
        step: PIN_STEP,
        dir: PIN_DIR
      }
    });
    this.stepper
      .rpm(15)
      .cw()
      .accel(0)
      .decel(0)
  }

  goToPosition(newPosition) {
    return new Promise((resolve, reject) => {
      if (newPosition === this.currentPosition) {
        return resolve()
      }
      let stepOptions = getStepOptions(this.currentPosition, newPosition)
      this.enablePin.low()
      setTimeout(() => {
        this.stepper.step(stepOptions, () => {
          this.currentPosition = newPosition
          this.enablePin.high()
          resolve()
          console.log(`Done. current position: ${this.currentPosition}`)
        })
      }, 500)
    })
  }

  serve(amount) {
    if (amount <= 0) {
      return Promise.resolve()
    }
    return moveServo(this.servo, 130)
            .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
            .then(() => moveServo(this.servo, 0))
            .then(() => this.serve(amount - 1))
  }

}

function getStepOptions(currentPosition, newPosition) {
  let positionsToMove = Math.abs(newPosition - currentPosition)
  let direction = newPosition > currentPosition ? five.Stepper.DIRECTION.CW : five.Stepper.DIRECTION.CCW

  //check if it's shorter going the other way
  if (positionsToMove > (POSITIONS_COUNT / 2)) {
    positionsToMove = (positionsToMove - (POSITIONS_COUNT / 2))
    direction = inverseDirection(direction)
  }

  return {
    steps: positionsToMove * STEPS_PER_POSITION,
    direction: direction
  }

}

function inverseDirection(direction) {
  return direction === five.Stepper.DIRECTION.CW ? five.Stepper.DIRECTION.CCW : five.Stepper.DIRECTION.CW
}

function moveServo(servo, toPosition) {
  return new Promise((resolve, reject) => {
    servo.once('move:complete', () => {
      console.log('move:complete')
      resolve()
    })
    servo.to(toPosition, 1000)
  })
}

module.exports = DispenserDriver
