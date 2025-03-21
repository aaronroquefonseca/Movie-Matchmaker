import {useEffect, useState, useContext} from "preact/hooks";
import { UserContext } from "../app.tsx";
import * as plex from "../scripts/plex.ts";

export const Navbar = () => {

    const {user, setUser} = useContext(UserContext);
    const [hasPlex, setHasPlex] = useState<boolean>(!!user.plexToken);
    const [hasJellyfin, setHasJellyfin] = useState<boolean>(!!user.jellyfinKey);
    const [plexOauth, setPlexOauth] = useState<string>('');

    useEffect(() => {
        if (user?.plexToken && user?.plexToken !== '') {
            setHasPlex(true);
        } else {
            setHasPlex(false);
        }

        if (!hasPlex) {
            plex.getOauth(user.clientId)
                .then(oauth => {
                    if (!!oauth) {
                        setPlexOauth(oauth.plexOauth)
                        setUser({
                            ...user,
                            plexPinId: oauth.id,
                            plexPicCode: oauth.code
                        })
                    }
                })
                .catch((error) => {
                    console.error('Error getting Plex OAuth:', error);
                }
            );
        }
        
    }, [user]);

    const loginPlex = async () => {
        window.location.href = plexOauth;


    }

    const logoutPlex = () => {
        setHasPlex(false);
        setUser({
            ...user,
            plexToken: undefined
        })
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
                   <button onClick={loginPlex}>Log in Plex</button>
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
