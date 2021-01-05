import { Message } from "discord.js";
import { TraderModel } from "../structure/trader/model";
import { TransactionModel } from "../structure/transaction/model";
import { noProfileErr } from "../template/error";
import { getData } from "./value";


export default {
	name: "buy",
	async exec(msg: Message, args: string[]) {

		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader) {
			noProfileErr(msg)
			return
		}

		let [url, arg2] = args
		let data: { score: number, age: number, value: number };

		try {
			data = await getData(url)
		} catch {
			msg.channel.send("Invalid url")	
			return
		}

		const unit = arg2 ? Number(arg2) : 1

		if (trader.balance < data.value * unit) {
			msg.channel.send("Insufficient balance")
			return
		} else if (Number.isNaN(unit)) {
			msg.channel.send("Invalid unit")
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
				transaction.operation = "BUY"
				transaction.created = transactionDate
				transaction.save()

				trader.addItem(transaction._id)
			}

			trader.balance -= data.value * unit
			trader.save()

			msg.channel.send("Process completed successfully")
		} catch (e) {
			msg.channel.send("There was an error while processing your transaction")
			console.error(e)
		}
	}
}
