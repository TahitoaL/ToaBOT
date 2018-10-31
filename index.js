var Bot = require('./Bot')
let Discord = require('discord.js')
let Commands = require('./commands/index')

require('dotenv').config()

bot.login(process.env.TOKEN)
const client = new Discord.Client()
const bot = new Bot(client, process.env.TOKEN)
console.log(Commands)
bot
    // .addCommand(PingCommand)
    .connect()
