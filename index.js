let Bot = require('./Bot')
let Discord = require('discord.js')
let Commands = require('./commands/index')
let http = require("http")

require('dotenv').config()

const client = new Discord.Client()
const bot = new Bot(client, process.env.TOKEN)
Commands.forEach((command) => {
    bot.addCommand(command)
})
bot.connect()

setInterval(() => {
    http.get("http://toal.000webhostapp.com/transports/contents/getMetro.php?station=stopPoint:59520&line=100110012:12&sens=0")
}, 30000)