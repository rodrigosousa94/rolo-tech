import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConnection";

import { useEffect, useState, createContext, ReactNode } from "react";

type AuthContextData = {
    signed: boolean;
    loading: boolean;
    handleInfoUser: ({name, email, uid}: UserProps) => void;
    user: UserProps | null;
}

interface AuthProviderProps {
    children: ReactNode
}

interface UserProps { 
    uid: string;
    name: string | null;
    email: string | null;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<UserProps | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
      const unsub = onAuthStateChanged(auth, (user) => {
        if(user){
            setUser({
                uid: user.uid,
                name: user?.displayName,
                email: user?.email
            })
            setLoading(false)
        }else{
            setUser(null)
            setLoading(false)
        }
      })

      return () => {
        unsub()
      }
    },[])

    function handleInfoUser({name, uid, email}: UserProps){
        setUser({
            uid,
            email,
            name,
        })
    }


    return(
        <AuthContext.Provider value={{signed: !!user, loading, handleInfoUser, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider