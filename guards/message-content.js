module.exports = {
    name: 'message-content',
    description: 'Отображает аватар упомянутых пользователях',
    execute(message, client) {
      if (message.content.toLowerCase().includes('dota')) {
        message.reply("POSHEL NAHUI!");
        return -1;
      }
      if (
        message.content.toLowerCase().includes(' go ') ||
        message.content.toLowerCase().includes(' го ') ||
        message.content.toLowerCase().startsWith('go ')||
        message.content.toLowerCase().startsWith('го ')
        ) {
        if (message.channel) {
          message.channel.send(` `, {
            files: [
              "./assets/images/roflan.jpg"
            ]
          });
        }
        return -1;
      }
    },
};
