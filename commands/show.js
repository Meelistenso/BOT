const GoogleImages = require('google-images');
const client = new GoogleImages('017605167169540631951:p2k8iexibpi',
  ' AIzaSyBYeAQhIABYfS6_c_urqxlxY3MEHs4Cf-4');
module.exports = {
  name: 'show',
  aliases: ['pokan'],
  usage: '<show> {Слово}',
  description: 'Описывает заданную сущность',
  args: true,
  execute(message, args) {
    let requestWord = args[0];
    if (args.length >= 1) {
      for (var i = 1; i < args.length; i++) {
        requestWord += ' ' + args[i];
      }
      client.search(requestWord + '', { safe: 'off' })
        .then((images) => {
          images.forEach((item, index) => {
            if (item.type === "image/jpeg" || item.type === "image/png" || item.type === "image/gif"){
            console.log(requestWord + ' ' + index + ': ' + item.url);
            message.channel.send(requestWord + ' ' + index + ':', {
              file: item.url
            });
          }
          });
        });
    }
  },
};