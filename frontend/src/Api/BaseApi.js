import axios from 'axios';
import ApiConfig from '../config/ApiConfig';

const _baseDevURL = ApiConfig.serverDevURL + ApiConfig.basePath;
const _baseProURL = ApiConfig.serverProURL + ApiConfig.basePath;

export const baseURL = process.env.NODE_ENV === 'production' ? _baseProURL : _baseDevURL;

export const requestMethod = {
    GET:    'GET',
    POST:   'POST',
    PUT:    'PUT',
    DELETE: 'DELETE',
    FILE:   'FILE'
};

const api = axios.create({
    baseURL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    timeout: ApiConfig.timeOut,
});

export async function sendRequest(endpoint, method, auth, postObj=null, params=null){
    const jsonParam = 'application/json';
    const formdataParam = 'multipart/form-data';
    if(auth) {
      let authToken = localStorage.getItem('access_token');
      api.defaults.headers.common['Authorization'] = "JWT "+authToken;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }

    if (params) {
      api.defaults.params = params
    } else {
      api.defaults.params = null
    }

    switch(method){
        case requestMethod.GET:
            api.defaults.headers.common['Accept'] = jsonParam;
            api.defaults.headers.common['Content-Type'] = jsonParam;
            return api.get(endpoint);
        case requestMethod.POST:
            api.defaults.headers.common['Accept'] = jsonParam;
            api.defaults.headers.common['Content-Type'] = jsonParam;
            return api.post(endpoint, postObj);
        case requestMethod.PUT:
            api.defaults.headers.common['Accept'] = jsonParam;
            api.defaults.headers.common['Content-Type'] = jsonParam;
            return api.put(endpoint, postObj);
        case requestMethod.FILE:
            api.defaults.headers.common['Accept'] = formdataParam;
            api.defaults.headers.common['Content-Type'] = formdataParam;
            return api.post(endpoint, postObj);
        case requestMethod.DELETE:
            return api.delete(endpoint);

        default:
            break;
    }
}
