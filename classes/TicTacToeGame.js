let mention = require('../functions/mention')

module.exports = class TicTacToeGame {
    constructor (message, ennemy) {
        this.channel = message.channel
        this.players = [message.author, ennemy]
        this.board = [[], [], []]
        this.board.forEach((array) => {
            for (let i = 0; i < 3; i++){
                array[i] = -1
            }
        })
    }

    stringToCoords (player, str) {
        let val1 = str.split('')[0]
        let val2 = str.split('')[1]
        if (str.length != 2 || !val1.match(/A-C]/) || !val2.match(/0-3/)){
            this.channel.send(mention(player) + ' Vous avez envoyé des coordonées invalides :cry:')
        } else {
            let x,y
            y = parseInt(val2) - 1
            switch (val1){
                case 'A':
                    x = 0
                    break
                case 'B':
                    x = 1
                    break
                case 'C':
                    x=2
                    break
            }
            return [x, y]
        }
    }

    play (player, coords) {
        if (this.players.indexOf(player) == -1){
            this.channel.send(mention(player) + ' Vous ne pouvez pas participer à cette partie :cry:')
        } else {
            if (this.board[coords[0]][coords[1]] != -1){
                this.channel.send(mention(player) + ' Cette case est déjà jouée :scream:')
            } else {
                this.board[coords[0]][coords[1]] = this.players.indexOf(player)
            }
        }
    }

    renderBoard () {
        let res = '__' + this.board[0][0] + '|' + this.board[0][1] + '|' + this.board[0][2] + '__\n__' + this.board[1][0] + '|' + this.board[1][1] + '|' + this.board[1][2] + '__\n' + this.board[2][0] + '|' + this.board[2][1] + '|' + this.board[2][2]
        res.replace('-1', ' ').replace('0', 'X').replace('1', 'O')
        this.channel.send(res)
    }

    abort() {

    }
}