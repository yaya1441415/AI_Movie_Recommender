import React, { useState } from 'react'
import "../style/contetCoach.css"
import Navbar from './Navbar';
import { toast } from "react-hot-toast";
import { sendDesscription, sendMovies } from '../helpers/api-communicators';
import { useAuth } from '../context/authContext';


function ContentCoach() {
    
    const [description, setDescription] = useState("");
    const [movies, setMovies] = useState([]) // Store recommended movies.
    const [showCard, setShowCard] = useState(false); // Control popup visibility
    const [likedMovies, setLikedMovies] = useState([])
    const user = useAuth()     

    const handleChange = (e) => {
        setDescription(e.target.value)
    }

    const like = async (movie)=>{


        if(likedMovies.includes(movie)){
            
            setLikedMovies(likedMovies.filter(m=>m!==movie))

        }
        else if(!likedMovies.includes(movie)){

            setLikedMovies([...likedMovies, movie])

        }

    }

    const add = async () => {
        if(likedMovies.length === 0){

            return

        }
        else{

            await sendMovies(likedMovies)
            toast.success("Liked Movies Added.:)", {id:"Done"})
        
        }
        
    }


    const handleSubmit = async (e) => {

        e.preventDefault(); // Prevents default form submit behavior
        toast.loading("Thinking...", {id: "Suggestion"})
       
        try{
            
            const resp = await sendDesscription(description, user.email);

            setMovies(resp.movies);// save movies to state
            setShowCard(true)
            toast.success("Done", { id: "Suggestion" })
            
        }catch(error){
            console.log(error)
        }
        
    }

  return (
    <div className='page' >
        <Navbar/>
        <div className='title'>
            <h1>What are You Feeling Today?</h1>
        </div>
        <div className='dscription'>
        
            <form className='description' onSubmit={handleSubmit}>
                <textarea rows="20" cols= "90" onChange={handleChange}/>      
                <button className='btn' type='submit'>Suggest</button>
            </form>
       </div>

       {showCard && (
        <div className='popup-card'>
            <h2>Recommended Movies</h2>
            <ul>
                {movies.map((mov, idx)=>(
                    <li 
                      key = {idx}
                      onClick = {()=>like(mov)}
                      style=
                        {{
                            backgroundColor: likedMovies.includes(mov) ? "#ff0000" : "#bd7d6d",
                            padding: "0.75rem 1rem",
                            margin: "0.5rem 0",
                            borderRadius: "10px",
                            transition: "background 0.2s ease",
                            cursor: "pointer",
                        }}

                    >
                        <span>{mov}</span>
                        
                    </li>
                ))}
            </ul>
            <button className='add_btn' onClick={()=> add()} >Add</button>
            <button className = "close-btn" onClick={()=>setShowCard(false)}>Close</button>
        </div>
       )}
    </div>
  )
}

export default ContentCoach
