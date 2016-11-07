'use strict'
const sinon = require('sinon')
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
require('sinon-as-promised')
chai.use(require('chai-as-promised'))

const Barbot = require('../barbot')

describe('Barbot', () => {

  let barbot, dispenser
  beforeEach(() => {
    let recipes = {
      'fernet': [ { position: 2, amount: 1 }, { position: 4, amount: 2 } ],
      'campari': [ { position: 1, amount: 1 }, { position: 3, amount: 3 } ],
    }
    dispenser = {
      goToPosition: sinon.stub().resolves(),
      serve: sinon.stub().resolves()
    }
    barbot = new Barbot(dispenser, recipes)
  })

  describe('#makeDrink', () => {
    it('should call dispenser following recipe steps', () => {
      return barbot.makeDrink('fernet').then(() => {
        let firstPositionCall = dispenser.goToPosition.withArgs(2)
        let firstServeCall = dispenser.serve.withArgs(1)
        let secondPositionCall = dispenser.goToPosition.withArgs(4)
        let secondServeCall = dispenser.serve.withArgs(2)
        assert.isTrue(firstPositionCall.calledOnce)
        assert.isTrue(firstServeCall.calledOnce)
        assert.isTrue(firstServeCall.calledAfter(firstPositionCall))
        assert.isTrue(secondPositionCall.calledOnce)
        assert.isTrue(secondPositionCall.calledAfter(firstServeCall))
        assert.isTrue(secondServeCall.calledOnce)
        assert.isTrue(secondServeCall.calledAfter(secondPositionCall))
      })
    })

    it('should reject if there is no recipe for requested drink', () => {
      return assert.isRejected(barbot.makeDrink('unknown drink'))
    })
  })

})
