import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  listUsers,
  createUser,
  updateUser,
  removeUser,
  setUserStatus,
  changeUserRole,
} from '../api/users'
import UserCard from '../components/UserCard'
import UserForm from '../components/UserForm'
import ConfirmDialog from '../components/ConfirmDialog'

const sections = [
  { role: 'ADMIN', title: 'Admins' },
  { role: 'STAFF', title: 'Staff' },
  { role: 'CUSTOMER', title: 'Customers' },
]

function describeAction(type, user) {
  switch (type) {
    case 'remove':
      return {
        title: 'Remove user?',
        message: `${user.name} (@${user.username}) will be removed and can no longer log in. This cannot be undone.`,
        label: 'Remove',
        danger: true,
      }
    case 'deactivate':
      return {
        title: 'Deactivate user?',
        message: `${user.name} will not be able to log in until you reactivate the account. Their data is kept.`,
        label: 'Deactivate',
        danger: true,
      }
    case 'activate':
      return {
        title: 'Reactivate user?',
        message: `${user.name} will be able to log in again.`,
        label: 'Reactivate',
        danger: false,
      }
    case 'promote':
      return {
        title: 'Make this person an Admin?',
        message: `${user.name} will get full access to everything, including adding and removing people.`,
        label: 'Make admin',
        danger: false,
      }
    default:
      return {
        title: 'Make this person Staff?',
        message: `${user.name} will lose Admin access and become normal staff.`,
        label: 'Make staff',
        danger: false,
      }
  }
}

function runAction(type, actor, user) {
  switch (type) {
    case 'remove':
      return removeUser(actor, user.id)
    case 'deactivate':
      return setUserStatus(actor, user.id, 'DEACTIVATED')
    case 'activate':
      return setUserStatus(actor, user.id, 'ACTIVE')
    case 'promote':
      return changeUserRole(actor, user.id, 'ADMIN')
    default:
      return changeUserRole(actor, user.id, 'STAFF')
  }
}

function UsersPage() {
  const { user: actor } = useAuth()
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pending, setPending] = useState(null)
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false

    listUsers(actor)
      .then((data) => {
        if (cancelled) return
        setUsers(data)
        setError('')
      })
      .catch(() => {
        if (!cancelled) setError('Needs internet. Connect and try again.')
      })

    return () => {
      cancelled = true
    }
  }, [actor, reload])

  function openAdd() {
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(user) {
    setEditing(user)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
  }

  async function handleSave(data) {
    if (editing) {
      await updateUser(actor, editing.id, data)
    } else {
      await createUser(actor, data)
    }
    closeForm()
    setReload((count) => count + 1)
  }

  async function confirmAction() {
    setBusy(true)
    try {
      await runAction(pending.type, actor, pending.user)
      setPending(null)
      setActionError('')
      setReload((count) => count + 1)
    } catch (err) {
      setActionError(
        err.message === 'FORBIDDEN'
          ? 'You are not allowed to do that.'
          : 'Could not finish. Check your internet and try again.'
      )
    }
    setBusy(false)
  }

  const info = pending ? describeAction(pending.type, pending.user) : null

  return (
    <div className="p-4 pb-28">
      <Link
        to="/setting"
        className="text-sm font-bold text-orange-600 dark:text-orange-400"
      >
        ‹ Setting
      </Link>
      <h1 className="mt-1 text-3xl font-bold text-orange-600">Users</h1>

      {error && (
        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <button
            type="button"
            onClick={() => setReload((count) => count + 1)}
            className="mt-3 rounded-lg border border-gray-300 px-4 py-2 font-bold dark:border-gray-600"
          >
            Try again
          </button>
        </div>
      )}

      {!error && users === null && (
        <p className="mt-6 text-gray-500 dark:text-gray-400">Loading...</p>
      )}

      {!error &&
        users !== null &&
        sections.map(({ role, title }) => {
          const group = users.filter((u) => u.role === role)
          if (group.length === 0) return null
          return (
            <section key={role} className="mt-5">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {title} ({group.length})
              </h2>
              <div className="space-y-2">
                {group.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    actor={actor}
                    onEdit={openEdit}
                    onAction={(type, target) => {
                      setActionError('')
                      setPending({ type, user: target })
                    }}
                  />
                ))}
              </div>
            </section>
          )
        })}

      <button
        type="button"
        onClick={openAdd}
        aria-label="Add user"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-3xl text-white shadow-lg"
      >
        +
      </button>

      {showForm && (
        <UserForm
          user={editing}
          actor={actor}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {pending && (
        <ConfirmDialog
          title={info.title}
          message={`${info.message}${actionError ? ` ${actionError}` : ''}`}
          confirmLabel={info.label}
          danger={info.danger}
          busy={busy}
          onConfirm={confirmAction}
          onCancel={() => {
            setPending(null)
            setActionError('')
          }}
        />
      )}
    </div>
  )
}

export default UsersPage