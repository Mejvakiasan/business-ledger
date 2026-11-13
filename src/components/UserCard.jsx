import { allowedActions } from '../utils/userRules'

const roleLabels = { ADMIN: 'Admin', STAFF: 'Staff', CUSTOMER: 'Customer' }

function Badge({ children, tone = 'gray' }) {
  const tones = {
    gray: 'border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
    orange:
      'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-300',
    red: 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
  }
  return (
    <span
      className={`rounded-sm border px-1.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

const smallButton =
  'rounded-lg border px-3 py-2 text-sm font-bold border-gray-300 dark:border-gray-600'

function UserCard({ user, actor, onEdit, onAction }) {
  const can = allowedActions(user, actor)
  const deactivated = user.status === 'DEACTIVATED'

  return (
    <div
      className={`rounded-xl border border-gray-200 p-4 dark:border-gray-700 ${
        deactivated ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-bold">{user.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
            {user.mobile && ` · ${user.mobile}`}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          <Badge tone="orange">{roleLabels[user.role]}</Badge>
          {user.isOwner && <Badge tone="orange">Owner</Badge>}
          {deactivated && <Badge tone="red">Deactivated</Badge>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {can.edit && (
          <button type="button" className={smallButton} onClick={() => onEdit(user)}>
            Edit
          </button>
        )}
        {can.promote && (
          <button
            type="button"
            className={smallButton}
            onClick={() => onAction('promote', user)}
          >
            Make admin
          </button>
        )}
        {can.demote && (
          <button
            type="button"
            className={smallButton}
            onClick={() => onAction('demote', user)}
          >
            Make staff
          </button>
        )}
        {can.toggleStatus && (
          <button
            type="button"
            className={smallButton}
            onClick={() => onAction(deactivated ? 'activate' : 'deactivate', user)}
          >
            {deactivated ? 'Reactivate' : 'Deactivate'}
          </button>
        )}
        {can.remove && (
          <button
            type="button"
            className="rounded-lg border border-red-300 px-3 py-2 text-sm font-bold text-red-600 dark:border-red-800 dark:text-red-400"
            onClick={() => onAction('remove', user)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default UserCard