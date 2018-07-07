const Discord = require('discord.js')
const http = require('http')
const {URL} = require('url')

const bot = new Discord.Client()

bot.on('ready', () => {
    console.log('Bot ready')
    bot.user.setActivity('rien du tout')
})

bot.login(process.env.TOKEN)