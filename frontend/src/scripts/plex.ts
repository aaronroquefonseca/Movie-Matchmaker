import axios from 'axios';
import * as qs from 'qs';


const product = 'Movie Matchmaker';
const plexApiURL = 'https://plex.tv/api/v2';
const webAppUrl = window.location.href;

type pin = {
    id: string,
    code: string
}

async function createPin(clientIdentifier: string): Promise<pin|null> {
    const plexEndpoint = plexApiURL + '/pins';
  
    try {
      // Send the POST request with required headers and data
      const response = await axios.post(plexEndpoint, new URLSearchParams({
            'strong': 'true',
            'X-Plex-Product': product,
            'X-Plex-Client-Identifier': clientIdentifier,
        }).toString(), {
        headers: {
          'Accept': 'application/json',
        },
      });
  
      // Extract the relevant fields from the response
      const { id, code }: any = response.data;
  
      // Return the extracted fields
      if (!!id && !!code){
          return { id, code };
      }
      console.error('Something went wrong. id:' + id + ', code:' + code);
      return null;

    } catch (error) {
      console.error('Error creating Plex pin:', error);
      return null;
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
export async function getUser(clientIdentifier: string, userToken: string): Promise<string | null | ''> {
    const plexEndpoint = plexApiURL + '/user';
  
    try {
      const response:any = await axios.get(plexEndpoint, {
        headers: {
          'Accept': 'application/json',
          'X-Plex-Product': product,  // Your app name
          'X-Plex-Client-Identifier': clientIdentifier,  // Client identifier
          'X-Plex-Token': userToken,  // Your Plex token
        },
      });
  
      if (response.status === 200) {
          return response.data.username || 'User';
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

type oauth = {
    plexOauth: string,
    id: string,
    code: string
}

export async function getOauth(clientId: string): Promise<oauth|null> {
    try{
        const pin = await createPin(clientId);
        if(!pin) return null;

        const { id, code } = pin;

        if (id && code) {
            const plexOauth = 'https://app.plex.tv/auth#?' + qs.stringify({
                clientID: clientId,
                code: code,
                forwardUrl: webAppUrl + '/plex',
                context: {
                    device: {
                        product: product,
                    },
                },
            });
            return  {
                id,
                code,
                plexOauth
            };
        } else {
            console.error('Error creating Plex pin:', id, code);
            return null;
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
export async function getToken(clientId: string, pinId: string, pinCode: string): Promise<string | null> {
    const plexEndpoint = plexApiURL + '/pins/' + pinId;
    
    try {
        const response:any = await axios.get(plexEndpoint, {
            headers: {
                'Accept': 'application/json',
                'X-Plex-Client-Identifier': clientId,
            },
            params: {
                code: pinCode,
            },
        });
        return response.data.authToken || null;
    } catch (error) {
        console.error('Error getting Plex token:', error);
        throw error;
    }
}