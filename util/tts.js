const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');

const clientTTS = new textToSpeech.TextToSpeechClient();

async function gerarAudio(texto, nomeArquivo) {
  const request = {
    input: { text: texto },
    voice: { languageCode: 'pt-BR', ssmlGender: 'FEMALE' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await clientTTS.synthesizeSpeech(request);
  const outputFile = `./audios/${nomeArquivo}.mp3`;

  await util.promisify(fs.writeFile)(outputFile, response.audioContent);
  console.log('✅ Áudio gerado em:', outputFile);

  return outputFile;
}

module.exports = { gerarAudio };