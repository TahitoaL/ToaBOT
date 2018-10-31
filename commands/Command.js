module.exports = class Command {

  async replyDM (reply, message) {
    try {
      let channel = await message.author.createDM()
      await channel.send(reply)
    } catch (e) {
      await message.reply(reply)
    }
    if (message.channel.type !== 'dm') {
      await message.delete()
    }
    return
  }

}