import "dotenv/config";
import * as fs from "fs";
import { ElevenLabsClient, play } from "elevenlabs";

import FormData from "form-data";
import axios from "axios";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const voiceIds = {
  adam: "NFG5qt843uXKj4pFvR7C",
  kkc: "1W00IGEmNmwmsDeYy7ag",
  test: "oRXMYBHzAMPMDRbXvZeG",
};

// 음원 등록
/**
 * 
curl --request POST \
  --url https://api.elevenlabs.io/v1/voices/add \
  --header 'Content-Type: multipart/form-data' \
  --header 'xi-api-key: sk_40dde343a836275e2ce55fc046313220e0e71ca4b24c7843' \
  --form name=test \
  --form "files=@audio1_sst.mp3" \
  --form "files=@audio1_sst.mp3" \
  --form remove_background_noise=false 
* 
*/
async function uploadVoice() {
  try {
    const form = new FormData();

    form.append("name", "test");
    form.append("remove_background_noise", "false");
    form.append("files", fs.createReadStream("audio1_sst.mp3"));
    form.append("files", fs.createReadStream("audio2_sst.mp3"));

    const config = {
      method: "post",
      url: "https://api.elevenlabs.io/v1/voices/add",
      headers: {
        "xi-api-key": "sk_40dde343a836275e2ce55fc046313220e0e71ca4b24c7843",
        ...form.getHeaders(),
      },
      data: form,
    };

    // 요청 보내기
    const response = await axios(config);
    console.log("Upload successful:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
    throw error;
  }
}
// uploadVoice();
// Upload successful: { voice_id: 'oRXMYBHzAMPMDRbXvZeG', requires_verification: false }
// label: test

// speech to speech
/**
 * 
curl --request POST \
  --url https://api.elevenlabs.io/v1/speech-to-speech/{voice_id} \
  --header 'Content-Type: multipart/form-data'
* 
*/
async function convertTextToSpeechByFetch() {
  try {
    const form = new FormData();
    form.append("audio", fs.createReadStream("rico.mp3"));
    form.append("model_id", "eleven_english_sts_v2");
    form.append("remove_background_noise", "false");

    const config = {
      method: "post",
      url: `https://api.elevenlabs.io/v1/speech-to-speech/${voiceIds.test}`,
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        ...form.getHeaders(),
      },
      param: {
        optimize_streaming_latency: "0",
      },
      responseType: "arraybuffer",
      data: form,
    };

    const response = await axios(config);

    const fileName = `${new Date().getTime()}.mp3`;
    fs.writeFileSync(fileName, response.data);
    console.log("변환 완료:", fileName);
    return fileName;
  } catch (error) {
    console.error("변환 실패:", error.response?.data || error.message);
    throw error;
  }
}

convertTextToSpeechByFetch();

// TTS
async function runTTS() {
  const audio = await client.generate({
    voice: "KKC",
    text: "Hello! 你好! Hola! नमस्ते! Bonjour! こんにちは! مرحبا! 안녕하세요! Ciao! Cześć! Привіт! வணக்கம்!",
    model_id: "eleven_multilingual_v2",
  });

  await play(audio);
}
// runTTS();

// async function convertSpeechToSpeech() {
//   try {
//     if (!fs.existsSync("rico.mp3")) {
//       console.log("파일이 없습니다.");
//     }

//     const audio = await client.speechToSpeech.convert(voiceIds.adam, {
//       audio: fs.createReadStream("rico.mp3"),
//       model_id: "eleven_english_sts_v2",
//       optimize_streaming_latency: "0",
//       output_format: "mp3_22050_32",
//     });

//     console.log("응답:", audio);
//     const fileName = `${new Date().getTime()}.mp3`;
//     const fileStream = fs.createWriteStream(fileName);

//     audio.pipe(fileStream);
//     fileStream.on("finish", () => {
//       console.log("완료");
//     });
//     fileStream.on("error", (err) => {
//       console.error("파일 변환중 에러 발생:", err);
//     });
//     return audio;
//   } catch (error) {
//     console.error("에러 발생:", error);
//     throw error;
//   }
// }
// convertSpeechToSpeech();
