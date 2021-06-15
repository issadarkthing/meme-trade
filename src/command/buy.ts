import { oneLine } from "common-tags";
import { Message } from "discord.js";
import { Item, parseUrl } from "../structure/item";
import { TraderModel } from "../structure/trader/model";
import { TransactionModel } from "../structure/transaction/model";
import { invalidSubredditErr, noProfileErr, noUrlErr } from "../template/error";


export default {
	name: "buy",
	aliases: ["b"],
	async exec(msg: Message, args: string[]) {

		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader) 
      return noProfileErr(msg);

		let [url] = args
		let item: Item

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

		if (trader.balance < item.value) {
			const errMessage = oneLine`Insufficient balance,
			item value is \`${item.value} VNC\` you have \`${trader.balance} VNC\``
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

			msg.channel.send("Transaction completed successfully")
			const text =
				`**Buy:** \`${item.value}\` **Balance:** \`${trader.balance}\``
			msg.channel.send(text)
		} catch (e) {
			msg.channel.send("There was an error while processing your transaction")
			console.error(e)
		}
	}
}
