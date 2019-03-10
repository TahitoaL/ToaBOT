let mention = require('../functions/mention')
let Discord = require('discord.js')

module.exports = class TicTacToeGame {
    constructor (message, player1, player2) {
        this.client = message.client
        this.channel = message.channel
        this.players = [player1, player2]
        this.playerTurn = 0
        this.turn = 0
        this.board = [[], [], []]
        this.board.forEach((array) => {
            for (let i = 0; i < 3; i++){
                array[i] = 2
            }
        })
        this.blank = message.guild.emojis.find(emoji => emoji.name == "_blank")
        this.cross = message.guild.emojis.find(emoji => emoji.name == "_cross")
        this.circle = message.guild.emojis.find(emoji => emoji.name == "_circle")
        this.messageStatus
        this.messageBoard
        this.reactions = [
            "\u2196", // Top left
            "\u2B06", // Top
            "\u2197", // Top right
            "\u2B05", // Left
            "\u23FA", // Middle
            "\u27A1", // Right
            "\u2199", // Bottom left
            "\u2B07", // Bottom
            "\u2198"  // Bottom right
        ]
        this.gameReady = false //remettre faux à la fin !
        this.gameFinish = false
    }

    intToCoords (int) {
        switch (int) 
        {
            case 0:
                return [0, 0]
            case 1:
                return [0, 1]
            case 2:
                return [0, 2]
            case 3:
                return [1, 0]
            case 4:
                return [1, 1]
            case 5:
                return [1, 2]
            case 6:
                return [2, 0]
            case 7:
                return [2, 1]
            case 8:
                return [2, 2]
        }
    }

    play (player, coords) {
        if (this.players.indexOf(player) == -1){
            this.channel.send(mention(player) + ' Vous ne pouvez pas participer à cette partie :cry:')
        } else {
            if (this.board[coords[0]][coords[1]] != 2){
                this.channel.send(mention(player) + ' Cette case est déjà jouée :scream:')
            } else {
                this.board[coords[0]][coords[1]] = this.players.indexOf(player)
                this.messageBoard.edit(this.renderBoard())
                if (this.checkWinner() == -1) {
                    this.playerTurn = (this.playerTurn + 1)%2
                    this.messageStatus.edit('Au tour de ' + mention(this.players[this.playerTurn]))
                    this.turn++
                    if (this.turn >= 9)
                    {
                        this.messageStatus.edit('Partie terminée !')
                        let msg = new Discord.RichEmbed()
                        msg.setTitle('Ohhhh').setColor(0x000088).setDescription('Partie nulle ! 😒')
                        this.channel.send(msg)
                        this.channel.send("", {
                            file: "https://media.tenor.com/images/bd667aa6ad314f47c291f6b61bf06035/tenor.gif"
                        })
                        this.gameReady = false
                        this.gameFinish = true
                    }
                }                
                else
                {
                    this.messageStatus.edit('Partie terminée !')
                    let msg = new Discord.RichEmbed()
                    msg.setTitle('BRAVO !').setColor(0xFF0000).setDescription(mention(this.players[this.checkWinner()]) + ' a gagné ! 🤗')
                    this.channel.send(msg)
                    this.gameReady = false
                    this.gameFinish = true
                }
            }
        }
    }

    checkWinner () {
        let winner = -1
        this.board.forEach(row => {
            if (row[0] == row[1] && row[0] == row[2] && row[0] != 2) //horizontal lines
            {
                winner = row[0]
            }
        })
        let numbers = [0, 1, 2]
        numbers.forEach((number) => {
            if (this.board[0][number] == this.board[1][number] && this.board[0][number] == this.board[2][number] && this.board[0][number] != 2) //vertical lines
            {
                winner = this.board[0][number]
            }
        })
        if ((this.board[0][2] == this.board[1][1] && this.board[1][1] == this.board[2][0]) || (this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]))//diagonals
        {
            this.board[1][1] != 2 ? winner = this.board[1][1] : winner = -1
        }
        return winner
    }

    async createBoard () {
        this.channel.send("Chargement...").then(msg => {
            this.messageStatus = msg
        })
        this.channel.send(this.renderBoard()).then(msg => {
            this.messageBoard = msg
            let i = 0
            this.reactions.forEach((reaction) => {
                msg.react(reaction).then(async r => {
                    i++
                    if (i == 9)
                    {
                        this.gameReady = true
                        this.messageStatus.edit('Au tour de ' + mention(this.players[this.playerTurn]))
                        msg.client.on('messageReactionAdd', (reaction, user) => {
                            if (!this.gameReady)
                            {
                                // break
                            }
                            if (reaction.message.id == msg.id && user.id == this.players[this.playerTurn].id)
                            {
                                this.play(user, this.intToCoords(this.reactions.indexOf(reaction.emoji.name)))
                            }
                        })
                    }
                })
            })
        })
    }

    renderBoard() {
        let res = ''
        this.board.forEach(row => {
            row.forEach((square) => {
                switch (square)
                {
                    case 0:
                        res += `${this.cross}`
                        break
                    case 1:
                        res+= `${this.circle}`
                        break
                    default:
                        res+= `${this.blank}`
                }
            })
            res != '' ? res+= '\n' : res = '';
        })
        return res
    }

    gameFinished() {
       return new Promise ((resolve, reject) => {
            let checkEnd = setInterval(() => {
                if (this.gameFinish)
                {
                    resolve('game ended')
                    clearInterval(checkEnd)
                    this.messageBoard.clearReactions()
                }
            }, 500)
       })
    }

    abort() {

    }
}