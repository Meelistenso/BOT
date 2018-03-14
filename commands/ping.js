module.exports = {
  name: 'ping',
  description: 'Ping!',
  cooldown: 5,
  execute(message, args) {
    message.channel.send('Pong.').then(msg => {
      msg.delete(1000);
    });
  },
};
