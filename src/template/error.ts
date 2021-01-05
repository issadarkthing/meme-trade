import { Message } from "discord.js";



export function noProfileErr(msg: Message) {
	msg.channel.send("You need to create a profile first")
}
