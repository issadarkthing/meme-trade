import { Schema } from "mongoose"


export const TransactionSchema = new Schema({
	userID: String,
	url: String,
	value: Number,
	score: Number,
	age: Number,
	operation: String,
	created: Date,
	profitMargin: Number,
	buyTransactionID: String,
})



