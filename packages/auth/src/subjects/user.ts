import z from 'zod'

export const userSchema = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('delete'),
    z.literal('invite'),
  ]),
  z.literal('User'),
])

export type UserSubject = z.infer<typeof userSchema>
