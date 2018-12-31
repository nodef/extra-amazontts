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


// Global variables
const E = process.env;
const STDIO = [0, 1, 2];
const OPTIONS = {
  stdio: null,
  help: false,
  log: boolean(E['TTS_LOG']||'0'),
  output: E['TTS_OUTPUT']||'out.mp3',
  text: E['TTS_TEXT'],
  retries: parseInt(E['TTS_RETRIES']||'8', 10),
  acodec: E['TTS_ACODEC']||'copy',
  service: {
    region: E['TTS_SERVICE_REGION']||null,
    endpoint: E['TTS_SERVICE_ENDPOINT']||null
  },
  credentials: {
    id: E['TTS_CREDENTIALS_ID']||null,
    key: E['TTS_CREDENTIALS_KEY']||null,
    path: E['TTS_CREDENTIALS_PATH']||null
  },
  audio: {
    encoding: E['TTS_AUDIO_ENCODING']||null,
    frequency: parseInt(E['TTS_AUDIO_FREQUENCY']||'0')
  },
  language: {
    code: E['TTS_LANGUAGE_CODE']||null,
    lexicons: (E['TTS_LANGUAGE_LEXICONS']||'').split(',').filter(v => !!v),
  },
  voice: {
    name:  E['TTS_VOICE_NAME']||null,
    gender: E['TTS_VOICE_GENDER']||'neutral'
  },
  quote: {
    break: parseFloat(E['TTS_QUOTE_BREAK']||'250'),
    emphasis: E['TTS_QUOTE_EMPHASIS']||'moderate'
  },
  heading: {
    break: parseFloat(E['TTS_HEADING_BREAK']||'4000'),
    difference: parseFloat(E['TTS_HEADING_DIFFERENCE']||'250'),
    emphasis: E['TTS_HEADING_EMPHASIS']||'strong',
  },
  ellipsis: {
    break: parseFloat(E['TTS_ELLIPSIS_BREAK']||'1500')
  },
  dash: {
    break: parseFloat(E['TTS_DASH_BREAK']||'500')
  },
  newline: {
    break: parseFloat(E['TTS_NEWLINE_BREAK']||'1000')
  },
  block: {
    length: parseFloat(E['TTS_BLOCK_LENGTH']||'5000'),
    separator: E['TTS_BLOCK_SEPARATOR']||'.'
  },
};
const VOICE = new Map([
  ['cmn-CN', {f: 'Zhiyu', m: null}],
  ['da-DK', {f: 'Naja', m: 'Mads'}],
  ['nl-NL', {f: 'Lotte', m: 'Ruben'}],
  ['en-AU', {f: 'Nicole', m: 'Russell'}],
  ['en-GB', {f: 'Amy', m: 'Brian'}],
  ['en-IN', {f: 'Aditi', m: null}],
  ['en-US', {f: 'Ivy', m: 'Joey'}],
  ['en-GB-WLS', {f: null, m: 'Geraint'}],
  ['fr-FR', {f: 'Celine', m: 'Mathieu'}],
  ['fr-CA', {f: 'Chantal', m: null}],
  ['de-DE', {f: 'Marlene', m: 'Hans'}],
  ['hi-IN', {f: 'Aditi', m: null}],
  ['is-IS', {f: 'Dora', m: 'Karl'}],
  ['it-IT', {f: 'Carla', m: 'Giorgio'}],
  ['ja-JP', {f: 'Mizuki', m: 'Takumi'}],
  ['ko-KR', {f: 'Seoyeon', m: null}],
  ['nb-NO', {f: 'Liv', m: null}],
  ['pl-PL', {f: 'Ewa', m: 'Jacek'}],
  ['pt-BR', {f: 'Vitoria', m: 'Ricardo'}],
  ['pt-PT', {f: 'Ines', m: 'Cristiano'}],
  ['ro-RO', {f: 'Carmen', m: null}],
  ['ru-RU', {f: 'Tatyana', m: 'Tatyana'}],
  ['es-ES', {f: 'Conchita', m: 'Enrique'}],
  ['es-MX', {f: 'Mia', m: null}],
  ['es-US', {f: 'Penelope', m: 'Miguel'}],
  ['sv-SE', {f: 'Astrid', m: null}],
  ['tr-TR', {f: 'Filiz', m: null}],
  ['cy-GB', {f: 'Gwyneth', m: null}]
]);
const FN_NOP = () => 0;


