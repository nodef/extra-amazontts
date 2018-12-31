#!/usr/bin/env node
const Polly = require('aws-sdk/clients/polly');
const musicMetadata = require('music-metadata');
const randomItem = require('random-item');
const getStdin = require('get-stdin');
const boolean = require('boolean');
const tempy = require('tempy');
const _ = require('lodash');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');



// Write TTS audio to file.
function audiosWrite(out, ssml, tts, o) {
  var l = o.log;
  var enc = path.extname(out).substring(1).toUpperCase();
  var req = {OutputFormat: enc==='ogg'? 'ogg_vorbis':enc, Text: ssml, TextType: 'ssml'};
  // LexiconNames — (Array<String>)
  // OutputFormat — (String)
  // SampleRate — (String)
  // SpeechMarkTypes — (Array<String>)
  // Text — (String)
  // TextType — (String)
  // VoiceId — (String)
  // LanguageCode — (String)
  return new Promise((fres, frej) => {
    tts.synthesizeSpeech(req, (err, res) => {
      if(err) return frej(err);
      fs.writeFile(out, res.AudioStream, 'binary', (err) => {
        if(l) console.log('-audiosWrite:', out);
        if(err) return frej(err);
        fres(out);
      });
    });
  });
};

async function test() {
  var polly = new Polly({
    region: 'us-east-1',
  });
  polly.synthesizeSpeech({
    OutputFormat: 'mp3',
    Text: 'Halo',
    VoiceId: 'Aditi'
  }, (err, data) => {
    if(err) throw err;
    console.log(data);
  });
};
test();
