import { ITraderModel } from "./types"

export function findByUserId(this: ITraderModel, userId: string) {
	return this.findOne({ userID: userId })
}
