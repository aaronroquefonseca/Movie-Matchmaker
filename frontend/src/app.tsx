import './app.css'
import {Navbar} from "./components/Navbar.tsx";
import {createContext} from "preact";
import {useState, useEffect} from "preact/hooks"
import {User} from "./types/userTypes.ts";
import * as plex from "./scripts/plex.ts";

import { v4 as uuidv4 } from "uuid";

export const UserContext = createContext<any>(null);

export const App = () => {
    const [user, setUser] = useState<User>({
        clientId: localStorage.getItem("clientId") ?? uuidv4()
    });

    useEffect(() => {

        if (window.location.pathname.startsWith('/plex')){
            window.history.replaceState(null, '', '/');

            if (!!user.plexPinId && !!user.plexPinCode)
                plex.getToken(user.clientId, user.plexPinId, user.plexPinCode)
                    .then(r => !!r && setUser({
                        ...user,
                        plexToken: r
                    }));
        }

        if (user.plexToken) {
            plex.getUser(user.clientId, user.plexToken).then((username) => {
                if (username) {
                    console.log('Plex user:', username);
                    setUser({
                        ...user,
                        username
                    });
                } else if (username === '') {
                    setUser({
                        ...user,
                        plexToken: undefined
                    })
                }
            }).catch((error) => {
                console.error('Error fetching Plex user:', error);
            });
        }
    }, []);

    // LOCAL STORAGE MANAGEMENT
    useEffect(() => {
        let clientIdStored = localStorage.getItem("clientId");

        if(!clientIdStored || clientIdStored != user.clientId) {
            localStorage.setItem("clientId", user.clientId);
        }

        let plexTokenStored = localStorage.getItem("plexToken");

        if(!user.plexToken && !!plexTokenStored){
            setUser({
                ...user,
                plexToken: plexTokenStored
            });
        }

        if(!plexTokenStored || plexTokenStored != user.plexToken) {
            if (user.plexToken != null) {
                localStorage.setItem("plexToken", user.plexToken);
            }
        }


        let plexPinIdStored = localStorage.getItem("plexPinId");

        if(!plexPinIdStored && !!user.plexPinId){
            localStorage.setItem("plexPinId", user.plexPinId);
        }

        if(!user.plexPinId && !!plexPinIdStored){
            setUser({
                ...user,
                plexPinId: plexPinIdStored
            })
        }

        let plexPinCodeStored = localStorage.getItem("plexPinCode");

        if(!plexPinCodeStored && !!user.plexPinCode){
           localStorage.setItem("plexPinCode", user.plexPinCode);
        }

        if(!user.plexPinCode && !!plexPinCodeStored){
            setUser({
                ...user,
                plexPinCode: plexPinCodeStored
            })
        }

    }, [user]);

    return <UserContext.Provider value={{user, setUser}}>
        <Navbar />
        <main>

        </main>
    </UserContext.Provider>
}