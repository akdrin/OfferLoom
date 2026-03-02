import { createContext,useState,useEffect} from "react";
import { getMe } from "./services/auth.api";


export const AuthContext= createContext()

export const AuthProvider= ({children})=>{
    const [user,setUser]= useState(null)

    //we use this state as true in production to hydrate the user
    const [loading,setLoading]= useState(true)

    //used to fetch data from cookies to set user that we dont need to login again and again
    useEffect(() => {
    const hydrateUser = async () => {
        try {
            const data = await getMe();
            if (data?.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    hydrateUser();
    }, []);

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}