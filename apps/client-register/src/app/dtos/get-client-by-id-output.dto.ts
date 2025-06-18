export interface GetClientByIdOutputDTO {
  data: {
    id: string
    name: string
    email: string
    phone: string
    age: number
    password: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }
}
