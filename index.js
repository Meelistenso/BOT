const fs = require('fs');
const Discord = require('discord.js');
const Webhook = require("webhook-discord");
const {
  token,
  hook_url,
  server_whitelist
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

function checkServer(currentValue) {
  const allowed = server_whitelist.some((name) => {
    return currentValue.name == name;
  });

  if (allowed) {
    console.log('allowed ' + currentValue.name);
  } else {
    currentValue.leave()
      .then(g => console.log(`Left the guild ${g}`))
      .catch(console.error);
  }
}

client.on("ready", () => {
  console.log('Bot ready');
  client.guilds.forEach(checkServer);

  Hook.success(client.user.username, "Bot is online and ready in " + client
    .guilds.size + " servers");
})

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("error", (e) => {
  Hook.error(client.user.username, e.message)
})

client.on("warn", (w) => {
  Hook.warn(client.user.username, "Warning: `" + w.message + "`")
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
    if (guardContent.execute(message, client) == -1) {
      guardTrigger = true;
    }
    if (guardUser.execute(message) == -1) {
      guardTrigger = true;
    }
    if (guardRole.execute(message, command) == -1) { return };
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
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

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
    message.reply('в ходе выполнения команды случилась ошибка! Зовите Игоря.');
  } finally {
    message.delete(100);
  }
});

function login() {
  client.login(token).catch((error) => { console.log(error); login(); });
}

login();
