let creator
let state = 0
//Penser à rajouter destruction & messages d'erreurs
function mention (id){
    return '<@' + id + '>'
}
let params = {
    multipleVote: false,
    choices: []
}
let votes = []
let voters = []

module.exports = PollCommand = {
    name: 'Poll', 
    description: 'Sondage',
    slug:'poll',
    async run (message, args) {
        if (args[0] == 'create'){
            if (state == 0) {
                message.channel.send('Lancement de la création du sondage')
                state = 1
                creator = message.author
                message.channel.send('Pour configurer le sondage, tapez !poll config')
            } else {
                if (message.author.id != creator.id) {
                    message.channel.send('Impossible de créer un nouveau sondage : ' + mention(creator.id) + ' utilise déjà un sondage')
                } else {
                    message.channel.send(mention(creator.id) + ' vous avez déjà un sondage en cours.')
                }
            }
        }
        if (args[0] == 'vote'){
            if (state != 2){
                message.channel.send(mention(message.author.id) + 'calme toi ! Ce n\'est pas encore l\'heure du vote :wink:')
            } else {
                if (args[0] == 'vote'){
                    if (args[1].match(/^[0-9]*$/) && args[1] > 0 && args[1] <= array.length+1){
                        let vote = args[1] - 1
                        votes[vote] = votes[vote] + 1
                        voters.push(message.author.id)
                    } else {
                        message.channel.send(mention(message.author.id) + ' Attention ! Vote non valide')
                    }
                }
            }
        }
        if (args[0] == 'viewVoters'){
            if (state != 2){
                message.channel.send(mention(message.author.id) + 'calme toi ! Ce n\'est pas encore l\'heure du vote :wink:')
            } else {
                res = ''
                voters.forEach((voter) => {
                    res += mention(voter) + ' '
                })
                if (voters.length > 1){
                    res += 'ont voté'
                } else if (voters.length == 0){
                    res = "Personne n'a encore voté"
                } else if (voters.lenght == 1){
                    res += 'a voté'
                }
            }
        }
        if (state != 0 && message.author.id == creator.id){
            if (state == 1){
                if (args[0] == 'config'){
                    let res = 'Paramètres actuels :\n'
                    for (param in params){
                        res += '**' + param + '** : valeur ' + params[param] + '\n'
                    }
                    res += 'Pour changer un paramètre tapez **!poll set $paramAChanger**;\n**!poll go** pour lancer le sondage '
                    message.channel.send(res)
                } else if (args[0] == 'set') {
                    if (args[1] == 'multipleVote'){
                        args[2] == 'true' ? params.multipleVote = true : params.multipleVote = false
                        message.channel.send('**multipleVote** set to ' + params.multipleVote)
                    } else if (args[1] == 'choices') {
                        if (args[2] == '_delete') {
                            params.choices = []
                            message.channel.send('Les choix ont été supprimés')
                        } else {
                            args.slice(2).forEach((choice) => {
                                params.choices.push(choice)
                            })
                            message.channel.send('Pour supprimer les choix rentrés, tapez _delete')
                        }
                    }
                }
                if (args[0] == 'go'){
                    if (params.choices.length > 0){
                        state = 2
                        message.channel.send('Lancement du sondage')
                        let content = []
                        let i = 0
                        params.choices.forEach((choice) => {
                            let n = i+1
                            content[i] = {
                                name: 'Choix n°**' + n + '**',
                                value: choice
                            }
                            i++
                        })
                        let pollStartMessage = {embed: {
                                color: 3447003,
                                title: "Choix pour le vote",
                                description: "Lancement du vote",
                                timestamp: new Date(),
                                footer: {
                                    text: "© La vie cette sale race - Panda volant"
                                }
                            }
                        }
                        pollStartMessage.embed.fields = content;
                        message.channel.send(pollStartMessage)
                        i = 0
                        while (i < params.choices.length) {
                            votes[i] = 0
                            i++
                        }
                    } else {
                        message.channel.send('Veuillez créer les choix du sondage')
                    }
                }
            }
            if (state == 2){

            }
        }
    }
}