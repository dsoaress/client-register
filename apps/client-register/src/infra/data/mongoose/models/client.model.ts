import { model, Schema } from 'mongoose'

export interface MongooseClientDocument {
  _id: string
  name: string
  phone: string
  age: number
  email: string
  password: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

class ClientSchema extends Schema<MongooseClientDocument> {
  readonly name = 'Client'

  constructor() {
    super({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true, unique: true },
      age: { type: Number, required: true },
      password: { type: String, required: true },
      isActive: { type: Boolean, required: true },
      createdAt: { type: Date, required: true },
      updatedAt: { type: Date, required: true }
    })
  }
}

const userSchema = new ClientSchema()
export const ClientModel = model<MongooseClientDocument>(userSchema.name, userSchema)
