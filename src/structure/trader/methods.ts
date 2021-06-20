import { ITraderDocument } from "./types";
import { TransactionModel } from "../transaction/model"
import { ITransactionDocument } from "../transaction/types";
import { parseUrl } from "../item"


export function hasItem(this: ITraderDocument, transactionID: string) {
	return this.items.some(x => x === transactionID)
}

// get all owned item transactions
// items that has been sold are excluded
export async function getTransactions(this: ITraderDocument) {
	// find transactions made with this url and this user
	const transactions = await TransactionModel.find({ 
		_id: {
			$in: this.items
		} 
	}) as ITransactionDocument[]

	return transactions
}

export function getAllTransactions(this: ITraderDocument) {
  return TransactionModel
    .find({ userID: this.userID }) 
    .sort({ created: 'desc' });
}

export async function hasItemByUrl(this: ITraderDocument, url: string) {
	const transactions = await this.getTransactions()
	return transactions.some(x => x.url === parseUrl(url))
}

export function countItem(this: ITraderDocument, transactionID: string) {
	return this.items
		.reduce((acc, val) => val === transactionID ? acc + 1 : acc, 0)
}

export function removeItem(this: ITraderDocument, transactionID: string) {
	this.items = remove(transactionID, this.items)
}

export function addItem(this: ITraderDocument, transactionID: string) {
	this.items.push(transactionID)
}

function remove<T>(item: T, arr: T[]): T[] {
	const index = arr.indexOf(item)
	if (index !== -1) {
		const temp = arr.slice()
		temp.splice(index, 1)
		return temp
	}
	return arr
}
