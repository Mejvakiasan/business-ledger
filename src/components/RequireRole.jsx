import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RequireRole({ roles, children }) {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RequireRole