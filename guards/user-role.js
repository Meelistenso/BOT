module.exports = {
  name: 'user-role',
  description: 'Отображает аватар упомянутых пользователях',
  execute(message, command) {
    const { roles } = require('../user-roles.json');
    let res = -1;

    let userRoles = [];

    if (!message.author.bot)
      userRoles = message.member.roles.array();

    userRoles.forEach((role) => {
      switch(role.name) {
        case "обосран": message.react('💩'); break;
        default: break;
      }
    });

    if (!command) return;

    const admin = message.guild.roles.find("name", "Admin");
    if (
      message.member.id == 319883689175810048 ||
      message.member.roles.has(admin.id)
    ) { res = 1 }
    userRoles.forEach((role) => {
      for (var i = 0; i < roles.length; i++) {
        if (roles[i].name == role.name) {
          roles[i].premissions.forEach((premission) => {
            if (premission == command.name) {
              console.log(premission +" "+ command.name +"Access granted");
              res = 1;
            }
          });
        }
      }
    });

    if (res == -1) {
      message.reply("Пшел нах!");
    }
    return res;
  },
};
