import { Message } from "discord.js";
import { TraderModel } from "../structure/trader/model";
import { TransactionModel } from "../structure/transaction/model";
import { noProfileErr } from "../template/error";
import { Item } from "../structure/item"
import { format } from "../utils";


export default {
	name: "sell",
	aliases: ["s"],
	async exec(msg: Message, args: string[]) {
		
		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader)
			return noProfileErr(msg);

		let [index] = args

    if (!index)
      return msg.channel.send("Please provide an item index");
    else if (!parseInt(index))
      return msg.channel.send("Please provide valid index");


		let transactions = await trader.getTransactions()
		const buyTransaction = transactions[parseInt(index) - 1];

		if (!buyTransaction) {
			msg.channel.send("No item found");
			return
		}


		try {
      const item = await Item.getItem(buyTransaction.url);
      const itemValue = item.value;
			const profit = (itemValue - buyTransaction.value) * buyTransaction.unit;
			const profitPercent = (profit / buyTransaction.value * 100).toFixed(2);

			const transaction = new TransactionModel();
			transaction.userID = trader.userID;
			transaction.url = item.url;
			transaction.value = itemValue;
			transaction.score = item.score;
			transaction.age = item.age;
			transaction.operation = "SELL";
			transaction.created = new Date();
			transaction.buyTransactionID = buyTransaction.id;
			transaction.profitMargin = profit;
      transaction.unit = buyTransaction.unit;
			transaction.save();

			trader.removeItem(buyTransaction.id);

			trader.balance += itemValue * buyTransaction.unit;
			trader.save();
			msg.channel.send(`Successfully sold ${item.url}`);

			const text =
				`**Sell:** \`${format(itemValue)}\` **Profit:** \`${format(profit)} (${profitPercent}%)\``
			msg.channel.send(text)
		} catch (e) {
			msg.channel.send("There was an error while processing your transaction");
      console.error(e);
		}

	}
}
