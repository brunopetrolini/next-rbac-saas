import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Authentication'],
        summary: 'Get authenticated user profile',
        description:
          'Retrieve the profile information of the authenticated user.',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            id: z.string(),
            name: z.string().optional(),
            email: z.email(),
            avatar_url: z.url().optional(),
          }),
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { sub } = request.user as { sub: string }

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
        where: { id: sub },
      })

      if (!user) {
        return reply
          .status(404)
          .send({ message: 'User not found, please check your credentials' })
      }

      return reply.send({
        id: user.id,
        name: user.name ?? undefined,
        email: user.email,
        avatar_url: user.avatarUrl ?? undefined,
      })
    },
  )
}
