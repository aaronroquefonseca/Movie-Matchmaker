import './app.css'
import {Navbar} from "./components/Navbar.tsx";
import {createContext} from "preact";
import {useState} from "preact/hooks"

const UserContext = createContext<any>(null);

type User = {
    plexId: string;
    jellyfinnId: string;
    guessId: string;
    sessionId: string;
}

export const App = () => {
    const [user, setUser] = useState<User|null>(null);

    return <UserContext.Provider value={{user, setUser}}>
        <Navbar />
        <main>

        </main>
    </UserContext.Provider>
}