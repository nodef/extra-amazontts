Generate speech audio from super long text through machine (via ["Amazon Polly"], ["ffmpeg"]).
> Do you want to:
> - Share your ideas anonymously on YouTube?
> - Pretend on phone that you are not a kid (Home Alone)?
> - Learn good english pronunciation for a speech?
> - Make your computer read out your school notes?
> - Experiment with various voices from around the globe?
> - Or, [Upload Wikipedia TTS videos on YouTube]?

Sample: ["I want to order a stuffed crust pizza"](https://clyp.it/kje2yfdk).
<br>


## setup

### install

1. Install [Node.js], if not installed.
2. Run `npm install -g extra-amazontts` in [console].
3. To install this as a package use `npm install extra-amazontts`.

### get service account key

1. Create an [account] on [Amazon Web Services].
2. Create a [new project], and select it.
3. Enable [Cloud Text-to-Speech API] for the project.
4. Add [credentials] to your project.
5. Which API are you using? `Cloud Text-to-Speech API`.
6. Are you planning to use this API with App Engine or Compute Engine? `No, I’m not using them`.
7. Select `What credentials do I need`?.
8. Create a service account.
9. Service account name: `googletts` (your choice).
10. Role: `Project -> Owner`.
11. Service account ID: `googletts` (same as name).
12. Key type: `JSON`.
13. Select `Continue`.
14. Copy downloaded file to a directory.
15. Rename the file to `account_id.json`.

### set environment variable

1. Copy path of `account_id.json`.
2. Set environment variable `GOOGLE_APPLICATION_CREDENTIALS` to it.
> On Windows, use [RapidEE] to set environment variable.

```bash
# on linux or macos console
export GOOGLE_APPLICATION_CREDENTIALS="[PATH OF account_id.json]"

# on windows powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="[PATH OF account_id.json]"
```
<br>


## console

```bash
amazontts "I want to order a stuffed crust pizza"
# out.mp3 created (yay!)

amazontts -t speech.txt -o speech.mp3
# speech.mp3 created from text in speech.txt

amazontts "Hello 911, my husband is in danger!" -vsg FEMALE
# out.mp3 created with female voice

echo "Dead man walking." | amazontts --log -vn en-US-Wavenet-B
# out.mp3 created with different male voice (log enabled)
```
> Available [TTS voices]?


### reference

```bash
amazontts [options] <text>
# text: input text

# Options:
# --help:        show this help
# -q, --quiet:   enable quiet mode
# -o, --output:  set output audio file (out.mp3)
# -t, --text:    set input text file
# -r, --retries: set speech synthesis retries (8)
# -c, --credentials: set credentials path
# -a, --acodec:      set acodec (copy)
# -sr, --service_region:    set region to send service requests to
# -se, --service_endpoint:  set endpoint to send requests to
# -ci, --credentials_id:    set AWS access key id
# -ck, --credentials_key:   set AWS secret access key
# -ae, --audio_encoding:    set audio encoding
# -as, --audio_frequency:   set audio frequency/sample rate in Hz
# -tt, --text_type:         set text type (text)
# -lc, --language_code:     set language code
# -ll, --language_lexicons: set pronounciation lexicon names
# -vn, --voice_name:        set voice name
# -vg, --voice_gender:      set voice gender
# -qb, --quote_break:        set quoted text break time (250)
# -qe, --quote_emphasis:     set quoted text emphasis level (moderate)
# -hb, --heading_break:      set heading text break time (4000)
# -hd, --heading_difference: set heading text break difference (250)
# -he, --heading_emphasis:   set heading text emphasis level (strong)
# -eb, --ellipsis_break:     set ellipsis break time (1500)
# -db, --dash_break:         set dash break time (500)
# -nb, --newline_break:      set newline break time (1000)
# -bl, --block_length:       set SSML block length (3000)
# -bs, --block_separator:    set SSML block separator (.)
## (all times are in milliseconds)

# Environment variables:
$AMAZONTTS_QUIET   # enable quiet mode (0)
$AMAZONTTS_OUTPUT  # set output audio file (out.mp3)
$AMAZONTTS_TEXT    # set input text file
$AMAZONTTS_RETRIES # set speech synthesis retries (8)
$AMAZONTTS_CREDENTIALS       # set credentials path
$AMAZONTTS_ACODEC            # set audio acodec (copy)
$AMAZONTTS_SERVICE_REGION    # set region to send service requests to
$AMAZONTTS_SERVICE_ENDPOINT  # set endpoint to send requests to
$AMAZONTTS_CREDENTIALS_ID    # set AWS access key id
$AMAZONTTS_CREDENTIALS_KEY   # set AWS secret access key
$AMAZONTTS_AUDIO_ENCODING    # set audio encoding format
$AMAZONTTS_AUDIO_FREQUENCY   # set audio frequency/sample rate in Hz
$AMAZONTTS_LANGUAGE_CODE     # set language code
$AMAZONTTS_LANGUAGE_LEXICONS # set pronounciation lexicon names
$AMAZONTTS_VOICE_NAME        # set voice name
$AMAZONTTS_VOICE_GENDER      # set voice gender (neutral)
$AMAZONTTS_QUOTE_BREAK        # set quoted text break time (250)
$AMAZONTTS_QUOTE_EMPHASIS     # set quoted text emphasis level (moderate)
$AMAZONTTS_HEADING_BREAK      # set heading text break time (4000)
$AMAZONTTS_HEADING_DIFFERENCE # set heading text break difference (250)
$AMAZONTTS_HEADING_EMPHASIS   # set heading text emphasis level (strong)
$AMAZONTTS_ELLIPSIS_BREAK     # set ellipsis break time (1500)
$AMAZONTTS_DASH_BREAK         # set dash break time (500)
$AMAZONTTS_NEWLINE_BREAK      # set newline break time (1000)
$AMAZONTTS_BLOCK_LENGTH       # set SSML block length (5000)
$AMAZONTTS_BLOCK_SEPARATOR    # set SSML block separator (.)
```
<br>


## package

```javascript
const googletts = require('extra-googletts');

await googletts('out.mp3', 'I want to order a stuffed crust pizza');
// out.mp3 created (yay!)

const fs = require('fs');
var speech = fs.readFileSync('speech.txt', 'utf8');
await googletts('speech.mp3', speech)
// speech.mp3 created from text in speech.txt

await googletts('out.mp3', 'Hello 911, my husband is in danger!', {
  voice: {ssmlGender: 'FEMALE'}
});
// out.mp3 created with female voice

await googletts('out.mp3', 'Dead man walking.', {
  voice: {name: 'en-US-Wavenet-B'}, log: true
});
// out.mp3 created with different male voice (log enabled)
```

### reference

```javascript
const googletts = require('extra-googletts');

googletts(output, text, options={})
// output:  output audio file
// text:    input text
// options: given below
// -> Promise <table of contents>

// Default options:
options = {
  stdio: [0, 1, 2], // set child process stdio
  log: false,       // enable log
  retries: 8,       // set speech synthesis retries
  credentials: {
    keyFilename: '' // path to credentials
    // see other TTS client options below
  },
  acodec: 'copy',    // set audio acodec
  audioConfig: {
    audioEncoding: null, // set audio encoding
    pitch: 0.0,          // set audio pitch
    speakingRate: 1.0    // set audio speaking rate
  },
  voice: {
    languageCode: 'en-US',   // set voice language code
    ssmlGender: 'NEUTRAL'    // set voice SSML gender
    name: 'en-US-Wavenet-D', // set voice name
  }
  quote: {
    breakTime: 250,           // set quoted text break time
    emphasisLevel: 'moderate' // set quoted text emphasis level
  },
  heading: {
    breakTime: 4000,         // set heading text break time
    breakDiff: 250,          // set heading text break difference
    emphasisLevel: 'strong', // set heading text emphasis level
  },
  ellipsis: {
    breakTime: 1500 // set ellipsis break time
  },
  dash: {
    breakTime: 500  // set dash break time
  },
  newline: {
    breakTime: 1000 // set newline break time
  },
  block: {
    length: 5000,  // set SSMLs block length
    separator: '.' // set SSMLs block separator
  }
}
```
<br>


## similar

Do you need anything similar?
- [extra-youtubeuploader] can upload videos with caption to YouTube.
- [extra-stillvideo] can generate video from audio and image.

Suggestions are welcome. Please [create an issue].
<br><br>


[![nodef](https://i.imgur.com/LPVfMny.jpg)](https://nodef.github.io)
> References: [SSML], [TTS voices], [TTS client docs].

["Amazon Polly"]: https://aws.amazon.com/polly/
["ffmpeg"]: https://ffmpeg.org
[Upload Wikipedia TTS videos on YouTube]: https://www.youtube.com/results?search_query=wikipedia+audio+article

[Node.js]: https://nodejs.org/en/download/
[console]: https://en.wikipedia.org/wiki/Shell_(computing)#Text_(CLI)_shells

[account]: https://aws.amazon.com/free/
[Amazon Web Services]: https://aws.amazon.com/
[new project]: https://console.cloud.google.com/projectcreate
[Cloud Text-to-Speech API]: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
[credentials]: https://console.cloud.google.com/apis/credentials/wizard
[RapidEE]: https://www.rapidee.com/en/about

[extra-stillvideo]: https://www.npmjs.com/package/extra-stillvideo
[extra-youtubeuploader]: https://www.npmjs.com/package/extra-youtubeuploader
[create an issue]: https://github.com/nodef/extra-googletts/issues

[SSML]: https://developers.google.com/actions/reference/ssml
[TTS voices]: https://cloud.google.com/text-to-speech/docs/voices
[TTS client docs]: https://cloud.google.com/nodejs/docs/reference/text-to-speech/0.1.x/v1beta1.TextToSpeechClient
