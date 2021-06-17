import Discord from "discord.js"
import path from "path"
import mongoose from "mongoose"
import { walk } from "./utils"

interface Command {
	name: string;
	aliases?: string[];
	exec: (msg: Discord.Message, args: string[]) => void;
}

const uri = process.env.MONGODB_TOKEN

if (!uri) {
	throw new Error("no mongodb uri found")
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useFindAndModify", false);

const bot = new Discord.Client()
const commands = new Discord.Collection<string, Command>();
export const validSubs = [
  "dankmemes",
  "memes",
];

// max number of item can be hold at one time
export const MAX_ITEM = 3;

walk(path.resolve(__dirname, "command"), (err, res) => {

	if (err || !res) {
		console.error(err)
		return
	}
	
	const command = require(res)
	commands.set(command.default.name, command.default)	
})

bot.on("ready", () => {
	console.log(bot.user?.username + " is ready")
	bot.user?.setActivity("memes", { type: "WATCHING" })
})

bot.on("message", msg => {
	const [prefix, ...args] = msg.content.split(" ").map(x => x.trim())

	if (!prefix.startsWith("r!") || msg.author.bot) {
		return
	}

	const commandName = prefix.replace(/^r!/, "")
	const command = 
		commands.find(x => x.aliases?.includes(commandName) || false) 
		|| commands.get(commandName)

	if (!command) {
		msg.channel.send("invalid command")
		return
	}

	command.exec(msg, args)
})


bot.login(process.env.BOT_TOKEN)
