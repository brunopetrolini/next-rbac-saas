import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('securepassword', 1)
  const [firstUser, secondUser, thirdUser] =
    await prisma.user.createManyAndReturn({
      data: [
        {
          name: 'John Doe',
          email: 'john.doe@acme.com',
          avatarUrl: 'https://github.com/brunopetrolini.png',
          passwordHash,
        },
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          avatarUrl: faker.image.avatarGitHub(),
          passwordHash,
        },
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          avatarUrl: faker.image.avatarGitHub(),
          passwordHash,
        },
      ],
    })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      shouldAttachUsersByDomain: true,
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: firstUser.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              ownerId: faker.helpers.arrayElement([
                firstUser.id,
                secondUser.id,
                thirdUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              ownerId: faker.helpers.arrayElement([
                firstUser.id,
                secondUser.id,
                thirdUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              ownerId: faker.helpers.arrayElement([
                firstUser.id,
                secondUser.id,
                thirdUser.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: firstUser.id,
              role: 'ADMIN',
            },
            {
              userId: secondUser.id,
              role: 'MEMBER',
            },
            {
              userId: thirdUser.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: firstUser.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              ownerId: faker.helpers.arrayElement([
                firstUser.id,
                secondUser.id,
                thirdUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              ownerId: faker.helpers.arrayElement([
                firstUser.id,
                secondUser.id,
                thirdUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              ownerId: faker.helpers.arrayElement([
                firstUser.id,
                secondUser.id,
                thirdUser.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: firstUser.id,
              role: 'MEMBER',
            },
            {
              userId: secondUser.id,
              role: 'ADMIN',
            },
            {
              userId: thirdUser.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: firstUser.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              ownerId: faker.helpers.arrayElement([
                firstUser.id,
                secondUser.id,
                thirdUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              ownerId: faker.helpers.arrayElement([
                firstUser.id,
                secondUser.id,
                thirdUser.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              ownerId: faker.helpers.arrayElement([
                firstUser.id,
                secondUser.id,
                thirdUser.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: firstUser.id,
              role: 'BILLING',
            },
            {
              userId: secondUser.id,
              role: 'ADMIN',
            },
            {
              userId: thirdUser.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })
}

seed().then(() => console.log('DB seeded successfully.'))
