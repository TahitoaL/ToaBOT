let Vote = require('../classes/Vote')
let mention = require('../functions/mention')
let created = false
let poll

module.exports = PollCommand = {
    name: 'Poll', 
    description: 'Sondage',
    slug:'poll',
    async run (message, args) {
        switch(args[0]) {
            case 'create':
                if (!created) {
                    created = true
                    message.channel.send('Lancement de la création du vote')
                    console.log(message.author.username + ' vient de créer un sondage')
                    poll = new Vote (message)
                } else {
                    message.channel.send(mention(poll.author) + " est en train d'utiliser un sondage.")
                }
                break
            case 'config':
                if (created){
                    poll.sendConfig()
                }
                break
            case 'set':
                if (created && message.author.username == poll.author.username){
                    switch(args[1]){
                        case 'multipleVote':
                            if (args[2] == 'true') poll.enableMultipleVote()
                            else if (args[2] == 'false') poll.disableMultipleVote()
                            else message.channel.send('Argument invalide')
                            break
                        case 'anonymous':
                            if (args[2] == 'true') poll.enableAnonymous()
                            else if (args[2] == 'false') poll.disableAnonymous()
                            else message.channel.send('Argument invalide')
                            break
                        case 'choices':
                            if (args[2] == '_delete'){
                                poll.deleteChoices()
                            }
                            else if (args[2] == undefined){
                                message.channel.send('Veuillez préciser des choix')
                            } else {
                                poll.setChoices(args.slice(2))
                            }
                            break
                        default:
                            message.channel.send('Dernier argument invalide')
                            break
                    }
                }
                break
            case 'go':
                if (created){
                    poll.startPoll()
                }
                break
            case 'vote':
                if (created) {
                    poll.saveVote(args[1], message.author)
                }
                break
            case 'getVoters':
                if (created) {poll.getVoters()}
                break
            case 'end':
                if (created) {
                    if (message.author.username == poll.author.username)
                    {
                        poll.endPoll()
                        created = false
                    }
                    else
                    {
                        message.channel.send(mention(message.author) + ' rentre chez toi !')
                    }
                }
                break
            case 'results':
                poll.getResults()
                break
            default:
                message.channel.send('Veuillez rentrer un argument valide')
                break
        }
    }
}