// Format time in HH:MM:SS format.
function timeFormat(t) {
  var hh = Math.floor(t/3600).toString().padStart(2, '0');
  var mm = Math.floor((t%3600)/60).toString().padStart(2, '0');
  var ss = Math.floor(t%60).toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

// Get filename, without extension.
function pathFilename(pth) {
  return pth.substring(0, pth.length-path.extname(pth).length);
};

// Read file, return promise.
function fsReadFile(pth, o) {
  return new Promise((fres, frej) => fs.readFile(pth, o, (err, data) => {
    return err? frej(err):fres(data);
  }));
};

// Write file, return promise.
function fsWriteFile(pth, dat, o) {
  return new Promise((fres, frej) => fs.writeFile(pth, dat, o, (err) => {
    return err? frej(err):fres();
  }));
};

// Execute child process, return promise.
function cpExec(cmd, o) {
  var o = o||{}, stdio = o.log? o.stdio||STDIO:o.stdio||[];
  if(o.log) console.log('-cpExec:', cmd);
  if(o.stdio==null) return Promise.resolve({stdout: cp.execSync(cmd, {stdio})});
  return new Promise((fres, frej) => cp.exec(cmd, {stdio}, (err, stdout, stderr) => {
    return err? frej(err):fres({stdout, stderr});
  }));
};

// Get SSML from text.
function textSsml(txt, o) {
  var q = o.quote, h = o.heading, e = o.ellipsis, d = o.dash, n = o.newline;
  txt = txt.replace(/\"(.*?)\"/gm, (m, p1) => {
    var brk = `<break time="${q.break}ms"/>`;
    var emp = `<emphasis level="${q.emphasis}">"${p1}"</emphasis>`;
    return brk+emp+brk;
  });
  txt = txt.replace(/(=+)\s(.*?)\s\1/g, (m, p1, p2) => {
    var brk = `<break time="${h.break-p1.length*h.difference}ms"/>`;
    var emp = `<emphasis level="${h.emphasis}">${p2}</emphasis>`;
    return brk+'Topic '+emp+brk;
  });
  // txt = txt.replace(/\((.*?)\)/gm, '<emphasis level="reduced">($1)</emphasis>');
  // txt = txt.replace(/\[(.*?)\]/gm, '<emphasis level="reduced">[$1]</emphasis>');
  txt = txt.replace(/\.\.\./g, `<break time="${e.break}ms"/>...`);
  txt = txt.replace(/\—/g, `<break time="${d.break}ms"/>—`);
  txt = txt.replace(/(\r?\n)+/gm, `<break time="${n.break}ms"/>\n`);
  return `<speak>${txt}</speak>`;
};

// Get SSML block from long text.
function textSsmlBlock(txt, o) {
  var b = o.block;
  for(var end=b.length;;) {
    end = Math.floor(0.75*end);
    var i = txt.lastIndexOf(b.separator, end)+1;
    i = i>0? i:Math.min(txt.length, end);
    var ssml = textSsml(txt.substring(0, i), o);
    if(ssml.length<b.length) break;
  }
  return [ssml, txt.substring(i)];
};

// Get sections for text.
function textSections(txt) {
  var re = /(=+)\s+(.*?)\s+\1/g;
  for(var i=0, title=null, top=null, secs=[]; (top=re.exec(txt))!=null;) {
    secs.push({title, content: txt.substring(i, top.index)});
    i = top.index; title = top[2];
  }
  secs.push({title, content: txt.substring(i)});
  return secs;
};

// Get voice config from options.
function voiceConfig(o)  {
  var n = o.name;
  var lc = n? n:(o.languageCode||VOICE.languageCode);
  lc = lc.substring(0, 2).toLowerCase()+'-';
  lc += lc.length>=5? lc.substring(3, 5).toUpperCase():'US';
  var sg = (o.ssmlGender||VOICE.ssmlGender).toUpperCase();
  if(lc===VOICE.languageCode && sg===VOICE.ssmlGender) n = n||VOICE.name;
  return {name: n, languageCode: lc, ssmlGender: sg};
};

