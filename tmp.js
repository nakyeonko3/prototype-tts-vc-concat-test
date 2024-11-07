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
