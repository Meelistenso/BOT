module.exports = {
    name: 'user-info',
    usage: '<user-info> | {Упоминание} ...',
    description: 'Отображает информацию об упомянутых пользователях',
    execute(message, args) {
      if (!message.mentions.users.size) {
        return message.channel.send(`Ваше имя: ${message.author.username}\nID: ${message.author.id}`);
      }

      const infoList = message.mentions.users.map(user => {
        return `Имя пользователя ${user.username}: ${user.username}\nID: ${user.id}`;
      });

      message.channel.send(infoList);
    },
};
