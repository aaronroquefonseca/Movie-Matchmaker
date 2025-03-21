import axios from 'axios';
import * as qs from 'qs';


const product = 'Movie Matchmaker';
const plexApiURL = 'https://plex.tv/api/v2';
const webAppUrl = window.location.href;


async function createPlexPin(clientIdentifier: string) {
    const plexEndpoint = plexApiURL + '/pins';
  
    try {
      // Send the POST request with required headers and data
      const response = await axios.post(plexEndpoint, null, {
        headers: {
          'Accept': 'application/json',
          'X-Plex-Product': product,  // Your app name
          'X-Plex-Client-Identifier': clientIdentifier,  // Client identifier
        },
        params: {
          'strong': 'true',  // Form data 'strong=true'
        },
      });
  
      // Extract the relevant fields from the response
      const { id, code } = response.data;
  
      // Return the extracted fields
      return { id, code };
    } catch (error) {
      console.error('Error creating Plex pin:', error);
      throw error;
    }
}





/**
 * Fetches the Plex username for a given user token.
 * Useful for verifying the token and getting the username.
 * 
 * @returns {Promise<string | null | ''>} 
 *  - The username if successful (or `'User'` if empty).  
 *  - `''` if the token is invalid (401). The token should be removed.  
 *  - `null` if an error occurs (e.g., network issue, server error).  
 * @throws {Error} If the request is malformed (400) or an unexpected error occurs.  
 */
export async function getPlexUser(clientIdentifier: string, userToken: string): Promise<string | null | ''> {
    const plexEndpoint = plexApiURL + '/user';
  
    try {
      const response = await axios.get(plexEndpoint, {
        headers: {
          'Accept': 'application/json',
          'X-Plex-Product': product,  // Your app name
          'X-Plex-Client-Identifier': clientIdentifier,  // Client identifier
          'X-Plex-Token': userToken,  // Your Plex token
        },
      });
  
      if (response.status === 200) {
        const username = response.data.username || 'User';
        return username;
      }
      console.error('HTTP status code not 200:', response.status);
      return null;

    } catch (error: any) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                console.log('Plex token is not valid anymore.');
                return '';
            } else if (status === 400) {
                console.error('Malformed request. Missing required parameters.');
                throw error;
            }
        }
        console.error('Error fetching Plex user data:', error);
        throw error;
    }
}


/**
 * Generates a Plex OAuth URL for user authentication.
 * 
 * @returns {Promise<string>} 
 *  - The OAuth URL if successful.  
 *  - `''` if the PIN creation fails.  
 * @throws {Error} If an unexpected error occurs during the process.  
 */
export async function getPlexOauth(clientId: string): Promise<string> {
    try{
        const { id, code } = await createPlexPin(clientId);
        if (id && code) {
            const plexOauth = 'https://app.plex.tv/auth#?' + qs.stringify({
                clientId: clientId,
                code: code,
                forwardUrl: webAppUrl + '/plex',
                context: {
                    device: {
                        product: product,
                    },
                },
            });
            return plexOauth;
        } else {
            console.error('Error creating Plex pin:', id, code);
            return '';
        }
    } catch (error) {
        console.error('Error getting Plex OAuth:', error);
        throw error;
    }
}

/**
 * Generates a Plex OAuth URL for user authentication.
 * 
 * @returns {Promise<string | null>} 
 *  - The plex token if successful.
 *  - `null` if the PIN hasn't been authorized yet.
 * @throws {Error} If an unexpected error occurs during the process.  
 */
export async function getPlexToken(clientId: string, pinId: string, pinCode: string): Promise<string | null> {
    const plexEndpoint = plexApiURL + '/pins/' + pinId;
    
    try {
        const response = await axios.get(plexEndpoint, {
            headers: {
                'Accept': 'application/json',
                'X-Plex-Client-Identifier': clientId,
            },
            params: {
                code: pinCode,
            },
        });
        const authToken = response.data.authToken || null;
        return authToken;
    } catch (error) {
        console.error('Error getting Plex token:', error);
        throw error;
    }
}