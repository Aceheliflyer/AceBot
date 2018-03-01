module.exports = (client, member) => {
  if (client.sqlReady === true) {
    // Global Guild Member Available (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'guildMemberAvailable' })
    // User Guild Member Available (persistent)
    client.temp.sqlData.push({ location: member.user.id, type: 'guildMemberAvailable' })
    // Guild Member Available (persistent)
    client.temp.sqlData.push({ location: member.guild.id, type: 'guildMemberAvailable' })
  }
}
