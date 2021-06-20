import { Document, Model } from "mongoose"
import { ITransactionDocument } from "../transaction/types";


export interface ITrader {
	userID: string;
	username: string;
	banned: boolean;
	balance: number;
	items: string[];
}

export interface ITraderDocument extends ITrader, Document {
	hasItem(transactionID: string): boolean;
	addItem(transactionID: string, count?: number): void;
	removeItem(transactionID: string, count?: number): void;
	countItem(transactionID: string): number;
	getTransactions(): Promise<ITransactionDocument[]>;
  getAllTransactions(limit?: number): Promise<ITransactionDocument[]>;
	hasItemByUrl(url: string): Promise<boolean>;
}

export interface ITraderModel extends Model<ITraderDocument> {
	findByUserId(userID: string): Promise<ITraderDocument | undefined>
}
