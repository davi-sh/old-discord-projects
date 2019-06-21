const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('../data/config')


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', message => {
  let chan = message.channel
  let messageParts = message.cleanContent.toLowerCase().split(' ')
  let commandString = messageParts[0]
  
  if (commandString == "!uwu") {
    console.log(`${message.author.username} said ${message.cleanContent}`)
    messageParts.shift()
    let response = uwuize(messageParts)
    chan.send(response)
    .then(sent => console.log(`Replied to ${message.author.username} with message:\n${response}`))
    .catch(console.error)
  }
  else if (message.cleanContent == "!link") {
    chan.send("https://discordapp.com/api/oauth2/authorize?client_id=591383548393684992&permissions=280576&scope=bot")
    .catch(console.error)
  }
})

client.login(config.token)
  .catch(console.error)

function uwuize(input) {
    let output = []
    input.forEach(element => {
      if (element[0] != '<') {
        element = element.replace(/what/g, "wut")
        //element = element.replace(/What/g, "Wot")
        //element = element.replace(/when/g, "wen")
        element = element.replace(/your/g, "yuwh")
        //element = element.replace(/Your/g, "You")
        element = element.replace(/you/g, "uwu")
        //element = element.replace(/You/g, "Youwu")
        element = element.replace(/kiddo/g, "kwiddo")
        element = element.replace(/moxie/g, "mwoxie")
        element = element.replace(/have/g, "hab")

        element = element.replace(/ th/g, " d")
        //element = element.replace(/Th/g, "D")
        element = element.replace(/th /g, "f ")
        element = element.replace(/lth/g, "lf")
        element = element.replace(/th/g, "d")
        element = element.replace(/l/g, "w")
        //element = element.replace(/L/g, "W")
        element = element.replace(/r/g, "w")
        element = element.replace(/ing/g, "in")
        //element = element.replace(/R/g, "W")
        //element = element.replace(/R/g, "W")

        output.push(element)
      }
      else {
        output.push(element)
      }
    });

    return output.join(" ")
}