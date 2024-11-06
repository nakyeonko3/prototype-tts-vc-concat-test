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
