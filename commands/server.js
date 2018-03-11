module.exports = {
    name: 'server',
    description: 'Отображает инфу о сервере',
    execute(message, args) {
      message.channel.send(
        `Имя сервера: ${message.guild.name}\n
         Колличество членов: ${message.guild.memberCount}\n
         Создан: ${message.guild.createdAt}\n
         Регион: ${message.guild.region}
        `
      );
    },
};

