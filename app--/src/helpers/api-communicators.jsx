import axios from "axios";

export const loginUser = async (email, password) => {
    
    
    try{

        const response = await axios.post(
            "http://127.0.0.1:5000/login",
            { email, password },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            }
        );

        return response.data; // already the JSON from backend

    }catch(err){
        console.error(err)
        throw new Error("Unable to login");

    }
}



export const registerUser = async (userName, email, password) =>{
    
    try{
        const response = await axios.post(
        'http://127.0.0.1:5000/register',
        {userName, email, password},
            {
                headers: {
                    'Content-Type': 'application/json'  // Explicit content type
                },
                withCredentials: true
            }            
        );
    
    }catch(err){
        throw new Error(err.response?.data?.error || 'Unable to register');
    }
}

export const checkAuthStatus = async () => {
    try{
        
        const response = await axios.get("http://127.0.0.1:5000/Auth-Status", { withCredentials: true });
        

        const data = response.data;
        return data;

    }catch(error){
        if (error.response && error.response.status === 401) {
            // No valid login session — treat as logged out
            return null;
        }
        // re-throw or handle other errors as needed
        throw error;
    }
}

export const logoutUser = async () => {
    
    try{
        
        const res = await axios.post("http://127.0.0.1:5000/logout", {},{
            withCredentials: true
        });
    
        if(res.status !== 200){
            console.log(res)
            throw new Error("Unable to logout");
        }

        const data = res.data;
        return data;

        

    }catch(error){
        console.log(error)
        throw new Error("Unable to logout")
    }

}



export const sendDesscription = async(description, email) =>{
    try{
        
        const response =  await axios.post(
            "http://127.0.0.1:5000/Description",             
            {description, email},
            {
                headers: {
                    'Content-Type': 'application/json'  // Explicit content type
                },
                withCredentials: true
                
            }     
        
        )
        
        if(!response){
            throw new Error("Couldn't get the suggestions")
        }

        return  response.data;

    }catch(error){
        throw new Error(error)
    }
} 


export const forgotPassword = async (email) =>{  
    
    try{

        const response = await axios.post(
        
            "http://127.0.0.1:5000/Forgotpassword",
            {email},
            {headers: { "Content-Type": "application/json" }}
        );
    
        return response.data;

    }catch(err){
        throw new Error(err)
    }


}

export const Reset_Password = async(token, password) =>{
    try{
        
        console.log(token)
        console.log(password)
        const resp = axios.post(
            
            "http://127.0.0.1:5000/reset", 
            {token, password},
            { headers: { "Content-Type": "application/json" } }

        )

        return resp.data;



    }catch(error){
        throw new Error(error)
    }


}

const getAuthConfig = () => {
    const token = localStorage.getItem("authToken");
    
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};


export const getMovies = async () => {
    try {
        const resp = await axios.get("http://127.0.0.1:5000/GetMovies", getAuthConfig());
        return resp.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || err.message);
    }
};

export const getPrompt = async () => {
    try {
        const resp = await axios.get("http://127.0.0.1:5000/Prompt", getAuthConfig());
        return resp.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || err.message);
    }
};

export const sendMovies = async (movies, email) => {
    try {
        const resp = await axios.post("http://127.0.0.1:5000/movies", { movies }, getAuthConfig());
        return resp.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || err.message);
    }
}
