import { Message, MessageEmbed } from "discord.js";
import { format } from "../utils";
import { TraderModel } from "../structure/trader/model";
import { noProfileErr } from "../template/error";
import { Item } from "../structure/item";

export default {
  name: "history",
  alias: "hi",
  args: "[count]",
  description: "Show history of all transactions",
  exec: async function(msg: Message, args: string[]) {

    const [amount = "5"] = args;

    if (!parseInt(amount))
      return msg.channel.send("Invalid amount");

    const trader = await TraderModel.findByUserId(msg.author.id);

    if (!trader)
      return noProfileErr(msg);

    const transactions = await trader.getAllTransactions(parseInt(amount));

    transactions.forEach(async transaction => {
      const {
        url,
        created,
        value,
        unit,
        operation,
      } = transaction;

      const sign = operation === "BUY" ? "🔵" : "🟢";
      const color = operation === "BUY" ? "#55acee" : "#78b159";
      const item = await Item.getItem(url);
      const embed = new MessageEmbed()
        .setThumbnail(item.image)
        .setColor(color)
        .addField("Total Value", `\`${format(value * unit)}\``, true)
        .addField("Value", `\`${format(value)}\``, true)
        .addField("Operation", `**${operation}** ${sign}`, true)
        .addField("Unit", `\`${unit}\``, true)
        .addField("Created At", `\`${created.toLocaleString()}\``, true)
        .addField("Subreddit", `\`r/${item.subreddit}\``, true)
        .addField("Link", `[[link]](${url})`, true)
        .addField("Title", item.title, true);

      msg.channel.send(embed);
    });

  }
}
