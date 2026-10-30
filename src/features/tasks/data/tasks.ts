import data from './tasks.json'

export const tasks = data.map((task) => ({
  ...task,
  createdAt: new Date(task.createdAt),
  updatedAt: new Date(task.updatedAt),
  dueDate: new Date(task.dueDate),
}))
