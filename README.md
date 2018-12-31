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
# -a, --acodec:      set acodec (copy)
# -sr, --service_region:    set region to send service requests to (us-east-1)
# -se, --service_endpoint:  set endpoint to send requests to
# -ci, --credentials_id:    set AWS access key id
# -ck, --credentials_key:   set AWS secret access key
# -cp, --credentials_path:  set AWS config path (~/.aws/config)
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
$TTS_QUIET   # enable quiet mode (0)
$TTS_OUTPUT  # set output audio file (out.mp3)
$TTS_TEXT    # set input text file
$TTS_RETRIES # set speech synthesis retries (8)
$TTS_ACODEC            # set audio acodec (copy)
$TTS_SERVICE_REGION    # set region to send service requests to (us-east-1)
$TTS_SERVICE_ENDPOINT  # set endpoint to send requests to
$TTS_CREDENTIALS_ID    # set AWS access key id
$TTS_CREDENTIALS_KEY   # set AWS secret access key
$AWS_CONFIG_FILE       # set AWS config path
$TTS_CREDENTIALS_PATH  # set AWS config path (~/.aws/config)
$TTS_AUDIO_ENCODING    # set audio encoding format
$TTS_AUDIO_FREQUENCY   # set audio frequency/sample rate in Hz
$TTS_LANGUAGE_CODE     # set language code
$TTS_LANGUAGE_LEXICONS # set pronounciation lexicon names
$TTS_VOICE_NAME        # set voice name
$TTS_VOICE_GENDER      # set voice gender (neutral)
$TTS_QUOTE_BREAK        # set quoted text break time (250)
$TTS_QUOTE_EMPHASIS     # set quoted text emphasis level (moderate)
$TTS_HEADING_BREAK      # set heading text break time (4000)
$TTS_HEADING_DIFFERENCE # set heading text break difference (250)
$TTS_HEADING_EMPHASIS   # set heading text emphasis level (strong)
$TTS_ELLIPSIS_BREAK     # set ellipsis break time (1500)
$TTS_DASH_BREAK         # set dash break time (500)
$TTS_NEWLINE_BREAK      # set newline break time (1000)
$TTS_BLOCK_LENGTH       # set SSML block length (5000)
$TTS_BLOCK_SEPARATOR    # set SSML block separator (.)
```
<br>


## package

```javascript
const amazontts = require('extra-amazontts');

await amazontts('out.mp3', 'I want to order a stuffed crust pizza');
// out.mp3 created (yay!)

const fs = require('fs');
var speech = fs.readFileSync('speech.txt', 'utf8');
await amazontts('speech.mp3', speech)
// speech.mp3 created from text in speech.txt

await amazontts('out.mp3', 'Hello 911, my husband is in danger!', {
  voice: {gender: 'female'}
});
// out.mp3 created with female voice

await amazontts('out.mp3', 'Dead man walking.', {
  voice: {name: 'Matthew'}, quiet: true
});
// out.mp3 created with different male voice (quiet mode)
```

### reference

```javascript
const amazontts = require('extra-amazontts');

amazontts(output, text, options={})
// output:  output audio file
// text:    input text
// options: given below
// -> Promise <table of contents>

// Default options:
options = {
  stdio: [0, 1, 2], // set child process stdio
  quiet: false,     // enable quiet mode
  retries: 8,       // set speech synthesis retries
  acodec: 'copy',   // set audio acodec
  service: {
    region: 'us-east-1', // set region to send service requests to
    endpoint: ''         // set endpoint to send requests to
  },
  credentials: {
    id: '',   // set AWS access key id
    key: '',  // set AWS secret access key
    path: ''  // set credentials path
  }, 
  audio: {
    encoding: '',  // set audio encoding format
    frequency: 0,  // set audio frequency/sample rate in Hz
  },
  language: {
    code: '',      // set language code
    lexicons: [],  // set pronounciation lexicon names
  },
  voice: {
    name: '',         // set voice name
    gender: 'neutral' // set voice gender
  },
  quote: {
    break: 250,          // set quoted text break time
    emphasis: 'moderate' // set quoted text emphasis level
  },
  heading: {
    break: 4000,        // set heading text break time
    difference: 250,    // set heading text break difference
    emphasis: 'strong', // set heading text emphasis level
  },
  ellipsis: {
    break: 1500         // set ellipsis break time
  },
  dash: {
    break: 500          // set dash break time
  },
  newline: {
    break: 1000         // set newline break time
  },
  block: {
    length: 5000,       // set SSML block length
    separator: '.'      // set SSML block separator
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
