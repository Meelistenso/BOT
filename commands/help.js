const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Список всем команд или информация про них',
    aliases: ['commands'],
    usage: '<help> {Команда}',
    cooldown: 5,
    execute(message, args) {
      const { commands } = message.client;
      const data = [];

      if (!args.length) {
        data.push('Список команд:');
        data.push(commands.map(command => command.name).join(', '));
        data.push(`\nВы можете отправить \`${prefix}<help> {Команда}\` что-бы получить информацию об определенной команде!`);
      }
      else {
        if (!commands.has(args[0])) {
          return message.reply('это не корректная команда!');
        }

        const command = commands.get(args[0]);

        data.push(`**Команда:** ${command.name}`);

        if (command.description) data.push(`**Описание:** ${command.description}`);
        if (command.aliases) data.push(`**Синонимы:** ${command.aliases.join(', ')}`);
        if (command.usage) data.push(`**Использование:** \`${prefix}${command.usage}\``);

        data.push(`**КД:** ${command.cooldown || 3} секунд(ы)`);
      }

      message.author.send(data, { split: true })
        .then(() => {
            if (message.channel.type !== 'dm') {
                message.channel.send('Отправляю сообщение со всеми командами:').then((msg) => {
                  msg.delete(3000);
                });
            }
        })
        .catch(() => message.reply('Похоже, я не могу тебе написать!').then((msg) => {
                  msg.delete(3000);
                }));
    },
};
