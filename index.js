const fs = require('fs');
const Discord = require('discord.js');
const { help_prefix, prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.guards = new Discord.Collection();

//commands load
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}
//guards load
const guardFiles = fs.readdirSync('./guards');
for (const file of guardFiles) {
    const guard = require(`./guards/${file}`);

    // set a new item in the Collection
    // with the key as the guard name and the value as the exported module
    client.guards.set(guard.name, guard);
}

const cooldowns = new Discord.Collection();

client.on('ready', () => {
    console.log('Стартуем!');
});

client.on('message', message => {

    // // help
    // if (message.content.startsWith(help_prefix)) {
    //   const helpList = client.commands.map(command => {
    //     return `\nКоманда ${command.name}.${command.usage? '\nИспользование: ' + command.usage: ''}\nОписание: ${command.description}`;
    //   });
    //   message.channel.send(helpList);
    // }

    // reacts
    if (message.content === 'fruits') {
      Promise.all([
        message.react('🍎'),
        message.react('🍊'),
        message.react('🍇'),
      ])
        .catch(() => console.error('One of the emojis failed to react.'));
    }

    if (message.author.id == 306569661686874114) {
      message.react('💩');
    }

    // guards


    // commands
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
      return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
      let reply = `Вы не указали ни одного аргумента, ${message.author}!`;
      if (command.usage) {
        reply += `\nОжидаемое использование: \`${prefix}${command.name} ${command.usage}\``;
      }

      return message.channel.send(reply);
    }

    // cooldown
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(message.author.id)) {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
          return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    // execute command
    try {
      command.execute(message, args, client);
      console.log(message.author +':\n'+ message.content);
    }
    catch (error) {
      console.error(error);
      message.reply('в ходе выполнения команды случилась ошибка! Зовите Игоря.');
    }
});

client.login(token);

const hook = new Discord.WebhookClient('webhook id', 'webhook token');
hook.send('I am now alive!');
