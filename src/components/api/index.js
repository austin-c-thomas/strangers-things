const API_BASE_URL = 'https://strangers-things.herokuapp.com/api/2010-USD-RM-WEB-PT';

//RELEVANT ENDPOINTS
export const API_REGISTER = `${API_BASE_URL}/users/register`;
export const API_LOGIN =  `${API_BASE_URL}/users/login`;
export const API_ME = `${API_BASE_URL}/users/me`;
export const API_POSTS = `${API_BASE_URL}/posts`;


export const apiRequest = async ({url, method, body, token}) => {

    try {
        const template = {
            method: method ? method.toUpperCase() : 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };

        if (token) {
            template.headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, template);
        const data = await response.json();

        return data;

    } catch(error) {
        console.error(error);
    };
};