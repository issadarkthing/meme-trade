import { model } from "mongoose";
import { ITraderDocument, ITraderModel } from "./types"
import { TraderSchema } from "./schema"
import * as statics from "./statics"
import * as methods from "./methods"


TraderSchema.methods.hasItem = methods.hasItem
TraderSchema.methods.removeItem = methods.removeItem
TraderSchema.methods.addItem = methods.addItem
TraderSchema.methods.countItem = methods.countItem
TraderSchema.methods.getTransactions = methods.getTransactions
TraderSchema.methods.hasItemByUrl = methods.hasItemByUrl

TraderSchema.statics.findByUserId = statics.findByUserId

export const TraderModel = model<ITraderDocument>("trader", TraderSchema) as ITraderModel;
