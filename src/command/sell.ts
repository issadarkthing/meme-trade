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

		let [url, arg2] = args
		let data: { score: number, value: number, age: number };

		try {
			data = await getData(url)
		} catch {
			msg.channel.send("Invalid url")
			return
		}

		const unit = arg2 ? Number(arg2) : 1

		if (Number.isNaN(unit)) {
			msg.channel.send("Invalid unit")
			return
		} 

		const itemsOwned = trader.countItem(url)

		if (itemsOwned === 0) {
			msg.channel.send(`You do not own any unit for \`${url}\``)
			return
		}

		const transactionDate = new Date()

		try {
			for (let i = 0; i < unit; i++) {
				const transaction = new TransactionModel()
				transaction.userID = trader.userID
				transaction.url = url
				transaction.value = data.value
				transaction.score = data.score
				transaction.age = data.age
				transaction.operation = "SELL"
				transaction.created = transactionDate
				transaction.save()
			}

			trader.balance += data.value * unit
			trader.removeItem(url, unit)
			trader.save()
			msg.channel.send("Process completed successfully")
		} catch (e) {
			msg.channel.send("There was an error while processing your transaction")
		}

	}
}
