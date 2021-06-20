import { oneLine } from "common-tags";
import { Message, MessageEmbed } from "discord.js";
import { Item } from "../structure/item";
import { TraderModel } from "../structure/trader/model";
import { noProfileErr } from "../template/error";
import { coinEmoji, format, orange } from "../utils";

export default {
	name: "profile",
	alias: "p",
  description: "Show user profile with all currently holding memes",
	async exec(msg: Message, _: string[]) {
		
		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader)
      return noProfileErr(msg);

		const embed = new MessageEmbed()
      .setColor(orange)
		  .addField("Name", trader.username)
		  .addField("Balance", `\`${format(trader.balance)}\` ${coinEmoji}`);

		let items = "";

		const transactions = await trader.getTransactions()
		for (let i = 0; i < transactions.length; i++) {
			const transaction = transactions[i]
			const oldValue = transaction.value * transaction.unit;
			const item = await Item.getItem(transaction.url, transaction.unit);
			const newValue = item.getValue();
			const delta = newValue - oldValue;
			const deltaPercentage = (delta / oldValue * 100).toFixed(2)
			const emoji = delta >= 0 ? "📈" : "📉"
			const text = oneLine`
        ${i + 1}. 
        \`${format(newValue)}\` 
        \`${format(delta)}\` 
        \`x${item.unit}\` 
        ${emoji} 
        \`${deltaPercentage}%\` 
        [[link]](${item.url})`;

			items += "\n" + text;
		}

		if (items.length > 0) {
			embed.addField("Items", items)
      embed.addField("Indicator", `
      \`total price\` Current value of item times unit
      \`net profit\` (new value - old value) times unit
      \`unit\` Total unit bought
      \`trend\` Indicates current price trend relative to original value
      \`profit percentage\` Show profit in form of percentage
      `);
		}

		msg.channel.send(embed)
	}
}
