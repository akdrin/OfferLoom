import axios from 'axios'


//used to remove redundancy of writing same baseURL ans withCredentials:true
const api= axios.create({
    baseURL: "http://localhost:3000",
    withCredentials:true
})
//register function
export async function register({username,email,password}){
    try{
        const response= await api.post("/api/auth/register",{
            username,email,password
        })
        return response.data;
    }
    catch(err){
        console.log(err);
    }
}

//login function
export async function login({username,password}){
    try{
        const response= await api.post("/api/auth/login",{
            username,password
        })
        return response.data;
    }catch(err){
        console.log(err);
    }
}

//logout function
export async function logout(){
    try{
        const response= await api.get("/api/auth/logout",)
        return response.data;
    }catch(err){
        console.log(err);
    }
}

//getme function
export async function getMe(){
    try{
        const response= await api.get("/api/auth/get-me");
        return response.data;
    }
    catch(err){
        console.log(err);
    }
}