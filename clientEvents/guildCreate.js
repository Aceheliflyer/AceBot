const { oneLine } = require('common-tags')
const { stripIndents } = require('common-tags')
const { escapeMarkdown } = require('discord.js')

module.exports = async (client, guild) => {
  client.log.info(stripIndents`
    Guild: ${guild.name} (${guild.id})
    Owner: ${guild.owner.user.tag} (${guild.owner.user.id})
    ${client.shard ? `Shard ID: ${client.shard.id}` : ''}
  `, 'guildCreate')

  if (client.sqlReady === true) {
    // Global Guild Creations (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'guildCreate' })
    // Guild Creations (persistent)
    client.temp.sqlData.push({ location: guild.id, type: 'guildCreate' })
  }

  var ownerInfo = guild.members.find('id', guild.ownerID)

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.guildCreate) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'guildCreate' },
          timestamp: new Date(),
          title: `guildCreate${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          fields: [
            {
              'name': 'Guild',
              'value': `${guild.name} \`(${guild.id})\``,
              'inline': true
            },
            {
              'name': 'Owner',
              'value': stripIndents`
                **Name:** ${escapeMarkdown(ownerInfo.user.tag)}
                **ID:** ${ownerInfo.user.id}
                **Status:** ${ownerInfo.user.presence.status}
              `,
              'inline': true
            },
            {
              'name': `Members - (${guild.members.size})`,
              'value': oneLine`
                **Users:** ${await guild.members.filter(s => s.user.bot !== true).size}
                | **Bots:** ${await guild.members.filter(s => s.user.bot !== false).size}
              `,
              'inline': true
            }
          ],
          color: 0x4D4DFF
        }]
      })
    }
  }
}
