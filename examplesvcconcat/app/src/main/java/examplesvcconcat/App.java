/*
 * This source file was generated by the Gradle 'init' task
 */
package examplesvcconcat;

import java.time.Instant;
import java.util.Map;

import org.checkerframework.checker.units.qual.A;

// import examplesvcconcat.ElevenLabsClient.VoiceIds;

public class App {
    public String getGreeting() {
        return "Hello World!";
    }

    public String getResourcePath(String fileName) {
        try {
            return getClass().getClassLoader()
                    .getResource("audio/" + fileName)
                    .getPath();
        } catch (Exception e) {
            throw new RuntimeException("Could not find file: " + fileName, e);
        }
    }



    public static void main(String[] args) {
        System.out.println(new App().getGreeting());
            try {



            // sk_40dde343a836275e2ce55fc046313220e0e71ca4b24c7843
            // Load API key from environment variable
            // String apiKey = System.getenv("ELEVENLABS_API_KEY");
            // // get api key
            // ElevenLabsClient client = new ElevenLabsClient("sk_40dde343a836275e2ce55fc046313220e0e71ca4b24c7843");

            // // Example: Upload voice
            // // test12345라는 이름으로 audio1_sst.mp3, audio2_sst.mp3 파일을 업로드
            // // 저거 test12345 라벨 매번 바꿔주기
            // Map<String, Object> uploadResult = client.uploadVoice("test12345", client.getResourcePath("audio1_sst.mp3"), client.getResourcePath("audio2_sst.mp3"));
            // System.out.println(uploadResult);

            // // Example: Convert speech to speech

            
            // // 임시 voiceId
            // // 위에서 받은 voiceId로 바꿔주기
            // String voiceId =  "XHeqzSYOQhilhDgRsCHW"; //XHeqzSYOQhilhDgRsCHW, r
            // String convertedFile = client.convertSpeechToSpeech(voiceId, client.getResourcePath("rico.mp3"));
            // System.out.println("Converted file: " + convertedFile);

              
            //   AudioMerger merger = new AudioMerger();

            //   String audio1 = new App().getResourcePath("audio1_sst.mp3");
            //   String audio2 = new App().getResourcePath("audio2_sst.mp3");
            //   String output = Instant.now().toEpochMilli() + "_output124.mp3";
        
            // merger.mergeAudioWithSilence(audio1, audio2, output, 2);




            /*
             * Example: Convert mp3 to wav
             */
            AudioConverter converter = new AudioConverter();
            String inputPath = new App().getResourcePath("audio1_sst.mp3");
            String outputPath = "audio1_sst" + "_output.wav";
            converter.convertMp3ToWav(inputPath, outputPath);


            /*
             * Example: Convert wav to mp3
             */
            AudioConverter converter2 = new AudioConverter();
            String inputPath2 = new App().getResourcePath("audio1_sst.wav");
            String outputPath2 = "audio1_sst" + "_output.mp3";
            converter2.convertWavToMp3(inputPath2, outputPath2);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
