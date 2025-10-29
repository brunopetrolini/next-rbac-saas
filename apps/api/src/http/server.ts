import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import scalarSwaggerUi from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { authenticate } from './middlewares/authenticate'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
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

app.register(fastifyJwt, {
  secret: 'my-jwt-super-secret',
})
app.decorate('authenticate', authenticate)

app.register(cors)

/**
 * Authentication routes
 */
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)

app.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  console.log(`🚀 HTTP server running at ${address}`)
  console.log(`📚 API documentation available at ${address}/docs`)
})
