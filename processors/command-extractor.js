const {
  prefix
} = require('../config.json');

module.exports = {
    name: 'command-extractor',
    description: 'Достаёт команду и аргументы из сообщения',
    execute(message, client) {
      if (!message.content.startsWith(prefix) || message.author.bot) return;

      const args = message.content.slice(prefix.length).split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName) || client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName));

      if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
      }
      if (command.args && !args.length) {
        let reply = `Вы не указали ни одного аргумента, ${message.author}!`;
        if (command.usage) {
          reply +=
            `\nОжидаемое использование: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
      }

      return { command: command, args: args };
    },
};
