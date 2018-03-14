module.exports = {
    name: 'beep',
    description: 'Beep!',
    execute(message, args) {
      message.reply('Boop.').then((msg) => {
          msg.delete(1000);
        });
    },
};
