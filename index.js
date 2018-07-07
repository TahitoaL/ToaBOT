const Discord = require('discord.js')
const http = require('http')
const {URL} = require('url')

const bot = new Discord.Client()

bot.login(process.env.TOKEN)