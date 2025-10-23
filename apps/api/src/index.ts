import { defineAbilityFor } from '@acl/auth'

const adminRole = defineAbilityFor({ role: 'ADMIN' })
const memberRole = defineAbilityFor({ role: 'MEMBER' })

console.log('Admin can invite:', adminRole.can('invite', 'User'))
console.log('Admin can delete:', adminRole.can('delete', 'User'))
console.log('Member can invite:', memberRole.can('invite', 'User'))
console.log('Member can delete:', memberRole.can('delete', 'User'))
