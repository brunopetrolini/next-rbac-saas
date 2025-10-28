import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        summary: 'Create a new user account',
        tags: ['Authentication'],
        body: z.object({
          name: z
            .string({ message: 'Name is required' })
            .min(3, { message: 'Name must be at least 3 characters long' }),
          email: z.email({ message: 'Email is required' }),
          password: z
            .string({ message: 'Password is required' })
            .min(6, { message: 'Password must be at least 6 characters long' }),
          avatar_url: z.url().optional(),
        }),
        response: {
          201: z.void(),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password, avatar_url } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (userWithSameEmail) {
        return reply.status(409).send({ message: 'Email is already in use' })
      }

      const passwordHash = await hash(password, 6)
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          avatarUrl: avatar_url,
        },
      })

      return reply.status(201).send()
    },
  )
}
