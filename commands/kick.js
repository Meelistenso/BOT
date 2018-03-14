module.exports = {
  name: 'kick',
  usage: '<kick> {Упоминание} | {Упоминание} ...',
  description: `Кикает упомянутых пользователей из голосового чата. `,
  guildOnly: true,
  execute(message, args) {
    if (!message.mentions.users.size) {
      return message.reply('you need to tag a user in order to kick them!').then(
        msg => {
          msg.delete(3000);
        })
    }
    // const taggedUser = message.mentions.users.first();
    const avatarList = message.mentions.users.map(user => {
      message.channel.send(`You wanted to kick: ${user.username}`);
    });
    message.channel.send(`Это успех!`).then(msg => {
      msg.delete(3000);
    })
  },
};