// Write TTS audio to file.
function audiosWrite(out, ssml, tts, o) {
  var l = o.log, ac = o.audioConfig||{}, v = o.voice;
  var enc = path.extname(out).substring(1).toUpperCase();
  ac.audioEncoding = ac.audioEncoding||enc;
  var req = {input: {ssml}, voice: v, audioConfig: ac};
  return new Promise((fres, frej) => {
    tts.synthesizeSpeech(req, (err, res) => {
      if(err) return frej(err);
      fs.writeFile(out, res.audioContent, 'binary', (err) => {
        if(l) console.log('-audiosWrite:', out);
        if(err) return frej(err);
        fres(out);
      });
    });
  });
};

// Write TTS audio to file, with retries.
async function audiosRetryWrite(out, ssml, tts, o) {
  var err = null;
  for(var i=0; i<o.retries; i++) {
    try { return await audiosWrite(out, ssml, tts, o); }
    catch(e) { err = e; }
  }
  throw err;
};

// Generate output SSML parts.
function outputSsmls(txt, o) {
  for(var i=0, z=[]; txt; i++) {
    var [ssml, txt] = textSsmlBlock(txt, o);
    z[i] = ssml;
  }
  return z;
};

// Generate output audio part files.
function outputAudios(out, ssmls, tts, o) {
  o.voice = voiceConfig(o.voice);
  if(o.log) console.log('-outputAudios:', out, ssmls.length);
  var pth = pathFilename(out), ext = path.extname(out);
  for(var i=0, I=ssmls.length, z=[]; i<I; i++)
    z[i] = audiosRetryWrite(`${pth}.${i}${ext}`, ssmls[i], tts, o);
  return Promise.all(z);
};

// Get durations of audio part files.
function outputDurations(auds) {
  var durs = [];
  for(var aud of auds)
    durs.push(musicMetadata.parseFile(aud).then(m => m.format.duration));
  return Promise.all(durs);
};

// Generate output audio file.
async function outputAudio(out, auds, o) {
  if(o.log) console.log('-outputAudio:', out, auds.length);
  var lst = tempy.file({extension: 'txt'}), dat = '';
  for(var aud of auds)
    dat += `file '${aud}'\n`;
  await fsWriteFile(lst, dat);
  var z = await cpExec(`ffmpeg -y -safe 0 -f concat -i "${lst}" -acodec ${o.acodec} "${out}"`, o);
  fs.unlink(lst, FN_NOP);
  return z;
};

// Get Polly constructor options.
function pollyOptions(o) {
  return {endpoint: o.service.endpoint, accessKeyId: o.credentials.id, secretAccessKey: o.credentials.key, region: o.service.region};
};

// Get Polly synthesize speech params.
function pollySynthesizeSpeechParams(o) {
  var ae = o.audio.encoding==='ogg'? 'ogg_vorbis':o.audio.encoding;
  var af = o.audio.frequency? o.audio.frequency.toString():null;
  var vg = /^f/i.test(o.voice.gender)? 'f':(/^m/i.test(o.voice.gender)? 'm':null);
  var v = VOICE.get(o.language.code), vn = o.voice.name||(vg==='m'? v.m||v.f||null:v.f||v.m||null);
  return {LexiconNames: o.language.lexicons, OutputFormat: ae, SampleRate: af, Text: null,
    TextType: 'ssml', VoiceId: vn, LanguageCode: o.language.code};
};

/**
 * Generate speech audio from super long text through machine (via "Amazon Polly", "ffmpeg").
 * @param {string} out output audio file.
 * @param {string} txt input text.
 * @param {object} o options.
 * @returns promise <out>.
 */
