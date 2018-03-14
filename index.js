const fs = require('fs');
const Discord = require('discord.js');
const Webhook = require("webhook-discord");
const {
  token,
  hook_url,
} = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.guards = new Discord.Collection();
//commands load
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
//guards load
const guardFiles = fs.readdirSync('./guards');
for (const file of guardFiles) {
  const guard = require(`./guards/${file}`);
  client.guards.set(guard.name, guard);
}
const cooldowns = new Discord.Collection();
const Hook = new Webhook(hook_url);
client.on("ready", () => {
  console.log('Bot ready');
  Hook.success(client.user.username, "Bot is online and ready in " + client
    .guilds.size + " servers")
})
client.on("error", (e) => {
  Hook.error(client.user.username, e)
})
client.on("warn", (w) => {
  Hook.warn(client.user.username, "Warning: `" + w + "`")
})
client.on('message', message => {
  const commandExtractor = require(`./processors/command-extractor.js`);
  const data = commandExtractor.execute(message, client);
  let command;
  let args;
  if (data) {
    command = data.command;
    args = data.args;
  }

  // message guards
  const guardContent = client.guards.get('message-content');
  const guardUser = client.guards.get('user');
  const guardRole = client.guards.get('user-role');

  let guardTrigger = false;

  try {
    if (guardContent.execute(message) == -1) {
      guardTrigger = true;
    }
    if (guardUser.execute(message) == -1) {
      guardTrigger = true;
    }
    guardRole.execute(message, command);
  } catch (error) {
    console.error(error);
    message.reply('в ходе проверки команды случилась ошибка! Зовите Игоря.');
  }

  if ((guardTrigger) || (!command)) { return }

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
  } else {
    const expirationTime = timestamps.get(message.author.id) +
      cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  // execute command
  try {
    command.execute(message, args);
    console.log(message.author + ':\n' + message.content);
  } catch (error) {
    console.error(error);
    message.reply(
      'в ходе выполнения команды случилась ошибка! Зовите Игоря.');
  } finally {
    message.delete(100);
  }
});

function login() {
  client.login(token).catch((error) => { login() });
}

login();
