import "dotenv/config";
import * as fs from "fs";
import { ElevenLabsClient, play } from "elevenlabs";

import { pipeline } from "stream/promises";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

/**
 * voiceID
 * adam stone: NFG5qt843uXKj4pFvR7C
 * KKC:1W00IGEmNmwmsDeYy7ag
 */

const voiceIds = {
  adam: "NFG5qt843uXKj4pFvR7C",
  kkc: "1W00IGEmNmwmsDeYy7ag",
};

// TTS 완료후 재생
async function runTTS() {
  const audio = await client.generate({
    voice: "KKC",
    text: "Hello! 你好! Hola! नमस्ते! Bonjour! こんにちは! مرحبا! 안녕하세요! Ciao! Cześć! Привіт! வணக்கம்!",
    model_id: "eleven_multilingual_v2",
  });

  await play(audio);
}

// STT 실행
async function convertSpeechToSpeech() {
  try {
    // 음성 설정
    const voiceSettings = {
      stability: 0.5,
      similarity_boost: 0.8,
      style: 0.0,
      use_speaker_boost: true,
    };

    /*

  {
  stability: 0.5,
  similarity_boost: 0.8,
  style: 0.0,
  use_speaker_boost: true,  
  }
    */

    if (!fs.existsSync("rico.mp3")) {
      console.log("파일이 없습니다.");
    }

    // API 호출
    const response = await client.speechToSpeech.convert(voiceIds.adam, {
      audio: fs.createReadStream("rico.mp3"), // 입력 오디오 파일 경로
      model_id: "eleven_english_sts_v2",
      optimize_streaming_latency: "0",
      output_format: "mp3_22050_32",
    });

    console.log("응답:", response);

    // 결과 저장
    await pipeline(response, fs.createWriteStream("output.mp3"));

    // fs.writeFileSync("./output.mp3", response);
    console.log("변환이 완료되었습니다!");
  } catch (error) {
    console.error("에러 발생:", error);
  }
}

convertSpeechToSpeech();
