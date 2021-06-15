import { Message } from "discord.js";

export function noUrlErr(msg: Message) {
  msg.channel.send("You need to provide meme url");
}

export function noProfileErr(msg: Message) {
	msg.channel.send("You need to create a profile first")
}
