const translate = require('google-translate-api');

module.exports = {
    name: 'translate',
    aliases: ['trans', 'tr'],
    usage: '<translate> {Текст}',
    description: 'Переводик тект на заданный язык',
    execute(message, args) {
      if (!args || !args.length) {
        return;
      }

      let lang;
      if (args[0][0] !== '-') {
        lang = 'ru';
      } else {
        lang = args[0].replace('-','');
        args.splice(0, 1);
      }

      translate(args.join(' '), {to: lang}).then(res => {
        console.log(res);
        message.channel.send(res.text);
      }).catch(error => {
        message.reply(error.message).then(msg => {
          msg.delete(3000);
        });
        console.log(error);
        if (error.code === 400) {
          let resp = '';
          Object.entries(translate.languages).forEach((entry) => {
            if (typeof(entry[1]) !== 'function') {
              resp += entry[0] + ': ' + entry[1] + '\n';
            }
          })
          message.reply(resp).then(msg => {
            msg.delete(10000);
          });
        }
      });
    },
};
