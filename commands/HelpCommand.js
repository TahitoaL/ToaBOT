module.exports = HelpCommand = {
    name: 'Help', 
    description: 'Aide',
    slug:'help',
    async run (message, args) {
        let Commands = require('./index')
        let res = 'Aide : \n'
        Commands.forEach((command) => {
            res += command.name + ' : ' + command.description + '.\n'
        })
        message.channel.send(res)
    }
}