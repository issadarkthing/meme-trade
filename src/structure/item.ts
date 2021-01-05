import fetch from "node-fetch"
import url from "url"

interface Data {
	value: number;
	score: number;
	age: number;
	url: string;
}

export class Item {
	value: number;
	score: number;
	age: number;
	url: string;
	constructor(data: Data) {
		this.value = data.value
		this.score = data.score
		this.age = data.age
		this.url = data.url
	}

	async getDelta(): Promise<number> {
		const updatedItem = await Item.getItem(this.url)
		return updatedItem.value - this.value
	}

	async getDeltaPercentage(): Promise<number> {
		const delta = await this.getDelta()
		return delta / this.value * 100
	}

	static async getItem(url: string) {

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
		return new Item({ score, age, value, url })
	}

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

function getTimeSecond() {
	return Math.floor(new Date().getTime() / 1000)
}


