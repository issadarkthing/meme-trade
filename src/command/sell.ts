import { Message } from "discord.js";
import { TraderModel } from "../structure/trader/model";
import { TransactionModel } from "../structure/transaction/model";
import { invalidSubredditErr, noProfileErr, noUrlErr } from "../template/error";
import { Item, parseUrl } from "../structure/item"
import { format } from "../utils";


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

    if (!item.isValid)
      return invalidSubredditErr(msg);

		let transactions = await trader.getTransactions()
		const hasItem = transactions.some(x => x.url === url)

		if (!hasItem) {
			msg.channel.send(`You do not own any unit for \`${url}\``)
			return
		}


		try {
			const buyTransaction = transactions.find(x => x.url === url)!;
      const itemValue = item.value;
			const profit = (itemValue - buyTransaction.value) * buyTransaction.unit;
			const profitPercent = (profit / buyTransaction.value * 100).toFixed(2);

			const transaction = new TransactionModel();
			transaction.userID = trader.userID;
			transaction.url = url;
			transaction.value = itemValue;
			transaction.score = item.score;
			transaction.age = item.age;
			transaction.operation = "SELL";
			transaction.created = new Date();
			transaction.buyTransactionID = buyTransaction.id;
			transaction.profitMargin = profit;
      transaction.unit = buyTransaction.unit;
			transaction.save()


			trader.removeItem(buyTransaction.id)

			trader.balance += itemValue * buyTransaction.unit;
			trader.save()
			msg.channel.send("Transaction completed successfully")

			const text =
				`**Sell:** \`${format(itemValue)}\` **Profit:** \`${format(profit)} (${profitPercent}%)\``
			msg.channel.send(text)
		} catch (e) {
			msg.channel.send("There was an error while processing your transaction");
      console.error(e);
		}

	}
}
