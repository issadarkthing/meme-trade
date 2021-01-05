import { Item } from "../item";
import { ITransactionDocument } from "./types";


// Updates transaction document
export async function buy(this: ITransactionDocument, url: string, traderID: string) {
	
	const item = await Item.getItem(url)
	this.value = item.value
	this.score = item.score
	this.age = item.age
	this.userID = traderID
	this.operation = "BUY"
	this.created = new Date()
}
