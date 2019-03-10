let mention = require('../functions/mention')
let TicTacToe = require('../classes/TicTacToeGame')

let gameState = 0
let player1 = undefined
let player2 = undefined

module.exports = TicTacToeCommand = {
    name: 'Morpion', 
    description: 'Jouer au morpion',
    slug:'t',
    async run (message, args) {
        switch (args[0]){
            case 'duel':
                if (args[1] != undefined && args[1].startsWith('<') && args[1].endsWith('>') && (args[1].length == 21 || args[1].length == 22)) {
                    let found = message.guild.members.find((member) => {
                        return member.user.id == args[1].replace('<', '').replace('>', '').replace('@', '').replace('!', '')
                    })
                    if (found == undefined){
                        message.channel.send(mention(message.author) + " L'utilisateur que vous souhaitez (com)battre n'est pas dans le channel")
                    } else if (found.user.presence.status != 'online') {
                        message.channel.send(mention(message.author) + " L'utilisateur que vous voulez (com)battre n'est pas disponible")
                    } else if (found.user.bot) {
                        message.channel.send(mention(message.author) + " Vous ne pouvez pas combattre un bot :confused:")
                    } else if (found.user.id == message.author.id) {
                        message.channel.send('Tu me fais de la peine :cry:, ça doit pas être facile de se sentir aussi seul... Mais courage, je suis avec toi :wink:')
                    } else {
                        gameState = 1
                        player1 = message.author
                        player2 = found.user
                        message.channel.send(mention(player2) + ' pour accepter le duel, taper ` !t accept `')
                    }
                }
                if (args[1] == undefined)
                {
                    message.channel.send('Veuillez préciser le nom de votre adversaire !')
                }
                break
            case 'accept':
                if (message.author.id == player2.id && gameState == 1)
                {
                    let Game = new TicTacToe(message, player1, player2)
                    gameState = 2
                    Game.createBoard()
                    Game.gameFinished().then((r) => {
                        // destruction de l'instance du jeu et remise ) l'état 0 du gamaState
                        gameState = 0
                        Game = undefined
                    })
                } else {
                    message.channel.send('A mon avis, vous vous êtes trompé :confused:')
                }
                break
            default:
                message.channel.send("Et là, c'est le beug ! :cry:")
        }
    }
}