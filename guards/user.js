module.exports = {
    name: 'user',
    description: 'Отображает аватар упомянутых пользователях',
    execute(message) {
      if (message.content.toLowerCase().includes('dota')) {
        message.reply("POSHEL NAHUI!");
        return -1;
      }
    },
};
