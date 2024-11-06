# prototype-tts-vc-concat

```bash
npm install
```

# 참고 자료

## 문서

https://elevenlabs.io/docs/api-reference/text-to-speech
https://elevenlabs.io/docs/api-reference/getting-started
https://github.com/elevenlabs/elevenlabs-js?tab=readme-ov-file

## resemble ai

https://app.resemble.ai/projects/65385565-default/clips/8a377a4d-23-s-untitled-clip/edit

## text to speech

https://elevenlabs.io/app/speech-synthesis/text-to-speech

## speech to speech

https://elevenlabs.io/docs/api-reference/speech-to-speech

## add voice

https://elevenlabs.io/docs/api-reference/add-voice

## concat, ffmpeg

https://github.com/a-schild/jave2

https://www.npmjs.com/package/fluent-ffmpeg

```js
const ffmpeg = require("fluent-ffmpeg");
import ffmpeg from "fluent-ffmpeg";

ffmpeg()
  .input("audio1.mp3")
  .input("silence:duration=1")
  .input("audio2.mp3")
  .complexFilter(["[0:a][1:a][2:a]concat=n=3:v=0:a=1[out]"])
  .map("[out]")
  .save("output.mp3")
  .on("end", () => {
    console.log("오디오 처리가 완료되었습니다.");
  });
```

```java
import ws.schild.jave.*;

public class AudioProcessor {
    public void concatenateAudio() {
        try {
            MultimediaObject audio1 = new MultimediaObject(new File("audio1.mp3"));
            MultimediaObject audio2 = new MultimediaObject(new File("audio2.mp3"));

            String[] command = {
                "-i", "audio1.mp3",
                "-i", "silence:duration=1",
                "-i", "audio2.mp3",
                "-filter_complex", "[0:a][1:a][2:a]concat=n=3:v=0:a=1",
                "output.mp3"
            };

            FFmpeg ffmpeg = new FFmpeg();
            ffmpeg.run(command);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
