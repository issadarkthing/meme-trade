import url from "url"
import fetch from "node-fetch"
import Discord from "discord.js"
import { stripIndents } from "common-tags"

export default {
	name: "value",
	async exec(msg: Discord.Message, args: string[]) {

		const [postUrl] = args

		try {
			const { score, age, value } = await getData(postUrl)
			const text = displayMemeValue(score, age, value)
			msg.channel.send(text)
		} catch {
			msg.channel.send("Invalid url")
		}
	}
}

function displayMemeValue(score: number, age: number, value: number) {

	const text = stripIndents`
		**Score**: \`${score} upvotes\` 
		**Age**: \`${age} seconds\`
		**Value**: \`${value} vc\``

	return text
}



function getTimeSecond() {
	return Math.floor(new Date().getTime() / 1000)
}


export async function getData(url: string) {

	const targetUrl = "https://reddit.com" + parseUrl(url)

	const options = {
		headers: {
			'User-Agent': 'sample',
		}
	}
	const res = await fetch(targetUrl + ".json", options)
	const jsonContent = await res.json()

	const post = jsonContent[0].data.children[0].data
	const score: number = post.score
	const age = getTimeSecond() - post.created_utc
	const value = score / age
	return { score, age, value }
}

// get rid of query paramater and leading slash
function parseUrl(targetUrl: string) {
	const pathName = url.parse(targetUrl).pathname
	if (!pathName) {
		throw new Error("invalid url")
	}
	
	// strips leading slash
	return pathName.replace(/\/$/, "")
}
