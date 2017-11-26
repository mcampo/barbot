'use strict'
const nconf = require('nconf'),
  Twit = require('twit'),
  EventEmitter = require('events').EventEmitter

nconf.env().file({ file: 'config.json' })

const twitter = new Twit({
  consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
  consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
  access_token: nconf.get('TWITTER_ACCESS_TOKEN'),
  access_token_secret: nconf.get('TWITTER_ACCESS_TOKEN_SECRET')
})
const eventHashtags = nconf.get('EVENT_HASHTAGS').split(',')
const drinksHashtags = nconf.get('DRINKS_HASHTAGS').split(',')

const tweetStream = twitter.stream('statuses/filter', {
  track: eventHashtags.concat(drinksHashtags)
})
const events = new EventEmitter()

console.log(`Tracking tweets with hashtags: ${eventHashtags.concat(drinksHashtags).join(' ')}`)
tweetStream.on('tweet', function(tweet) {

  const isRetweet = !!tweet.retweeted_status
  if (isRetweet) {
    return
  }

  const hasEventHashtag = tweet.entities.hashtags.some(hashtag =>
    eventHashtags.some(eventHashtag => eventHashtag === `#${hashtag.text}`)
  )
  const matchedDrinkHashtag = tweet.entities.hashtags.find(hashtag =>
    drinksHashtags.some(drinkHashtag => drinkHashtag === `#${hashtag.text}`)
  )
  if (hasEventHashtag && matchedDrinkHashtag) {
    events.emit('tweet', {
      name: tweet.user.name,
      screen_name: tweet.user.screen_name,
      drinkName: matchedDrinkHashtag.text
    })
  }
})

module.exports = events
