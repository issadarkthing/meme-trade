import Discord from "discord.js"
import { stripIndents } from "common-tags"
import { Item } from "../structure/item"
import { noUrlErr } from "../template/error";

export default {
	name: "value",
	aliases: ["v"],
	async exec(msg: Discord.Message, args: string[]) {

		const [url] = args

    if (!url)
      return noUrlErr(msg);

		try {
			const item = await Item.getItem(url)
			const text = displayMemeValue(item)
			msg.channel.send(text)
		} catch {
			msg.channel.send("Invalid url")
		}
	}
}

function displayMemeValue(item: Item) {

	const text = stripIndents`
		**Score**: \`${item.score} upvotes\` 
		**Age**: \`${item.age} seconds\`
		**Value**: \`${item.value} VNC\``

	return text
}
