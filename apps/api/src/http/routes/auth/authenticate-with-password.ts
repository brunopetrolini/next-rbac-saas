import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Authenticate with e-mail and password',
        description:
          'Authenticate a user using their e-mail and password credentials.',
        body: z.object({
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            access_token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.status(401).send({ message: 'Invalid e-mail or password' })
      }

      if (!user.passwordHash) {
        return reply.status(400).send({
          message:
            'User does not have a password set, use social login instead',
        })
      }

      const isPasswordValid = await compare(password, user.passwordHash)

      if (!isPasswordValid) {
        return reply.status(401).send({ message: 'Invalid e-mail or password' })
      }

      const accessToken = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(200).send({ access_token: accessToken })
    },
  )
}
