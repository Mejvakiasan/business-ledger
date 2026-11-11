import { useAuth } from '../context/AuthContext'

function HomePage() {
  const { user } = useAuth()

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-orange-600">
        Welcome, {user.name}
      </h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Logged in as {user.role}
      </p>
    </div>
  )
}

export default HomePage