// import { Messages } from 'discord.js'
let Command = require('./Command')

module.exports = class PingCommand extends Command {

    constructor() {
        // this.null = null
    }

    name = 'Ping'
    description = 'Vérification du fonctionnement du bot'
    slug = 'ping'

    async run (message, args){
        await this.replyDM('Pong', message)
    }

}