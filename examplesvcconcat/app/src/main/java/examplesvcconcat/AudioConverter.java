
package examplesvcconcat;

import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.builder.FFmpegBuilder;

import java.io.IOException;

public class AudioConverter {
    private final String ffmpegPath = "ffmpeg";
    private final FFmpeg ffmpeg;
    private final FFmpegExecutor executor;

    public AudioConverter() throws IOException {
        this.ffmpeg = new FFmpeg(ffmpegPath);
        this.executor = new FFmpegExecutor(ffmpeg);
    }

    /**
     * MP3 파일을 WAV 형식으로 변환합니다.
     * @param inputPath MP3 파일 경로
     * @param outputPath 출력될 WAV 파일 경로
     * @return 변환 성공 여부
     */
    public boolean convertMp3ToWav(String inputPath, String outputPath) {
        try {
            FFmpegBuilder builder = new FFmpegBuilder()
                .setInput(inputPath)
                .overrideOutputFiles(true)
                .addOutput(outputPath)
                    .setAudioCodec("pcm_s16le")  // WAV 코덱
                    .setAudioChannels(2)
                    .setAudioSampleRate(44100)
                    .setAudioBitRate(1411200)    // CD quality
                    .done();

            executor.createJob(builder).run();
            System.out.println("MP3에서 WAV로 변환이 완료되었습니다!");
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * WAV 파일을 MP3 형식으로 변환합니다.
     * @param inputPath WAV 파일 경로
     * @param outputPath 출력될 MP3 파일 경로
     * @return 변환 성공 여부
     */
    public boolean convertWavToMp3(String inputPath, String outputPath) {
        try {
            FFmpegBuilder builder = new FFmpegBuilder()
                .setInput(inputPath)
                .overrideOutputFiles(true)
                .addOutput(outputPath)
                    .setAudioCodec("libmp3lame")  // MP3 코덱
                    .setAudioChannels(2)
                    .setAudioBitRate(192000)      // 192kbps
                    .setAudioSampleRate(44100)
                    .done();

            executor.createJob(builder).run();
            System.out.println("WAV에서 MP3로 변환이 완료되었습니다!");
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
