import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import scalarSwaggerUi from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { createAccount } from './routes/auth/create-account'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description:
        'A full-stack multi-tenant & RBAC SaaS application built with Next.js and Fastify',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
app.register(scalarSwaggerUi, {
  routePrefix: '/docs',
  configuration: {
    theme: 'deepSpace',
    hideTestRequestButton: true,
    hideDarkModeToggle: true,
    hideClientButton: true,
  },
})

app.register(cors)

app.register(createAccount)

app.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  console.log(`🚀 HTTP server running at ${address}`)
  console.log(`📚 API documentation available at ${address}/docs`)
})
