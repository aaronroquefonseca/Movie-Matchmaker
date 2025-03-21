import axios from 'axios';
import * as qs from 'qs';


const product = 'Movie Matchmaker';
const webAppUrl = window.location.href;


async function createPlexPin(clientIdentifier: string) {
    const PLEX_API_URL = 'https://plex.tv/api/v2/pins';
  
    try {
      // Send the POST request with required headers and data
      const response = await axios.post(PLEX_API_URL, null, {
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
    const PLEX_API_URL = 'https://plex.tv/api/v2/user';
  
    try {
      const response = await axios.get(PLEX_API_URL, {
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
    return '';
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
        }
    } catch (error) {
        console.error('Error getting Plex OAuth:', error);
        throw error;
    }
    return '';
}