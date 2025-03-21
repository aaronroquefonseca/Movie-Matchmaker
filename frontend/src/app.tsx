import './app.css'
import {Navbar} from "./components/Navbar.tsx";
import {createContext} from "preact";
import {useState, useEffect} from "preact/hooks"
import {User} from "./types/userTypes.ts";
import * as plex from "./scripts/plex.ts";

import { v4 as uuidv4 } from "uuid";

const UserContext = createContext<any>(null);

export const App = () => {
    const [user, setUser] = useState<User>({
        clientId: ""
    });

    useEffect(() => {
        let storedClientId = localStorage.getItem("clientId");
        
        // If no clientId exists, generate one and store it
        if (!storedClientId) {
            storedClientId = uuidv4();  // Generate a new UUID
            localStorage.setItem("clientId", storedClientId);  // Save it to localStorage
        }
        
        // Update the state with the clientId
        setUser(prevState => ({
            ...prevState,
            clientId: storedClientId
        }));

        // Check if plexToken exists in localStorage
        const storedPlexToken = localStorage.getItem("plexToken");

        if (storedPlexToken) {
            plex.getUser(storedClientId, storedPlexToken).then((username) => {
                if (username) {
                    console.log('Plex user:', username);
                    setUser(prevState => ({
                        ...prevState,
                        plexToken: storedPlexToken,
                        username: username
                    }));
                } else if (username === '') {
                    localStorage.removeItem("plexToken");
                }
            }).catch((error) => {
                console.error('Error fetching Plex user:', error);
            });
        }
    }, []);

    return <UserContext.Provider value={{user, setUser}}>
        <Navbar />
        <main>

        </main>
    </UserContext.Provider>
}