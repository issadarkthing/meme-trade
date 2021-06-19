import { Message } from "discord.js";
import { TraderModel } from "../structure/trader/model";
import { TransactionModel } from "../structure/transaction/model";
import { noProfileErr } from "../template/error";
import { Item } from "../structure/item"
import { format } from "../utils";
import { ITransactionDocument } from "../structure/transaction/types";
import { ITraderDocument } from "../structure/trader/types";
import { oneLine, stripIndent } from "common-tags";


export default {
	name: "sell",
	alias: "s",
  args: "<index | all>",
  description: stripIndent`
    Sell meme from reddit with it's current value. 
    To sell 2nd meme in out items, use \`r!sell 2\`
    To sell all memes, use \`r!sell all\`
  `,
	async exec(msg: Message, args: string[]) {
		
		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader)
			return noProfileErr(msg);

		let [index] = args

    if (!index)
      return msg.channel.send("Please provide an item index");
    else if (!parseInt(index) && index !== "all")
      return msg.channel.send("Please provide valid index");


		let transactions = await trader.getTransactions()
		const buyTransaction = transactions[parseInt(index) - 1];

    if (index === "all") {

      for (const transaction of transactions) {
        await sellItem(msg, transaction, trader);
      }

    } else if (!buyTransaction) {
			msg.channel.send("No item found");

    } else {
      await sellItem(msg, buyTransaction, trader);

    }


	}
}

async function sellItem(
  msg: Message, 
  buyTransaction: ITransactionDocument, 
  trader: ITraderDocument,
) {

  try {
    const item = await Item.getItem(buyTransaction.url);
    const itemValue = item.value;
    const profit = (itemValue - buyTransaction.value) * buyTransaction.unit;
    const oldValue = buyTransaction.value * buyTransaction.unit;
    const profitPercent = (profit / oldValue * 100).toFixed(2);

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
    await trader.save();
    msg.channel.send(`Successfully sold ${item.url}`);

    const totalValue = format(itemValue * buyTransaction.unit);

    const text = oneLine`
      **Sell:** \`${totalValue}\` 
      **Profit:** \`${format(profit)} (${profitPercent}%)\``;

    msg.channel.send(text);
  } catch (e) {
    msg.channel.send("There was an error while processing your transaction");
    console.error(e);
  }
}
