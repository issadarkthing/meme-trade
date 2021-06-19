import { oneLine } from "common-tags";
import { Message } from "discord.js";
import { format } from "../utils";
import { Item, parseUrl } from "../structure/item";
import { TraderModel } from "../structure/trader/model";
import { TransactionModel } from "../structure/transaction/model";
import { invalidSubredditErr, noProfileErr, noUrlErr } from "../template/error";
import { MAX_ITEM } from "../main";


export default {
	name: "buy",
	aliases: ["b"],
	async exec(msg: Message, args: string[]) {

		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader) 
      return noProfileErr(msg);

		let [url, unit = "1"] = args;
		let item: Item

    if (!url)
      return noUrlErr(msg);

		url = parseUrl(url)

    if (!parseInt(unit) && unit !== "max")
      return msg.channel.send("Please give valid unit");

		try {

			item = await Item.getItem(url, parseInt(unit) || 1);

      if (unit === "max")
        item.unit = item.getMaxUnit();

		} catch {
			msg.channel.send("Invalid url")	
			return
		}

    if (!item.isValid)
      return invalidSubredditErr(msg);

    const itemValue = item.getValue();
    const traderBalance = trader.balance;
    const maxUnit = item.getMaxUnit();

    if (parseInt(unit) > maxUnit)
      return msg.channel.send(`Max unit can be bought for this item is \`${maxUnit}\``);

		if (traderBalance < itemValue) {

			const errMessage = oneLine`Insufficient balance,
			item value is \`${format(itemValue)} VNC\` you have \`${format(traderBalance)} VNC\``
			return msg.channel.send(errMessage);

		} 

    const transactions = await trader.getTransactions();

    if (transactions.length >= MAX_ITEM) {
      return msg.channel.send(`You can only hold maximum ${MAX_ITEM} items`);
    }

		const transactionDate = new Date()

		try {
			const transaction = new TransactionModel()
			transaction.userID = trader.userID;
			transaction.url = url;
			transaction.value = item.value;
			transaction.score = item.score;
			transaction.age = item.age;
			transaction.operation = "BUY";
			transaction.created = transactionDate;
      transaction.unit = item.unit;
			transaction.save();

			trader.addItem(transaction.id);

			trader.balance -= item.getValue();
			trader.save();

			msg.channel.send("Transaction completed successfully");

      const itemValue = format(item.getValue());
      const balance = format(trader.balance);
			const text = `**Buy:** \`${itemValue}\` **Balance:** \`${balance}\``
			msg.channel.send(text)

		} catch (e) {
			msg.channel.send("There was an error while processing your transaction")
			console.error(e)
		}
	}
}
