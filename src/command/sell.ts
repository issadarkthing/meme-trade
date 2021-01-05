import { Message } from "discord.js";
import { TraderModel } from "../structure/trader/model";
import { TransactionModel } from "../structure/transaction/model";
import { noProfileErr } from "../template/error";
import { getData } from "./value";


export default {
	name: "sell",
	async exec(msg: Message, args: string[]) {
		
		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader) {
			noProfileErr(msg)
			return
		}

		let [url] = args
		let data: { score: number, value: number, age: number };

		try {
			data = await getData(url)
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
			const transaction = new TransactionModel()
			transaction.userID = trader.userID
			transaction.url = url
			transaction.value = data.value
			transaction.score = data.score
			transaction.age = data.age
			transaction.operation = "SELL"
			transaction.created = new Date()
			transaction.save()

			const buyTransaction = transactions.find(x => x.url === url)!;

			trader.removeItem(buyTransaction._id)

			trader.balance += data.value
			trader.save()
			msg.channel.send("Process completed successfully")
		} catch (e) {
			msg.channel.send("There was an error while processing your transaction")
		}

	}
}
