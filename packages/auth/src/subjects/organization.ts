import z from 'zod'

export const organizationSchema = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownership'),
  ]),
  z.literal('Organization'),
])

export type OrganizationSubject = z.infer<typeof organizationSchema>
