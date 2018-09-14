let Discord = require('discord.js')
let http = require('http')
let {URL} = require('url')

let commands = [
    {
        name: 'RATP',
        value: 'Permet d\'interagir avec l\'API RATP'
    },
    {
        name: 'ping',
        value: 'Test avec le bot'
    },
    {
        name: 'help',
        value: 'Pour vous aider avec les commandes',
        disp: 0
    },
    {
        name: 'pf',
        value: 'Pile ou face'
    },
    {
        name: 'test',
        value: 'Test auteur',
        disp: 0
    }
]

function get(url, callback){
    http.get({
      hostname: url.hostname,
      path: url.pathname,
      pathname: url.pathname
    }, (res) => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (data) => {
        rawData += data;
      });
  
      res.on('end', () => {
        callback(rawData)   ;
      });
    });
}

function getUrl(urlA, callback) {
    const url = new URL (urlA)
    get(url, callback)
}

let bot = new Discord.Client()

let commandsName = []
let publicCommands = []
commands.forEach((command) => {
    commandsName.push(command.name)
    if (command.disp == undefined || command.disp != 0){
        publicCommands.push(command)
    }
})
console.log(commandsName)

bot.on('ready', () => {
    bot.user.setActivity('rien du tout')
    console.log('Bot ready')
})

bot.on('message', (message) => {
  if (message.content.charAt(0) === '!'){
    let command = message.content.replace('!', '').replace(/ .*/,'')
    if (commandsName.indexOf(command) > -1){
        let flags = message.content.replace(' ', '').split('-')
        flags.shift()
        if (flags.length > 0){
            launch(message, command, flags)
        } else {
            launch(message, command)
        }
    } else {
        message.channel.send('La commande que vous avez entré est inconnue')
    }
  }
  if (message.content == 'Allemagne'){
      message.channel.send('https://s2-ssl.dmcdn.net/YiJr6/x1080-vNl.jpg')
  }
  if (message.content == "Bonjour"){
      message.channel.send('Bonjour ' + message.author.username)
  }
  if (1 == 2){
      console.log('Les pandas vont nous envahir')
  }
})

function launch (message, command, flags = 0) {
    console.log(command + ' + ' + flags)
    switch (command) {
        case 'RATP' :
            RATP(message, flags)
            break
        case 'ping' :
            ping(message)
            break
        case 'help' :
            help(message)
            break
        case 'pf' :
            pf(message)
            break
        case 'test' :
            test(message)
            break
    }
}

function RATP(message, flags){
    if (flags.length == 1 && flags[0] === 'T'){
        message.channel.startTyping()
        getUrl('http://toal.000webhostapp.com/transports/contents/trafficJson.php', (data) => {
            let parsed = JSON.parse(data)
            let content = []
            let i = 0
            Object.values(parsed).forEach((ligne) => {
                let traffic = {
                    name: ligne.title + ' sur la ligne ' + ligne.line + '\n',
                    value: ligne.message
                }
                content[i] = traffic
                i++
            })
            let messageTraffic = {embed: {
                color: 3447003,
                author: {
                  name: bot.user.username,
                  icon_url: bot.user.avatarURL
                },
                title: "Info traffic",
                url: "https://ratp.fr",
                description: "**__Bulletin de " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' UTC__**',
                timestamp: new Date(),
                footer: {
                  icon_url: bot.user.avatarURL,
                  text: "© La vie cette sale race - Panda volant"
                }
              }
            }
            messageTraffic.embed.fields = content;
            message.channel.stopTyping()
            message.channel.send(messageTraffic)
        })
    } else if (flags.length == 1 && flags[0] === 'A'){
       
    } else if (flags.length == 1 && flags[0] === 'R'){

    } else if (flags.lenght == 1 && flags[0] === 'C'){

    }
}

function ping (message) {
    message.channel.send('pong!')
}

function help (message) {
    let messageHelp = {embed: {
        color: 3447003,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL
        },
        title: "Aide",
        url: "",
        description: '',
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: "© La vie cette sale race - Panda volant"
        }
      }
    }
    messageHelp.embed.fields = publicCommands;
    message.channel.send(messageHelp)
}

function pf (message) {
    message.channel.send(Math.round(Math.random() * 100)%2 == 1 ? 'Pile' : 'Face')
}

function test (message) {
    console.log(message)
    message.channel.send(message.author.username)
}

bot.login(process.env.TOKEN)  
