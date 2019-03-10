module.exports = PingCommand = {
    name: 'Ping', 
    description: 'Vérification du fonctionnement du bot',
    slug:'ping',
    async run (message, args) {
        message.channel.send('<@' + message.author.id + '> pong!')        
    }
}