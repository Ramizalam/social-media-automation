import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";


interface User {
    _id: string;
    name:string,
    email:string,
}

interface AuthContextType{
    user: User | null
    token: string | null
    isLoading: boolean
    login: (userData:User, token:string) => void
    logout: () => void
    isAuthenticated:boolean
}
const AuthContext = createContext<AuthContextType|undefined>(undefined)

export const AuthProvider : React.FC<{children:React.ReactNode}> = ({children}) =>{
    const [user,setUser] = useState<User|null>(null)
    const [token,setToken] = useState<string|null>(null)
    const [isLoading,setIsLoading] = useState(true)

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if(storedUser && storedToken){
            setUser(JSON.parse(storedUser))
            setToken(storedToken)
            api.defaults.headers.Authorization = `Bearer ${storedToken}`
        }
        setIsLoading(false)
    },[])

    const login = (userData:User, token:string)=>{
        setUser(userData)
        setToken(token)
        localStorage.setItem("token",token)
        localStorage.setItem("user",JSON.stringify(userData))
        api.defaults.headers.Authorization = `Bearer ${token}`
    }

    const logout = ()=>{
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        api.defaults.headers.Authorization = ""
    }

    const isAuthenticated = !!user && !!token

    return ( <AuthContext.Provider  value={{user,token, isLoading,login,logout,isAuthenticated}}>
        {children}
    </AuthContext.Provider>)
}

export const useAuth =()=>{
    const context = useContext(AuthContext);
    if(context===undefined){
        throw new Error("user Auth must be used within an AuthProvider");
    }
    return context;
}