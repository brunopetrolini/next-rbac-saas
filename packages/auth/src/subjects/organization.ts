import z from 'zod'

import { organizationSchema as organizationModel } from '../models/organization'

export const organizationSchema = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownership'),
  ]),
  z.union([z.literal('Organization'), organizationModel]),
])

export type OrganizationSubject = z.infer<typeof organizationSchema>
