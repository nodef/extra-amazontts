#!/usr/bin/env node
const Polly = require('aws-sdk/clients/polly');

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
