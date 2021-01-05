import { ITransactionDocument, ITransactionModel } from "./types"
import { TransactionSchema } from "./schema"
import { model } from "mongoose"


export const TransactionModel = model<ITransactionDocument>("transaction", TransactionSchema) as ITransactionModel
