import { faker } from '@faker-js/faker'
import { writeFile } from 'node:fs/promises'

// A fixed reference date makes seeded relative dates reproducible too.
faker.setDefaultRefDate('2026-01-01T00:00:00.000Z')

// Set a fixed seed for consistent data generation
faker.seed(67890)

const users = Array.from({ length: 500 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: faker.internet
      .username({ firstName, lastName })
      .toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    status: faker.helpers.arrayElement([
      'active',
      'inactive',
      'invited',
      'suspended',
    ]),
    role: faker.helpers.arrayElement([
      'superadmin',
      'admin',
      'cashier',
      'manager',
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})

// Set a fixed seed for consistent data generation
faker.seed(12345)

const tasks = Array.from({ length: 100 }, () => {
  const statuses = ['todo', 'in progress', 'done', 'canceled', 'backlog']
  const labels = ['bug', 'feature', 'documentation']
  const priorities = ['low', 'medium', 'high']

  return {
    id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
    title: faker.lorem.sentence({ min: 5, max: 15 }),
    status: faker.helpers.arrayElement(statuses),
    label: faker.helpers.arrayElement(labels),
    priority: faker.helpers.arrayElement(priorities),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    assignee: faker.person.fullName(),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    dueDate: faker.date.future(),
  }
})

for (const [name, data] of Object.entries({ users, tasks })) {
  await writeFile(
    new URL(`../src/features/${name}/data/${name}.json`, import.meta.url),
    `${JSON.stringify(data, null, 2)}\n`
  )
}
