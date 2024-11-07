import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";

async function mergeAudioWithSilence(
  audio1Path,
  audio2Path,
  outputPath,
  silenceDurationSec = 2
) {
  try {
    // 임시 무음 파일 생성
    const silenceFilePath = "temp_silence.wav";

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input("anullsrc")
        .inputFormat("lavfi")
        .duration(silenceDurationSec)
        .audioCodec("pcm_s16le")
        .audioBitrate("192k")
        .audioChannels(2)
        .audioFrequency(44100)
        .output(silenceFilePath)
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(audio1Path)
        .input(silenceFilePath)
        .input(audio2Path)
        .complexFilter(["[0:a][1:a][2:a]concat=n=3:v=0:a=1[out]"], ["out"])
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath);
    });

    await fs.unlink(silenceFilePath);

    console.log("오디오 병합이 완료!");
    return true;
  } catch (error) {
    console.error("오디오 병합 중 에러 발생:", error);
    return false;
  }
}

const audio1 = "./audio1_sst.mp3";
const audio2 = "./rico.mp3";
const output = `${new Date().getTime()}_output.mp3`;

await mergeAudioWithSilence(audio1, audio2, output, 2);
