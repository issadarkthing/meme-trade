import { Message } from "discord.js";
import { validSubs } from "../main";

export function noUrlErr(msg: Message) {
  msg.channel.send("You need to provide the link to the meme");
}

export function noProfileErr(msg: Message) {
	msg.channel.send("You need to create a profile first. Use command `r!create`");
}

export function invalidSubredditErr(msg: Message) {
  const subs = validSubs.map(x => `\`${x}\``).join(", ");
  msg.channel.send(`Invalid subreddit, only these subs are allowed ${subs}.`);
}
