import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { getMovies, getPrompt } from '../helpers/api-communicators';
import Navbar from './Navbar';

function Profile() {
    const [prompt, setPrompt] = useState("");
    const [movies, setMovies] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const [fetchedMovies, fetchedPrompt] = await Promise.all([
                    getMovies(),
                    getPrompt()
                ]);

                if (isMounted) {
                    setMovies(fetchedMovies.movies || []);
                    setPrompt(fetchedPrompt.status || "");
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };

        if (user?.email) fetchData();

        return () => { isMounted = false; };
    }, [user?.email]);

    return (
        <div>
            <Navbar />
            <div className='card'>
                <h1>{user?.userName}</h1>
                <h2>email: {user?.email}</h2>
                <h3>3 movies to watch:</h3>
                <ul>
                    {movies.map((m, idx) => <li key={idx}>{m}</li>)}
                </ul>
                <h4>Latest Prompt</h4>
                <h4>{prompt}</h4>
            </div>
        </div>
    );
}

export default Profile;
