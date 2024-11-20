import "dotenv/config";
import * as fs from "fs";
import { ElevenLabsClient, play } from "elevenlabs";

import FormData from "form-data";
import axios from "axios";

import ffmpeg from "fluent-ffmpeg";

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
