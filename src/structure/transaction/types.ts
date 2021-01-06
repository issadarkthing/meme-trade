import { Document, Model } from "mongoose"

export interface ITransaction {
	userID: string;
	url: string;
	value: number;
	score: number;
	age: number;
	operation: "BUY" | "SELL";
	created: Date;
	profitMargin?: number;
	buyTransactionID?: string;
}

export interface ITransactionDocument extends ITransaction, Document {}


export interface ITransactionModel extends Model<ITransactionDocument> {}


