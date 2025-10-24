import type { AbilityBuilder } from '@casl/ability'

import type { AppAbility } from '.'
import type { User } from './models/user'
import type { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (_, builder) => {
    builder.can('manage', 'all')
  },
  MEMBER: (user, builder) => {
    builder.can('invite', 'User')
    builder.can(['create', 'get'], 'Project', { ownerId: { $eq: user.id } })
  },
  BILLING: () => {},
}
