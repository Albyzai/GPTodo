// @ts-nocheck: difficult typing
import Module from "$core/Module.ts";
import Client from "./Client.ts";
import ChatHttp from "./http/Chat.ts";
import TranscribeHttp from "./http/Transcribe.ts";
import TextToSpeechHttp from "./http/TextToSpeech.ts";

export default new Module()
  .register(Client)
  .register(ChatHttp)
  .register(TranscribeHttp)
  .register(TextToSpeechHttp);
