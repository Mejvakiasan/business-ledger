import { useAuth } from "../context/AuthContext.jsx"

function SettingPage(){
    const{user, logout} = useAuth()

    return(
        <div className="p-4">
        <h1 className="mb-4 text-3xl font-bold text-orange-600">Setting Page</h1>
        <p>Name: {user?.name}</p>
        <p>Username: {user?.username}</p>
        <p>Role: {user?.role}</p>

        <button
        onClick={logout}
        className="mt-4 rounded-lg bg-orange-600 px-4 py-2 font-bold text-white"
        >
            Logout
        </button>
</div>
    )
    
}

export default SettingPage;