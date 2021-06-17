import { Schema } from "mongoose"


export const TraderSchema = new Schema({
	userID: String,
	username: String,
	banned: { type: Boolean, default: false },
	balance: { type: Number, default: 10 },
	items: { type: Array, default: [] }
})
