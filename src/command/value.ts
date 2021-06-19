import Discord, { MessageEmbed } from "discord.js"
import { Item } from "../structure/item"
import { noUrlErr } from "../template/error";
import { format } from "../utils";

export default {
	name: "value",
	aliases: ["v"],
	async exec(msg: Discord.Message, args: string[]) {

		const [url, unit = "1"] = args

    if (!url)
      return noUrlErr(msg);

    if (!parseInt(unit) && unit !== "max")
      return msg.channel.send("Please give valid unit");

		try {

			const item = await Item.getItem(url, parseInt(unit) || 1);

      if (unit === "max")
        item.unit = item.getMaxUnit();

			const text = displayMemeValue(item)
			msg.channel.send(text)
		} catch {
			msg.channel.send("Invalid url")
		}
	}
}

function displayMemeValue(item: Item) {

  const value = format(item.value);
  const totalValue = format(item.value * item.unit);

  const embed = new MessageEmbed()
    .addField("Score", `\`${item.score}\``, true)
    .addField("Age", `\`${item.age} seconds\``, true)
    .addField("Upvote ratio", `\`${item.upvoteRatio}\``, true)
    .addField("Value", `\`${value} VNC\``, true)
    .addField("Units", `\`${item.unit}\``, true)
    .addField("Max units", `\`${item.getMaxUnit()}\``, true)
    .addField("Total value", `\`${totalValue} VNC\``)
    .addField("Indicator", `
      \`score\` Item score value
      \`age\` Time elapsed in seconds since created
      \`value\` Meme value per unit \`score / age * upvoteRatio\`
      \`units\` Item multiplier
      \`max units\` Market cap for an item is \`100k\`, so \`market cap = item value x units\`
      \`total value\` Item value times unit
    `);

	return embed
}