async function amazontts(out, txt, o) {
  var o = _.merge({}, OPTIONS, o);
  var out = out||o.output, c = o.credentials
  var txt = txt||o.input||(o.text? await fsReadFile(o.text, 'utf8'):null);
  if(o.log) console.log('@amazontts:', out, txt);
  if(c.keyFilename) c.keyFilename = randomItem(c.keyFilename.split(';'));
  var tts = new textToSpeech.TextToSpeechClient(c);
  var ext = path.extname(out);
  var aud = tempy.file({extension: ext.substring(1)});
  var secs = textSections('\n'+txt), prts = [], ssmls = [];
  for(var sec of secs) {
    var secSsmls = outputSsmls(sec.content, o);
    prts.push(secSsmls.length);
    Array.prototype.push.apply(ssmls, secSsmls);
  }
  var auds = await outputAudios(aud, ssmls, tts, o);
  out = await outputAudio(out, auds, o);
  var durs = await outputDurations(auds);
  for(var i=0, j=0, t=0, toc=[], I=secs.length; i<I; i++) {
    toc[i] = {title: secs[i].title, time: timeFormat(t)};
    for(var p=0; p<prts[i]; p++)
      t += durs[j++];
  }
  for(var f of auds) fs.unlink(f, FN_NOP);
  if(o.log) console.log(' .toc:', toc);
  return toc;
};

// Get options from arguments.
function options(o, k, a, i) {
  if(k==='--help') o.help = true;
  else if(k==='-l' || k==='--log') o.log = true;
  else if(k==='-o' || k==='--output') o.output= a[++i];
  else if(k==='-t' || k==='--text') o.text = a[++i];
  else if(k==='-r' || k==='--retries') o.retries = parseInt(a[++i], 10);
  else if(k==='-c' || k==='--credentials') _.set(o, 'credentials.keyFilename', a[++i]);
  else if(k==='-a' || k==='--acodec') _.set(o, 'acodec', a[++i]);
  else if(k==='-sr' || k==='--service_region') _.set(o, 'service.region', a[++i]);
  else if(k==='-se' || k==='--service_endpoint') _.set(o, 'service.endpoint', a[++i]);
  else if(k==='-ci' || k==='--credentials_id') _.set(o, 'credentials.id', a[++i]);
  else if(k==='-ck' || k==='--credentials_key') _.set(o, 'credentials.key', a[++i]);
  else if(k==='-cp' || k==='--credentials_path') _.set(o, 'credentials.path', a[++i]);
  else if(k==='-ae' || k==='--audio_encoding') _.set(o, 'audio.encoding', a[++i]);
  else if(k==='-af' || k==='--audio_frequency') _.set(o, 'audio.frequency', parseInt(a[++i], 10));
  else if(k==='-lc' || k==='--language_code') _.set(o, 'language.code', a[++i]);
  else if(k==='-ll' || k==='--language_lexicons') _.set(o, 'language.lexicons', a[++i]);
  else if(k==='-vn' || k==='--voice_name') _.set(o, 'voice.name', a[++i]);
  else if(k==='-vg' || k==='--voice_gender') _.set(o, 'voice.gender', a[++i]);
  else if(k==='-qb' || k==='--quote_break') _.set(o, 'quote.break', parseFloat(a[++i]));
  else if(k==='-qe' || k==='--quote_emphasis') _.set(o, 'quote.emphasis', a[++i]);
  else if(k==='-hb' || k==='--heading_break') _.set(o, 'heading.break', parseFloat(a[++i]));
  else if(k==='-hd' || k==='--heading_difference') _.set(o, 'heading.difference', parseFloat(a[++i]));
  else if(k==='-he' || k==='--heading_emphasis') _.set(o, 'heading.emphasis', a[++i]);
  else if(k==='-eb' || k==='--ellipsis_break') _.set(o, 'ellipsis.break', parseFloat(a[++i]));
  else if(k==='-db' || k==='--dash_break') _.set(o, 'dash.break', parseFloat(a[++i]));
  else if(k==='-nb' || k==='--newline_break') _.set(o, 'newline.break', parseFloat(a[++i]));
  else if(k==='-bl' || k==='--block_length') _.set(o, 'block.length', parseInt(a[++i], 10));
  else if(k==='-bs' || k==='--block_separator') _.set(o, 'block.separator', a[++i]);
  else o.input = a[i];
  return i+1;
};
amazontts.options = options;
module.exports = amazontts;

// Run on shell.
async function shell(a) {
  var o = {input: await getStdin()};
  for(var i=2, I=a.length; i<I;)
    i = options(o, a[i], a, i);
  if(o.help) return cp.execSync('less README.md', {cwd: __dirname, stdio: STDIO});
  var toc = await amazontts(null, null, o);
  if(o.log || OPTIONS.log) return;
  for(var c of toc)
    if(c.title) console.log(c.time+' '+c.title);
};
if(require.main===module) shell(process.argv);










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
