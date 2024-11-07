package examplesvcconcat;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.time.Instant;
import okhttp3.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ElevenLabsClient {
    private static final String BASE_URL = "https://api.elevenlabs.io/v1";
    private final String apiKey;
    private final OkHttpClient client;
    private final ObjectMapper objectMapper;

    public String getResourcePath(String fileName) {
        try {
            return getClass().getClassLoader()
                    .getResource("audio/" + fileName)
                    .getPath();
        } catch (Exception e) {
            throw new RuntimeException("Could not find file: " + fileName, e);
        }
    }

    public static class VoiceIds {
        public static final String ADAM = "NFG5qt843uXKj4pFvR7C";
        public static final String KKC = "1W00IGEmNmwmsDeYy7ag";
        public static final String TEST = "oRXMYBHzAMPMDRbXvZeG";
    }

    public ElevenLabsClient(String apiKey) {
        this.apiKey = apiKey;
        this.client = new OkHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, Object> uploadVoice(String name, String... audioFilePaths) throws IOException {
        MultipartBody.Builder builder = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("name", name)
                .addFormDataPart("remove_background_noise", "false");

        // Add audio files
        for (String audioPath : audioFilePaths) {
            File audioFile = new File(audioPath);
            builder.addFormDataPart("files", audioFile.getName(),
                    RequestBody.create(audioFile, MediaType.parse("audio/mpeg")));
        }

        Request request = new Request.Builder()
                .url(BASE_URL + "/voices/add")
                .addHeader("xi-api-key", apiKey)
                .post(builder.build())
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Upload failed: " + response.body().string());
            }

            String responseBody = response.body().string();
      
            Map<String, Object> result = objectMapper.readValue(responseBody, new TypeReference<Map<String, Object>>() {});
            System.out.println("Upload successful: " + result);
            return result;
        }
    }

    public String convertSpeechToSpeech(String voiceId, String audioFilePath) throws IOException {
        // Create multipart request
        MultipartBody.Builder builder = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("model_id", "eleven_english_sts_v2")
                .addFormDataPart("remove_background_noise", "false");

        // Add audio file
        File audioFile = new File(audioFilePath);
        builder.addFormDataPart("audio", audioFile.getName(),
                RequestBody.create(audioFile, MediaType.parse("audio/mpeg")));

        // Build request
        Request request = new Request.Builder()
                .url(BASE_URL + "/speech-to-speech/" + voiceId + "?optimize_streaming_latency=0")
                .addHeader("xi-api-key", apiKey)
                .post(builder.build())
                .build();

        // Execute request
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Conversion failed: " + response.body().string());
            }

            // Save response to file
            String fileName = Instant.now().toEpochMilli() + ".mp3";
            byte[] responseData = response.body().bytes();
            Files.write(Paths.get(fileName), responseData);
            
            System.out.println("변환 완료: " + fileName);
            return fileName;
        }
    }
}
