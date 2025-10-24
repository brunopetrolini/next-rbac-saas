import z from 'zod'

export const projectSchema = z.tuple([
  z.union([z.literal('manage'), z.literal('create'), z.literal('delete')]),
  z.literal('Project'),
])

export type ProjectSubject = z.infer<typeof projectSchema>
