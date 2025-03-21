
export type User = {
    clientId: string;       // storage, no expiration
    plexPinId?: string;     // cookie, expires in 15 minutes
    plexPinCode?: string;   // cookie, expires in 15 minutes
    plexToken?: string;     // storage, no expiration, plex will revoke over time
    jellyfinKey?: string;
    // guestId?: string;       // session exclusive, don't store
    username?: string;       // session exclusive, don't store
    sessionId?: string;     // session exclusive, don't store
}