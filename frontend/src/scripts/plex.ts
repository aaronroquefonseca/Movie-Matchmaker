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






export async function getPlexUser(clientIdentifier: string, userToken: string): Promise<string> {
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
  
      // Return the response data
      return response.data;            // TODO: Return only the username, not the whole response, if error code return ''.
    } catch (error) {
      console.error('Error fetching Plex user data:', error);
      throw error;
    }
  }


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
        
        return response.data
    } catch (error) {
        console.error('Error getting Plex token:', error);
        throw error;
    }
}