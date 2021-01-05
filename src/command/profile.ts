import { stripIndents } from "common-tags";
import { Message } from "discord.js";
import { TraderModel } from "../structure/trader/model";
import { noProfileErr } from "../template/error";

export default {
	name: "profile",
	async exec(msg: Message, _: string[]) {
		
		const user = msg.author
		const trader = await TraderModel.findByUserId(user.id)

		if (!trader) {
			noProfileErr(msg)
			return
		}

		const profileText = stripIndents`
		Name: \`${trader.username}\`
		Balance: \`${trader.balance} vc\`
		`

		msg.channel.send(profileText)
	}
}
