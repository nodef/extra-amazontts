Generate speech audio from super long text through machine (via ["Amazon Polly"], ["ffmpeg"]).
> Do you want to:
> - Share your ideas anonymously on YouTube?
> - Pretend on phone that you are not a kid (Home Alone)?
> - Learn good english pronunciation for a speech?
> - Make your computer read out your school notes?
> - Experiment with various voices from around the globe?
> - Or, [Upload Wikipedia TTS videos on YouTube]?

Sample: ["I want to order a stuffed crust pizza"](https://clyp.it/zyuywxcb).
<br>


## setup

### install

1. Run `npm install -g extra-amazontts` in **console**.
2. To install this as a package use `npm install extra-amazontts`.
<br>


## console

```bash
amazontts "I want to order a stuffed crust pizza"
# out.mp3 created (yay!)

amazontts -t speech.txt -o speech.mp3
# speech.mp3 created from text in speech.txt

amazontts "Hello 911, my husband is in danger!" -vg female
# out.mp3 created with female voice

echo "Dead man walking." | amazontts --log -vn Matthew
# out.mp3 created with different male voice (log enabled)
```
> Available [TTS voices]?


### reference

```bash
amazontts [options] <text>
# text: input text

# Options:
# --help:        show this help
# -l, --log:     enable log
# -o, --output:  set output audio file (out.mp3)
# -t, --text:    set input text file
# -r, --retries: set speech synthesis retries (8)
# -a, --acodec:      set acodec (copy)
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
# -c*, --config_*:           set amazon config options (see Extra AWS Config options below)
## (all times are in milliseconds)

# Environment variables:
$TTS_LOG     # enable log (0)
$TTS_OUTPUT  # set output audio file (out.mp3)
$TTS_TEXT    # set input text file
$TTS_RETRIES # set speech synthesis retries (8)
$TTS_ACODEC            # set audio acodec (copy)
$TTS_AUDIO_ENCODING    # set audio encoding format
$TTS_AUDIO_FREQUENCY   # set audio frequency/sample rate in Hz
$TTS_LANGUAGE_CODE     # set language code
$TTS_LANGUAGE_LEXICONS # set pronounciation lexicon names
$TTS_VOICE_NAME        # set voice name (Joanna)
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
...                     # see Extra AWS Config options below
```
> See [Extra AWS Config] options.
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
  voice: {name: 'Matthew'}, log: true
});
// out.mp3 created with different male voice (log enabled)
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
  config: null,     // set amazon config options (see Extra AWS Config options below)
  params: null      // set Polly synthesizeSpeech params "directly"
}
```
> See [Extra AWS Config] options.
<br>


## similar

Do you need anything similar?
- [extra-youtubeuploader] can upload videos with caption to YouTube.
- [extra-stillvideo] can generate video from audio and image.

Suggestions are welcome. Please [create an issue].
<br><br>


[![nodef](https://i.imgur.com/Ui0cS8T.jpg)](https://nodef.github.io)
> References: [SSML], [TTS voices], [TTS client docs].

["Amazon Polly"]: https://aws.amazon.com/polly/
["ffmpeg"]: https://ffmpeg.org
[Upload Wikipedia TTS videos on YouTube]: https://www.youtube.com/results?search_query=wikipedia+audio+article

[Extra AWS Config]: https://www.npmjs.com/package/extra-awsconfig
[extra-stillvideo]: https://www.npmjs.com/package/extra-stillvideo
[extra-youtubeuploader]: https://www.npmjs.com/package/extra-youtubeuploader
[create an issue]: https://github.com/nodef/extra-amazontts/issues

[SSML]: https://docs.aws.amazon.com/polly/latest/dg/supported-ssml.html
[TTS voices]: https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
[TTS client docs]: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html
