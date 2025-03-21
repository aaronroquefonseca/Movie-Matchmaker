import {useEffect, useState, useContext} from "preact/hooks";
import { UserContext } from "../app.tsx";
import * as plex from "../scripts/plex.ts";

export const Navbar = () => {

    const {user, setUser} = useContext(UserContext);
    const [hasPlex, setHasPlex] = useState<boolean>(false);
    const [hasJellyfin, setHasJellyfin] = useState<boolean>(false);
    const [plexOauth, setPlexOauth] = useState<string>('');

    useEffect(() => {
        if (user?.plexToken && user?.plexToken !== '') {
            setHasPlex(true);
        } else {
            setHasPlex(false);
        }

        if (!hasPlex) {
            plex.getOauth(user.clientId).then((url) => {
                setPlexOauth(url);
            }).catch((error) => {
                console.error('Error getting Plex OAuth:', error);
            });
        }
        
    }, [user]);


    const logoutPlex = () => {
        setHasPlex(false);
        localStorage.removeItem("plexToken");
        user.plexToken = '';
    }

    const logoutJellyfin = () => {
        setHasJellyfin(true);
    }

    return <nav>
       <div>
           <h1>🎥 Movie Matchmaker</h1>

           <div className="nav-items">
               {hasPlex ?
                   <button onClick={logoutPlex}>Log out Plex</button>
                   :
                   <button onClick={() => window.location.href = plexOauth}>Log in Plex</button>
               }
               {hasJellyfin ?
                   <button onClick={logoutJellyfin}>Log out Jellyfin</button>
                   :
                   <button>Log in Jellyfin</button>
               }
           </div>
       </div>
    </nav>
}
