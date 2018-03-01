module.exports = (client, oldMember, newMember) => {
  if (client.sqlReady === true) {
    // Global Presence Updates (persistent)
    client.temp.sqlData.push({ location: 'global', type: 'presenceUpdate' })
    // User Presence Updates (persistent)
    client.temp.sqlData.push({ location: oldMember.user.id, type: 'presenceUpdate' })
    // Guild Presence Updates (persistent)
    client.temp.sqlData.push({ location: oldMember.guild.id, type: 'presenceUpdate' })
  }
}
