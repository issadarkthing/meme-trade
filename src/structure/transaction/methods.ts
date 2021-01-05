import { getData } from "../../command/value";
import { ITransactionDocument } from "./types";


// Updates transaction document
export async function buy(this: ITransactionDocument, url: string, traderID: string) {
	
	const { value, score, age } = await getData(url)
	this.value = value
	this.score = score
	this.age = age
	this.userID = traderID
	this.operation = "BUY"
	this.created = new Date()
}
