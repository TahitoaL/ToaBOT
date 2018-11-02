let mention = require('../functions/mention')

module.exports = class Vote {
    constructor (message) {
        this.author = message.author
        this.channel = message.channel
        this.choices = []
        this.params = {
            multipleVote: false,
            anonymous: true
        }
        this.votes = []
        this.state = 0
    }

    getState(){
        return this.state
    }

    getAuthor(){
        return this.author
    }

    enableMultipleVote () {
        if (this.state == 0) {
            this.params.multipleVote = true
            this.channel.send('**multipleVote** mis a true')
        }
    }

    disableMultipleVote () {
        if (this.state == 0) {
            this.params.multipleVote = false
            this.channel.send('**multipleVote** mis a false')
        }
    }

    enableAnonymous () {
        if (this.state == 0) {
            this.params.anonymous = true
            this.channel.send('**anonymous** mis a true')
        }
    }

    disableAnonymous () {
        if (this.state == 0) {
            this.params.anonymous = false
            this.channel.send('**multipleVote** mis a false')            
        }
    }

    sendConfig () {
        if (this.state == 0){
            let res = 'Paramètres actuels :\n'
            for (let param in this.params){
                res += '**' + param + '** : valeur ' + this.params[param] + '\n'
            }
            res += 'Liste des choix possibles : ' + this.choices.length == 0 ? '_Pas de choix encore disponible_ :cry:' : this.choices
            res += 'Pour changer un paramètre tapez **!poll set $paramAChanger**;\n**!poll go** pour lancer le sondage '
            this.channel.send(res)
        }
    }

    displayChoices () {
        let content = []
        let i = 0
        this.choices.forEach((choice) => {
            let n = i+1
            content[i] = {
                name: 'Choix n°**' + n + '**',
                value: choice
            }
            i++
        })
        let pollStartMessage = {embed: {
                color: 3447003,
                timestamp: new Date(),
                footer: {
                    text: "© La vie cette sale race - Panda volant"
                }
            }
        }
        pollStartMessage.embed.fields = content;
        this.channel.send(pollStartMessage)
    }

    
    /**
     * @param {array} choices
     */
    setChoices (choices) {
        if (this.state == 0) {
            choices.forEach((choice) => {
                this.choices.push(choice)
                this.channel.send('Le choix ' + choice + ' a été rajouté.')
            })            
        }
    }

    deleteChoices () {
        if (this.state == 0) {
            this.choices = []
            this.channel.send(mention(this.author) + " Vous avez supprimé l'ensemble des choix")            
        }
    }

    deleteChoice (choice) {
        if (this.state == 0) {
            let deletedChoice = this.choices.find(c => c === choice)
            if (!deletedChoice) return false
            else return true            
        }
    }

    startPoll() {
        if (this.state == 0) {
            if (this.choices.length > 1){
                this.channel.send('Lancement du sondage')
                this.state = 1
                this.displayChoices()
            } else {
                this.channel.send('Veuillez définir au moins 2 choix')
            }
        }
    }

    hasVoted (voter){
        let hasVote = false
        this.votes.forEach((vote) => {
            vote.voter.id == voter.id ? hasVote = true : hasVote = false
        })
        return hasVote
    }

    saveVote (choice, voter) {
        if (this.state == 1) {
            let aVote = (this.hasVoted(voter) == true)
            if (aVote == true && this.params.multipleVote == false){
                this.channel.send(mention(voter) + " Vous avez déjà voté.")
            } else {
                if (choice.match(/^[0-9]*$/) != undefined && parseInt(choice) <= this.choices.length && parseInt(choice) > 0) {
                    let _choice = parseInt(choice)-1
                    this.votes.push({voter: voter, choice: _choice})
                    this.channel.send(mention(voter) + ' a voté !')            
                } else {
                    this.channel.send('Veuillez faire un choix valide')
                }
            }
        }
    }

    getVoters () {
        if (this.state == 1) {
            let res = 'Liste des personnes ayant voté :\n'
            this.votes.forEach((voter) => {
                res += mention(voter) + ' a voté.'
            })
            this.channel.send(res)            
        }
    }

    getTrend () { //Pas implémenté
        if (this.state == 1) {
            
        }
    }

    endPoll () {
        if (this.state == 1) {
            this.state = 2
            this.channel.send('Arrêt des votes !')     
            console.log(this.votes)       
        }
    }

    getResults () {
        if (this.state == 2) {
            if (this.votes.length != 0){
                let results = []
                for (let i = 0; i < this.choices.length; i++){
                    results.push(0)
                }
                this.votes.forEach((vote) => {
                    results[vote.choice] = results[vote.choice] + 1
                })
                console.log(results)
                let winners = []
                let max = Math.max(...results)
                console.log(max)
                let i = 0
                let listStr = 'Résultats :'
                results.forEach((result) => {
                    listStr += '\n' + this.choices[i] + ' a recu ' + result + ' voix (' + Math.round((result/this.votes.length)*100) + '%)'
                    if (result == max){
                        winners.push(this.choices[i])
                    }
                    i++
                })
                this.channel.send(listStr)
                let res = '**'
                i = 0
                winners.forEach((winner) => {
                    i == 0 ? res += winner : res+= '**, **' + winner
                    i++
                })
                res+= '** '
                winners.length > 1 ? res+= 'ont ' : res+= 'a '
                res+= 'gagné ! :clap:'
                this.channel.send(res)            
            }
        }
    }
}