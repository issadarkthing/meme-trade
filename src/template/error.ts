import { Message } from "discord.js";

export function noUrlErr(msg: Message) {
  msg.channel.send("You need to provide the link to the meme");
}

export function noProfileErr(msg: Message) {
	msg.channel.send("You need to create a profile first")
}
