module.exports = {
    name: 'react',
    description: 'Запускает голосование. (30 сек)',
    execute(message, args) {
      message.reply('`' + message.content.substring(6, message.content.length - 1) + '`')
       .then(() => message.react('👍').then(() => message.react('👎')));

      const filter = (reaction, user) => {
        return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      message.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
          const reaction = collected.first();

          if (reaction.emoji.name === '👍') {
            message.reply('на твоё предложение пальцы стоят вверх');
          }
          else {
            message.reply('на твоё предложение пальцы висят вниз');
          }
        })
        .catch(collected => {
          console.log(`Через 30 сек только ${collected.size} проголосовали.`);
          message.reply('на твоё предложение пальцы стоят ни вверх, ни вниз');
        });
    }
};
