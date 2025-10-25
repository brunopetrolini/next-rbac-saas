import cors from '@fastify/cors'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { createAccount } from './routes/auth/create-account'

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(cors)

app.register(createAccount)

app.listen({ port: 3333 }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
