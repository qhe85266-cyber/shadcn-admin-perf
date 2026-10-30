import { type User } from './schema'
import data from './users.json'

export const users: User[] = data.map((user) => ({
  ...user,
  status: user.status as User['status'],
  role: user.role as User['role'],
  createdAt: new Date(user.createdAt),
  updatedAt: new Date(user.updatedAt),
}))
