export interface GetClientByIdOutputDTO {
  data: {
    id: string
    name: string
    email: string
    phone: string
    age: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }
}
