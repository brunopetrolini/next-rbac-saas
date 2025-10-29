import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify<{ sub: string }>()
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
