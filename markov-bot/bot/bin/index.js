const Discord = require('discord.js')
const client = new Discord.Client()
// const fs = require('fs')
const rita = require('rita')
let markov = new rita.RiMarkov(3)
const config = require('../data/config')


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
  markov.loadFrom('./data/log.txt')
})

client.on('message', message => {
  if (message.isMemberMentioned(client.user)) {
    console.log(`Oh boy ${message.author.tag} is talking to me!`)
    let chan = message.channel
    chan.send(markov.generateSentences(1)).catch(console.error)
  }
})

client.login(config.token)
  .catch(console.error)

/*
let restartTimer = setInterval(() => {
  client.destroy()
    .then(
      client.login(config.token).catch(console.error))
}, 43200000) // 12 hours
*/