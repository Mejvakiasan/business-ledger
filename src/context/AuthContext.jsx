import { createContext, useContext, useState } from "react"
import { mockUsers } from "../data/mockUsers.js"

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const[user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    });

    function login(username, password){
        const found = mockUsers.find(
            (u) => u.username === username && u.password === password
        )
        if(!found){
            return{ok: false, message: 'Invalid username or password'}
        }
        const {password: _hidden, ...safeUser} = found
        setUser(safeUser)
        localStorage.setItem('user', JSON.stringify(safeUser))
        return {ok: true}
    }

    function logout(){
        setUser(null)
        localStorage.removeItem('user')
    }

    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}