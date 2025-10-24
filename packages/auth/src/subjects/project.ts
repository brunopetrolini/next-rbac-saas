import z from 'zod'

import { projectSchema as projectModel } from '../models/project'

export const projectSchema = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('get'),
  ]),
  z.union([z.literal('Project'), projectModel]),
])

export type ProjectSubject = z.infer<typeof projectSchema>
