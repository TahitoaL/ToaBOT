module.exports = class Bot {

    constructor (client, apiKey) {
        this.commands = []
        this.apiKey = apiKey
        this.client = client
        this.client.on('ready', () => {
            this.client.user.setActivity('Taper sur des pandas')
            console.log('Bot pret')
        })
        this.client.on('message', this.onMessage.bind(this))
    }

    async connect () {
        await this.client.login(this.apiKey)
        this.client.on('error', e => console.error(e.message))
    }

    addCommand(command) {
        this.commands.push(command)
        return this
    }

    onMessage(message) {
        if (message.content.startsWith('!')){
            this.runCommand(message)
        }
    }

    runCommand(message){
        let commandParts = message.content.split(' ')
        let commandName = commandParts[0].replace('!', '')
        let command = this.commands.find((c) => c.slug === commandName)
        if (command == undefined){
            message.channel.send('Commande inconnue... :cry:')
            return false
        } else {
            console.log('Lancement de la commande : '  + commandName)
            command.run(message, commandParts.slice(1))
        }
    }
}