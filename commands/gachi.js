module.exports = {
  name: 'gachi',
  description: 'Some gachi',
  execute(message, args, client) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      message.reply("Мб зайди кудат, не?").then(msg => msg
        .delete(3000));
      return;
    }
    const broadcast = message.client.createVoiceBroadcast();
    const ytdl = require('ytdl-core');
    const streamOptions = { seek: 0, volume: 1 };
    let file;
    if (args[0]) { file = args[0] } else {
      file =
        './assets/music/gachi/Vulgar_Power.mp3'
    }
    voiceChannel.join()
      .then(connection => {
        if (!args[0]) {
          broadcast.playFile(file);
          const dispatcher = connection.playBroadcast(broadcast);
          dispatcher.on("end", end => {
            console.log("left channel");
            voiceChannel.leave();
          });
        } else {
          // connection.playArbitraryInput(args[0]);
          const stream = ytdl(args[0], { filter: 'audio' }); // filter: 'audioonly'
          const dispatcher = connection.playStream(stream, streamOptions);
          dispatcher.on("end", end => {
            console.log("left channel");
            voiceChannel.leave();
          });
        }
      })
      .catch(err => {
        console.log(err);
        message.reply('Gachi umer. :( Zovite Igorya').then(msg => {
          msg.delete(3000);
        });
      });
  },
};
