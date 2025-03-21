import {useEffect, useState} from "preact/hooks";

export const Navbar = () => {

    const [hasPlex, setHasPlex] = useState<boolean>(false);
    const [hasJellyfin, setHasJellyfin] = useState<boolean>(false);

    useEffect(() => {
    })


    const logoutPlex = () => {
        setHasPlex(false);
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
                   <button>Log in Plex</button>
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
