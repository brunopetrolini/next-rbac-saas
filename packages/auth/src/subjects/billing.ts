import z from 'zod'

export const billingSchema = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('export')]),
  z.literal('Billing'),
])

export type BillingSubject = z.infer<typeof billingSchema>
