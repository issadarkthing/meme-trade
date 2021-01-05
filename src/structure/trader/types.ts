import { Document, Model } from "mongoose"


export interface ITrader {
	userID: string;
	username: string;
	banned: boolean;
	balance: number;
	items: string[];
}

export interface ITraderDocument extends ITrader, Document {
	hasItem(url: string): boolean;
	addItem(url: string, count?: number): void;
	removeItem(url: string, count?: number): void;
	countItem(url: string): number;
}

export interface ITraderModel extends Model<ITraderDocument> {
	findByUserId(userID: string): Promise<ITraderDocument | undefined>
}
