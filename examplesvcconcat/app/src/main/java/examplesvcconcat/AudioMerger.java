package examplesvcconcat;

import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.builder.FFmpegBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.concurrent.TimeUnit;

public class AudioMerger {
    private final String ffmpegPath = "ffmpeg";

    public boolean mergeAudioWithSilence(String audio1Path, String audio2Path, String outputPath, int silenceDurationSec) {
        try {
            // 임시 무음 파일 경로
            String silenceFilePath = "temp_silence.wav";
            FFmpeg ffmpeg = new FFmpeg(ffmpegPath);
            
            // 무음 파일 생성
            FFmpegBuilder silenceBuilder = new FFmpegBuilder()
                .setInput("anullsrc")
                .addExtraArgs("-f", "lavfi")
                .overrideOutputFiles(true)
                .addOutput(silenceFilePath)
                    .setAudioCodec("pcm_s16le")
                    .setAudioBitRate(192000)
                    .setAudioChannels(2)
                    .setAudioSampleRate(44100)
                    .setDuration(silenceDurationSec, TimeUnit.SECONDS)
                    .done();

            FFmpegExecutor executor = new FFmpegExecutor(ffmpeg);
            executor.createJob(silenceBuilder).run();

            // 오디오 파일 병합
            FFmpegBuilder mergeBuilder = new FFmpegBuilder()
                .setInput(audio1Path)
                .addInput(silenceFilePath)
                .addInput(audio2Path)
                .overrideOutputFiles(true)
                .addOutput(outputPath)
                    .setAudioCodec("libmp3lame")  // MP3 코덱 사용
                    .setAudioChannels(2)
                    .setAudioBitRate(192000)
                    .addExtraArgs("-filter_complex", "[0:a][1:a][2:a]concat=n=3:v=0:a=1")  // concat 필터 추가
                    .done();

            executor.createJob(mergeBuilder).run();

            // 임시 파일 삭제
            Files.deleteIfExists(new File(silenceFilePath).toPath());

            System.out.println("오디오 병합이 완료되었습니다!");
            return true;

        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
