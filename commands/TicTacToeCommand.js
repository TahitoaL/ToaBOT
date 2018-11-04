let mention = require('../functions/mention')
let TicTacToe = require('../classes/TicTacToeGame')

module.exports = PingCommand = {
    name: 'Morpion', 
    description: 'Jouer au morpion',
    slug:'t',
    async run (message, args) {
        switch (args[0]){
            case 'duel':
                if (args[1].startsWith('<') && args[1].endsWith('>') && args[1].length == 21) {
                    let found = message.guild.members.find((member) => {
                        return member.user.id == args[1].replace('<', '').replace('>', '').replace('@', '')
                    })
                    if (found == undefined){
                        message.channel.send(mention(message.author) + " L'utilisateur que vous souhaitez (com)battre n'est pas dans le channel")
                    } else if (found.user.presence.status != 'online') {
                        message.channel.send(mention(message.author) + " L'utilisateur que vous voulez (com)battre n'est pas disponible")
                    } else if (found.user.bot) {
                        message.channel.send(mention(message.author) + " Vous ne pouvez pas combattre un bot :confused:")
                    } else {
                        let Game = new TicTacToe(message, found.user)
                    }
                }
                console.log(args)
                break
        }
    }
}