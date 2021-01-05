import { Message } from "discord.js"
import { TraderModel } from "../structure/trader/model"

export default {
	name: "create",
	async exec(msg: Message, _: string[]) {

		const user = msg.author;

		if (await TraderModel.findByUserId(user.id)) {
			msg.channel.send("You already have a profile");
			return
		}
	
		try {
			const trader = new TraderModel()
			trader.username = user.username
			trader.userID = user.id
			trader.save()
			msg.channel.send("Your profile has been created")
		} catch (e) {
			msg.channel.send("there was an error when creating your profile")
			console.error(e)
		}
	}
}
