import { Message, MessageEmbed } from "discord.js";
import { format } from "../utils";
import { TraderModel } from "../structure/trader/model";
import { noProfileErr } from "../template/error";
import { Item } from "../structure/item";

export default {
  name: "history",
  alias: "hi",
  description: "Show transaction history",
  exec: async function(msg: Message, args: string[]) {

    const trader = await TraderModel.findByUserId(msg.author.id);

    if (!trader)
      return noProfileErr(msg);

    const transactions = await trader.getAllTransactions();

    transactions.slice(0, 3).forEach(async transaction => {
      const {
        url,
        created,
        value,
        unit,
        operation,
      } = transaction;

      const sign = operation === "BUY" ? "🔵" : "🟢";
      const item = await Item.getItem(url);
      const embed = new MessageEmbed()
        .setThumbnail(item.image)
        .addField("Total Value", `\`${format(value * unit)}\``, true)
        .addField("Value", `\`${format(value)}\``, true)
        .addField("Operation", `**${operation}** ${sign}`, true)
        .addField("Unit", `\`${unit}\``, true)
        .addField("Created At", `\`${created.toLocaleString()}\``, true)
        .addField("Link", `[[link]](${url})`);

      msg.channel.send(embed);
    });

  }
}
