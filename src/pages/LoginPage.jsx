import { useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"

function LoginPage(){
    const {login} = useAuth()
    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')
    const[showPassword, setShowPassword] = useState(false)
    const[error, setError] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        const result = login(username, password)
        if(!result.ok) setError(result.message)

}

const inputStyle = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-ray-600 dark:bg-gray-800'

return(
    <div className="mx-auto max-w-sm p-6 pt-6">
        <h1 className="mb-1 text-3xl font-bold text-orange-600">Tea Shop</h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">Please log in</p>

        <form onSubmit={handleSubmit} className = "space-y-4">  
            <input 
                type="text"
                placeholder="Username"
                className={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            
            <div className="relative">
                <input 
                className={inputStyle}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className = "absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400"
                >
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                className="w-ful rounded-lg bg-orange-600 py-3 font-bold text-white"
            >
                Login
            </button>
        </form>

          <div className="mt-6 rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
        <p className="font-bold">Test users (temporary)</p>
        <p>admin / admin123</p>
        <p>staff / staff123</p>
        <p>customer / customer123</p>
      </div>


    </div>
)
}

export default LoginPage