import { Message } from "discord.js";
import { TraderModel } from "../structure/trader/model";
import { TransactionModel } from "../structure/transaction/model";
import { noProfileErr, noUrlErr } from "../template/error";
import { Item, parseUrl } from "../structure/item"


export default {
	name: "sell",
	aliases: ["s"],
	async exec(msg: Message, args: string[]) {
		
		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader)
			return noProfileErr(msg);

		let [url] = args
		let item: Item;

    if (!url)
      return noUrlErr(msg);

		url = parseUrl(url)

		try {
			item = await Item.getItem(url)
		} catch {
			msg.channel.send("Invalid url")
			return
		}

		let transactions = await trader.getTransactions()
		const hasItem = transactions.some(x => x.url === url)

		if (!hasItem) {
			msg.channel.send(`You do not own any unit for \`${url}\``)
			return
		}


		try {
			const buyTransaction = transactions.find(x => x.url === url)!;
			const profit = item.value - buyTransaction.value
			const profitPercent = (profit / buyTransaction.value * 100).toFixed(2)

			const transaction = new TransactionModel()
			transaction.userID = trader.userID
			transaction.url = url
			transaction.value = item.value
			transaction.score = item.score
			transaction.age = item.age
			transaction.operation = "SELL"
			transaction.created = new Date()
			transaction.buyTransactionID = buyTransaction._id
			transaction.profitMargin = profit
			transaction.save()


			trader.removeItem(buyTransaction._id)

			trader.balance += item.value
			trader.save()
			msg.channel.send("Transaction completed successfully")
			const text =
				`**Sell:** \`${item.value}\` **Profit:** \`${profit} (${profitPercent}%)\``
			msg.channel.send(text)
		} catch (e) {
			msg.channel.send("There was an error while processing your transaction")
		}

	}
}
