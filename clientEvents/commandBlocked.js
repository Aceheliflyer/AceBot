const { stripIndents } = require('common-tags')

module.exports = (client, message, reason) => {
  client.log.warn(stripIndents`
    ${message.command ? `${message.command.memberName} (${message.command.groupID})` : ''}
    User: ${message.author.tag} (${message.author.id})
    ${message.guild ? `Guild: ${message.guild.name} (${message.guild.id})\n` : ''}Channel: ${message.guild ? `${message.channel.name} (${message.channel.id})` : 'DMs'}
    Reason: ${reason}
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'commandBlocked')

  // Global Commands Blocked (persistent)
  client.temp.sqlData.push({ location: 'global', type: 'commandBlocked' })
  // User Commands Blocked (persistent)
  client.temp.sqlData.push({ location: message.author.id, type: 'commandBlocked' })
  // Channel Commands Blocked (persistent)
  client.temp.sqlData.push({ location: message.channel.id, type: 'commandBlocked' })
  if (message.guild) {
    // Guild Commands Blocked (persistent)
    client.temp.sqlData.push({ location: message.guild.id, type: 'commandBlocked' })
  }

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.commandBlocked) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'commandBlocked' },
          timestamp: new Date(),
          title: `commandBlocked${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          fields: [
            {
              'name': 'Command',
              'value': message.command ? `${message.command.memberName} \`(${message.command.groupID})\`` : '',
              'inline': true
            },
            {
              'name': 'User',
              'value': `${message.author.tag} \`(${message.author.id})\``,
              'inline': true
            },
            {
              'name': 'Location',
              'value': `${message.guild ? `**Guild:** ${message.guild.name} \`(${message.guild.id})\`\n` : ''}**Channel:** ${message.guild ? `${message.channel.name} \`(${message.channel.id})\`` : 'DMs'}`,
              'inline': true
            },
            {
              'name': 'Reason',
              'value': reason,
              'inline': true
            }
          ],
          color: 0xAA0000
        }]
      })
    }
  }
}
