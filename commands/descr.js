const fetch = require("node-fetch");
const encodeUrl = require('encodeurl')
const LanguageDetect = require('languagedetect');
module.exports = {
  name: 'descr',
  aliases: ['wtf'],
  usage: '<descr> {Слово}',
  description: 'Описывает заданную сущность',
  args: true,
  execute(message, args) {
    let requestWord;
    let lang;
    if (args[0][0] === '-') {
      lang = args[0].replace('-', '');
      requestWord = args[1];
      if (args.length >= 2) {
        for (var i = 2; i < args.length; i++) {
          requestWord += ' ' + args[i];
        }
      }
    } else {
      lang = 'en';
      requestWord = args[0];
      if (args.length >= 1) {
        for (var i = 1; i < args.length; i++) {
          requestWord += ' ' + args[i];
        }
      }
      const lngDetector = new LanguageDetect();
      const langName = lngDetector.detect(requestWord);
      switch (langName[0][0]) {
        case 'english':
          lang = 'en';
          break;
        case 'german':
          lang = 'de';
          break;
        case 'french':
          lang = 'fr';
          break;
        case 'spanish':
          lang = 'es';
          break;
        case 'russian':
          lang = 'ru';
          break;
        case 'japanese':
          lang = 'ja';
          break;
        case 'dutch':
          lang = 'nl';
          break;
        case 'italian':
          lang = 'it';
          break;
        case 'swedish':
          lang = 'sv';
          break;
        case 'polish':
          lang = 'pl';
          break;
        case 'vietnamese':
          lang = 'vi';
          break;
        case 'portuguese':
          lang = 'en';
          break; //pt
        case 'arabic':
          lang = 'ar';
          break;
        case 'chinese':
          lang = 'zh';
          break;
        case 'ukrainian':
          lang = 'uk';
          break;
        case 'catalan':
          lang = 'ca';
          break;
        case 'norwegian':
          lang = 'no';
          break;
        case 'finnish':
          lang = 'fi';
          break;
        case 'czech':
          lang = 'cs';
          break;
        case 'hungarian':
          lang = 'hu';
          break;
        case 'romanian':
          lang = 'ro';
          break;
        case 'korean':
          lang = 'ko';
          break;
        case 'danish':
          lang = 'da';
          break;
        case 'indonesian':
          lang = 'id';
          break;
        case 'hebrew':
          lang = 'he';
          break;
        case 'persian':
          lang = 'fa';
          break;
        case 'thai':
          lang = 'th';
          break;
        case 'greek':
          lang = 'el';
          break;
        case 'hindi':
          lang = 'hi';
          break;
        case 'bengali':
          lang = 'bn';
          break;
        case 'cebuano':
          lang = 'ceb';
          break;
        case 'turkish':
          lang = 'tr';
          break;
        case 'esperanto':
          lang = 'eo';
          break;
        case 'serbian':
          lang = 'ru';
          break; //sr
        case 'lithuanian':
          lang = 'lt';
          break;
        case 'slovak':
          lang = 'sk';
          break;
        case 'bulgarian':
          lang = 'ru';
          break; //bg
        case 'slovene':
          lang = 'sl';
          break;
        case 'basque':
          lang = 'eu';
          break;
        case 'estonian':
          lang = 'et';
          break;
        case 'croatian':
          lang = 'hr';
          break;
        case 'telugu':
          lang = 'te';
          break;
        case 'norwegian':
          lang = 'nn';
          break;
        case 'galician':
          lang = 'gl';
          break;
        case 'uzbek':
          lang = 'ru';
          break;
        case 'kyrgyz':
          lang = 'ru';
          break;
        case 'mongolian':
          lang = 'ru';
          break;
        default:
          break;
      }
    }
    requestWord = encodeUrl(requestWord);
    const url = 'https://' + lang +
      '.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=' +
      requestWord +
      '&prop=info&format=json&redirects=resolve';
    fetch(url)
      .then(response => {
        response.json().then(json => {
          if (json[1][0] !== undefined) {
            if (!json[2][0].endsWith(':')) {
              message.channel.send(json[1][0] + ': ' + json[2][0]);
            } else {
              message.channel.send('**' + json[1][1] + '**' + ': ' + json[
                2][1]);
              message.channel.send('Но это не точно');
            }
          } else {
            message.channel.send('Сам хз');
          }
          console.log('Request: '+json[0][0]);
        });
      })
      .catch(error => {
        console.log(error);
      });
  },
};
