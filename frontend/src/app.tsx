import './app.css'
import {Navbar} from "./components/Navbar.tsx";
import {createContext} from "preact";
import {useState} from "preact/hooks"
import {User} from "./types/userTypes.ts";

const UserContext = createContext<any>(null);

export const App = () => {
    const [user, setUser] = useState<User|null>(null);

    return <UserContext.Provider value={{user, setUser}}>
        <Navbar />
        <main>

        </main>
    </UserContext.Provider>
}