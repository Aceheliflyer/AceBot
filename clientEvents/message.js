const { stripIndents } = require('common-tags')

module.exports = (client, message) => {
  if (message.author.id === client.user.id) {
    // Bot Messages Sent (this session)
    client.botStats.messagesSent = client.botStats.messagesSent + 1
  } else {
    // Bot Messages Received (this session)
    client.botStats.messagesReceived = client.botStats.messagesReceived + 1
  }
  // Bot Mentions (this session)
  if (message.author.id !== client.user.id && ~message.content.indexOf(`<@${client.user.id}>`)) {
    client.botStats.clientMentions = client.botStats.clientMentions + 1
  }

  if (client.sqlReady === true) {
  // Global Messages Sent (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'message' })
    // User Messages Sent (persistent)
    client.temp.sqlData.push({ location: message.author.id, type: 'message' })
    // Channel Messages Sent (persistent)
    client.temp.sqlData.push({ location: message.channel.id, type: 'message' })
    if (message.guild) {
      // Guild Messages Sent (persistent)
      client.temp.sqlData.push({ location: message.guild.id, type: 'message' })
    }
  }

  // Token Protection
  if (message.content.toLowerCase().includes(client.token.toLowerCase())) {
    client.log.info(stripIndents`
    RESET YOUR TOKEN IMMEDIATELY! YOUR TOKEN HAS BEEN EXPOSED!
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    Message: ${message.content}
    `, 'CLIENT NOTICE', 'bgRed')
  }
}
