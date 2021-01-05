import { stripIndents } from "common-tags";
import { Message, MessageEmbed } from "discord.js";
import { Item } from "../structure/item";
import { TraderModel } from "../structure/trader/model";
import { noProfileErr } from "../template/error";

export default {
	name: "profile",
	async exec(msg: Message, _: string[]) {
		
		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader) {
			noProfileErr(msg)
			return
		}

		const embed = new MessageEmbed()
		.addField("Name", trader.username)
		.addField("Balance", trader.balance + " vc")

		let items = ""

		const transactions = await trader.getTransactions()
		for (let i = 0; i < transactions.length; i++) {
			const transaction = transactions[i]
			const oldValue = transaction.value
			const item = await Item.getItem(transaction.url)
			const newValue = item.value
			const delta = newValue - oldValue
			const deltaPercentage = (delta / oldValue * 100).toFixed(2)
			const emoji = delta >= 0 ? "📈" : "📉"
			const text = `\n[${i + 1}](${item.url}). \`${deltaPercentage}%\` ${emoji}`
			items += text
		}

		embed.addField("Items", items)

		msg.channel.send(embed)
	}
}
