import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z
            .string({ message: 'Name is required' })
            .min(3, { message: 'Name must be at least 3 characters long' }),
          email: z.email({ message: 'Email is required' }),
          password: z
            .string({ message: 'Password is required' })
            .min(6, { message: 'Password must be at least 6 characters long' }),
        }),
      },
    },
    async () => {
      return { message: 'User created successfully' }
    },
  )
}
