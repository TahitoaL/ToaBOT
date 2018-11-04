module.exports = class Bot {

    constructor (client, apiKey) {
        this.commands = []
        this.apiKey = apiKey
        this.client = client
        this.commandBegin = '!'
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
        if (message.content.startsWith(this.commandBegin)){
            this.runCommand(message)
        }
    }

    runCommand(message){
        let commandParts = message.content.split(' ')
        let commandName = commandParts[0].replace(this.commandBegin, '')
        let command = this.commands.find((c) => c.slug === commandName)
        if (command == undefined){
            message.channel.send('Commande inconnue... :cry:')
            return false
        } else {
            let args = commandParts.slice(1)
            console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' : @' + message.author.username + ' utilise '  + commandName + ' : ' + args)
            command.run(message, args)
        }
    }
}