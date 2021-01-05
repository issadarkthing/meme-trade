import { oneLine } from "common-tags";
import { Message } from "discord.js";
import { Item } from "../structure/item";
import { TraderModel } from "../structure/trader/model";
import { TransactionModel } from "../structure/transaction/model";
import { noProfileErr } from "../template/error";


export default {
	name: "buy",
	aliases: ["b"],
	async exec(msg: Message, args: string[]) {

		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader) {
			noProfileErr(msg)
			return
		}

		let [url] = args
		let item: Item

		try {
			item = await Item.getItem(url)
		} catch {
			msg.channel.send("Invalid url")	
			return
		}

		if (trader.balance < item.value) {
			const errMessage = oneLine`Insufficient balance,
			item value is \`${item.value} vc\` you have \`${trader.balance} vc\``
			msg.channel.send(errMessage)
			return
		} 

		const transactionDate = new Date()

		try {
			const transaction = new TransactionModel()
			transaction.userID = trader.userID
			transaction.url = url
			transaction.value = item.value
			transaction.score = item.score
			transaction.age = item.age
			transaction.operation = "BUY"
			transaction.created = transactionDate
			transaction.save()

			trader.addItem(transaction._id)

			trader.balance -= item.value
			trader.save()

			msg.channel.send("Process completed successfully")
		} catch (e) {
			msg.channel.send("There was an error while processing your transaction")
			console.error(e)
		}
	}
}
