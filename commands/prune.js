module.exports = {
  name: 'prune',
  usage: '<prune> {1..99}',
  description: 'Удаляет заданное колличество сообщений выше',
  execute(message, args) {
    //if (user) {}
    const amount = parseInt(args[0]) + 1;
    if (isNaN(amount)) {
      return message.reply('похоже это не совсем корректное число').then(msg => {
        msg.delete(3000);
      }).catch(console.log('Message i\'snt deleted'));
    } else if (amount <= 1 || amount > 100) {
      return message.reply('следует ввести число от 1 до 99').then(msg => {
        msg.delete(3000);
      })
    }
    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      message.channel.send('ошибка при удалении сообщений').then(msg => {
        msg.delete(3000);
      })
    });
  },
};
