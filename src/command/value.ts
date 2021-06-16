import Discord from "discord.js"
import { stripIndents } from "common-tags"
import { Item } from "../structure/item"
import { noUrlErr } from "../template/error";

export default {
	name: "value",
	aliases: ["v"],
	async exec(msg: Discord.Message, args: string[]) {

		const [url, unit] = args

    if (!url)
      return noUrlErr(msg);

    if (unit)
      if (!parseInt(unit))
        return msg.channel.send("Please give valid unit");

		try {
			const item = unit ? 
        await Item.getItem(url, parseInt(unit)) :
        await Item.getItem(url);

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
    **Upvote Ratio**: \`${item.upvoteRatio}\`
    **Value**: \`${item.value} VNC\`
    **Units**: \`${item.unit}\`
    **Total value**: \`${item.unit * item.value}\`
  `

	return text
}
